<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderCollection;
use App\Http\Resources\OrderResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\Order;
use App\Models\OrderHistory;
use Carbon\Carbon;
use Exception;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class OrderExport implements FromCollection, WithHeadings
{
    private $date = '';
    private $assigned = '';
    private $driverId = '';

    public function __construct($date, $driverId, $assigned)
    {
        $this->date = $date;
        $this->driverId = $driverId;
        $this->assigned = $assigned;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        $d = date_format(date_create($this->date), "Y-m-d");

        $order_array = array();
        $orders_data = array();

        if (!$this->assigned) {
            $orders_data = DB::select("select o.*, u.companyName as companyName from orders o join users u
            on u.id = o.customerId where o.isPaid=1 and Date(o.created_at) >= '" . $d . "'");
        } else {
            if ($this->driverId) {
                $orders_data = DB::select("select o.*, u.companyName as companyName from orders o join users u
                on u.id = o.customerId where status='assigned' and driverId = " . $this->driverId . " and Date(o.created_at) >= '" . $d . "'");
            } else {
                $orders_data = DB::select("select o.*, u.companyName as companyName from orders o join users u
                on u.id = o.customerId where status='assigned' and Date(o.created_at) >= '" . $d . "'");
            }
        }
        foreach ($orders_data as $order) {
            $order_array[] = array(
                'Id' => $order->id,
                'date' => $d,
                'Company Name' => $order->companyName,
                'Shipment Code' => $order->shipmentCode,
                'Receiver Name' => $order->receiverName,
                'Receiver Phone' => $order->receiverPhone,
                'Receiver Address' => $order->receiverAddress,
                'Receiver Landmark' => $order->receiverLandmark,
                'Status' => $order->status,
                'Cash Collection' => $order->fees,
                'Currency' => $order->currency,
                'Barcode' => $order->barcode,
                'Service Type' => $order->serviceType,
                'Comment' => $order->comment,
                'Item Description' => $order->itemDescription,
            );
        }

        return collect($order_array);
    }

    public function headings(): array
    {
        return [
            'Id',
            'date',
            'Company Name',
            'Shipment Code',
            'Receiver Name',
            'Receiver Phone',
            'Receiver Address',
            'Receiver Landmark',
            'Status',
            'Cash Collection',
            'Currency',
            'Barcode',
            'Service Type',
            'Comment',
            'Item Description'
        ];
    }
}

class OrderController extends ApiController
{
    public function all(Request $request)
    {
        $status = $request->input('status'); // pending, spotOrder (and assigned), finished, returned, canceled
        $clientId = $request->input('clientId');
        $transfered = $request->input('transfered');
        $q = $request->input('q');
        $filterByKey = $request->input('filterByKey');
        $filterByValue = $request->input('filterByValue');

        return $this->getOrders($status, $clientId, $transfered ? true : false, $q, $filterByKey, $filterByValue);
    }

    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'shipmentCode' => 'required|string|between:2,100',
            'receiverName' => 'required|string',
            'receiverPhone' => 'required|string',
            'receiverAddress' => 'required|string',
            'receiverLandmark' => 'required|string',
            'status' => 'required|string',
            'customerId' => 'integer|nullable',
            'driverId' => 'integer|nullable',
            'branchId' => 'integer|nullable',
            'fees' => 'required|regex:/^\d+(\.\d{1,2})?$/',
            'currency' => 'required|string',
            'barcode' => 'string|nullable',
            'serviceType' => 'required|string',
            'itemDescription' => 'string|nullable',
            'isPaid' => 'boolean',
            'isDelayed' => 'boolean',
            'isTransferedConfirmed' => 'boolean',
            'comment' => 'string|nullable',
            'weight' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }

        $allData = $validator->validated();

        $user = auth('api')->user();
        $allData['createdBy'] = $user['userName'];

        // $allData['status'] = "pending";
        try {
            $order = Order::create($allData);
        } catch (Exception $e) {
            throw $e;
        }

        return $this->respondSuccess(new OrderResource($order), 'Order created successfully');
    }

    public function update(Request $request, $orderId)
    {
        $validator = Validator::make($request->all(), [
            'shipmentCode' => 'required|string|between:2,100',
            'receiverName' => 'required|string',
            'receiverPhone' => 'required|string',
            'receiverAddress' => 'required|string',
            'receiverLandmark' => 'required|string',
            'customerId' => 'required|numeric|nullable',
            'status' => 'required|string',
            'driverId' => 'numeric|nullable',
            'branchId' => 'numeric|nullable',
            'fees' => 'required|numeric',
            'currency' => 'required|string',
            'lastTransferBranchId' => 'numeric|nullable',
            'barcode' => 'string|nullable',
            'serviceType' => 'required|string',
            'itemDescription' => 'string|nullable',
            'isDelayed' => 'boolean',
            'isPaid' => 'boolean',
            'isTransferedConfirmed' => 'boolean',
            'comment' => 'string|nullable',
            'weight' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }

        $user = auth('api')->user();
        $allData = $validator->validated();

        if (!isset($allData['isTransferedConfirmed'])) {
            $allData['isTransferedConfirmed'] = false;
        }
        if (!isset($allData['isPaid'])) {
            $allData['isPaid'] = false;
        }
        $insertHistoryRecordIfStatusChanged = false;
        $insertHistoryRecordIfIsPaidChanged = false;
        $insertHistoryRecordIfStatus = "";

        $origOrder = Order::findOrFail($orderId);
        if (!$origOrder) {
            return $this->respondWithError('Failed to find order!');
        }

        if ($origOrder->status != $allData['status']) {
            $insertHistoryRecordIfStatusChanged = true;
            $insertHistoryRecordIfStatus = $allData['status'];
        }
        if ($origOrder['isTransferedConfirmed'] != $allData['isTransferedConfirmed']) {
            $insertHistoryRecordIfStatusChanged = true;
            $insertHistoryRecordIfStatus = 'Confirmed transfer';
        }

        if ($origOrder['isPaid'] != $allData['isPaid']) {
            $insertHistoryRecordIfIsPaidChanged = true;
        }

        $shouldExit = false;
        foreach ($allData as $key => $value) {
            if ($key == "fees" && $value != $origOrder['fees'] && !$user->isAdmin()) {
                $shouldExit = true;
            }
            $origOrder[$key] = $value;
        }
        if ($shouldExit) {
            return $this->respondUnauthorized('Only manager can update the fees!');
        }

        try {
            $origOrder->save();
        } catch (Exception $e) {
            return $this->respondWithError('Failed to update Order');
        }

        if ($insertHistoryRecordIfStatusChanged) {
            try {
                OrderHistory::create(
                    [
                        'status' => $insertHistoryRecordIfStatus,
                        'userId' => $user['id'],
                        'orderId' => $origOrder['id']
                    ]
                );
            } catch (Exception $e) {
                return $this->respondWithError('Failed to update Order');
            }
        }
        if ($insertHistoryRecordIfIsPaidChanged) {
            try {
                OrderHistory::create(
                    [
                        'status' => $origOrder['isPaid'] ? "Closed" : "Unclose",
                        'userId' => $user['id'],
                        'orderId' => $origOrder['id']
                    ]
                );
            } catch (Exception $e) {
                return $this->respondWithError('Failed to update Order');
            }
        }

        return $this->respondSuccess(new OrderResource($origOrder), 'Order updated successfully');
    }

    public function history(Request $request, $orderId)
    {
        $orders_histry = DB::select("select oh.orderId as id, oh.status, oh.created_at, u.userName from orders_history oh join users u
        on u.id = oh.userId where oh.orderId=" . $orderId . ' order by oh.created_at desc');
        return $this->respondSuccess($orders_histry, 'success');
    }

    public function deleteOrder(Request $request)
    {
        $ordersIds = array_unique($request->ordersIds);
        try {
            Order::whereIn('id', $ordersIds)->delete();
            OrderHistory::whereIn('orderId', $ordersIds)->delete();
        } catch (\Exception $e) {
            return $this->respondWithError("Failed to delete order.");
        }

        return $this->respondSuccess([], 'order was successfully deleted!');
    }

    public function transferToBranch(Request $request, $branchId)
    {
        $user = auth('api')->user();
        $ordersIds = array_unique($request->ordersIds);

        try {
            Order::whereIn('id', $ordersIds)->update(['lastTransferBranchId' => $branchId]);
            foreach ($ordersIds as $oId) {
                OrderHistory::create(
                    [
                        'status' => 'Transfered',
                        'userId' => $user['id'],
                        'orderId' => $oId
                    ]
                );
            }
        } catch (\Exception $e) {
            return $this->respondWithError("Failed to update records.");
        }
        return $this->respondSuccess([], "Order(s) transfered successfully");
    }

    public function assignToDriver(Request $request, $driverId)
    {
        $user = auth('api')->user();
        $ordersIds = array_unique($request->ordersIds);
        try {
            Order::whereIn('id', $ordersIds)->update(['driverId' => $driverId, 'status' => 'assigned']);
            foreach ($ordersIds as $oId) {
                OrderHistory::create(
                    [
                        'status' => 'Assigned',
                        'userId' => $user['id'],
                        'orderId' => $oId
                    ]
                );
            }
        } catch (\Exception $e) {
            return $this->respondWithError("Failed to update records.");
        }
        return $this->respondSuccess([], "Order(s) assigned successfully");
    }

    public function changeStatus(Request $request)
    {
        $status = $request->status;
        $user = auth('api')->user();
        $ordersIds = array_unique($request->ordersIds);

        if (!$status) {
            return $this->respondWithError("Status is not provided.");
        }
        try {
            Order::whereIn('id', $ordersIds)->update(['status' => $status]);
            foreach ($ordersIds as $oId) {
                OrderHistory::create(
                    [
                        'status' => $status,
                        'userId' => $user['id'],
                        'orderId' => $oId
                    ]
                );
            }
        } catch (\Exception $e) {
            return $this->respondWithError("Failed to update records.");
        }
        return $this->respondSuccess([], "Order(s) updated successfully");
    }

    public function generatePaidOrders(Request $request)
    {
        return Excel::download(new OrderExport($request->input('date'), $request->input('driverId'), false), 'paidOrders.csv', \Maatwebsite\Excel\Excel::CSV, [
            'Content-Type' => 'text/csv',
        ]);
    }

    public function generateAssignedOrders(Request $request)
    {
        return Excel::download(new OrderExport($request->input('date'), $request->input('driverId'), true), 'assignedOrders.csv', \Maatwebsite\Excel\Excel::CSV, [
            'Content-Type' => 'text/csv',
        ]);
    }

    private function getOrders($status, $clientId, bool $transfered, $q, $filterByKey, $filterByValue)
    {
        $orders = [];
        $user = auth('api')->user();
        $isClient = $user->isClient();

        $orders = Order::latest()->where(function ($query) use ($user, $clientId, $isClient, $status, $transfered, $q, $filterByKey, $filterByValue) {
            $rawQuery = '';
            if ($filterByKey) {
                switch ($filterByKey) {
                    case 'driver':
                        $rawQuery = '(driverId is Not Null and driverId = ' . $filterByValue . ') and ';
                        break;
                    case 'company':
                        $rawQuery = '(customerId is Not Null and customerId = ' . $filterByValue . ') and ';
                        break;
                    case 'branch':
                        $rawQuery = '(branchId is Not Null and branchId = ' . $filterByValue . ') and ';
                        break;
                    case 'serviceType':
                        $rawQuery = '(serviceType is Not Null and serviceType = "' . $filterByValue . '") and ';
                        break;
                    default:
                        break;
                }
            }
            if ($q) {
                $rawQuery .= '(id="' . $q . '" or receiverName like "%' . $q . '" or receiverPhone like "%' . $q . '%" or shipmentCode like "%' . $q . '%" or itemDescription like "%' . $q . '%") and ';
            }
            if ($transfered) {
                $rawQuery .= '(lastTransferBranchId is Not Null and (lastTransferBranchId <> branchId or branchId is Null))';
            } else {
                $rawQuery .= '(lastTransferBranchId is Null or lastTransferBranchId = branchId)';
            }
            $query->whereRaw($rawQuery);

            if (!isset($status)) {
                if ($isClient == true) {
                    $query->where('customerId', $user->id);
                } else {
                    if ($clientId) {
                        $query->where('customerId', $clientId);
                    }
                }
            } else {
                if ($isClient == true) {
                    if ($status == "spotOrder") {
                        $query->where('customerId', $user->id)
                            ->where(function ($query) {
                                // $query->where('status', '=', 'pending')
                                $query->orWhere('status', '=', 'spotOrder')
                                    ->orWhere('status', '=', 'assigned');
                            });
                    } else {
                        $query->where('customerId', $user->id)
                            ->where(function ($query2) use ($status) {
                                $query2->where('status', '=', $status);
                            });
                    }
                } else {
                    if ($clientId) {
                        if ($status == "spotOrder") {
                            $query->where('customerId', $user->id)
                                ->where(function ($query2) {
                                    // $query2->where('status', '=', 'pending')
                                    $query2->orWhere('status', '=', 'spotOrder')
                                        ->orWhere('status', '=', 'assigned');
                                });
                        } else {
                            $query->where('customerId', $user->id)
                                ->where(function ($query2) use ($status) {
                                    $query2->where('status', '=', $status);
                                });
                        }
                    } else {
                        if ($status == "spotOrder") {
                            $query->where(function ($query2) {
                                // $query2->where('status', '=', 'pending')
                                $query2->orWhere('status', '=', 'spotOrder')
                                    ->orWhere('status', '=', 'assigned');
                            });
                        } else {
                            $query->where(function ($query2) use ($status) {
                                $query2->where('status', '=', $status);
                            });
                        }
                    }
                }
            }
        })
            ->get()
            ->paginate(30);

        return $this->respondSuccess(new OrderCollection($orders, $transfered));
    }
}
