<?php

namespace App\Http\Resources;

use Exception;
use Illuminate\Http\Resources\Json\JsonResource;

class TransferedOrderResource extends OrderResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        // return parent::toArray($request);
        $company = [];
        try {
            $company = $this->company;
        } catch (Exception $e) {
            // throw $e;
        }
        try {
            $client = $this->client;
        } catch (Exception $e) {
            // throw $e;
        }
        try {
            $driver = $this->driver;
        } catch (Exception $e) {
            // throw $e;
        }
        try {
            $branch = $this->branch;
        } catch (Exception $e) {
            // throw $e;
        }
        try {
            $lastTransferBranch = $this->lastTransferBranch;
        } catch (Exception $e) {
            // throw $e;
        }
        return [
            'id' => $this->id,
            'shipmentCode' => $this->shipmentCode,
            'receiverName' => $this->receiverName,
            'receiverPhone' => $this->receiverPhone,
            'receiverAddress' => $this->receiverAddress,
            'receiverLandmark' => $this->receiverLandmark,
            'createdBy' => $this->createdBy,
            'fees' => $this->fees,
            'currency' => $this->currency,
            'barcode' => $this->barcode,
            'comment' => $this->comment,
            'weight' => $this->weight,
            'isTransferedConfirmed' => $this->isTransferedConfirmed,
            'status' => $this->status,
            'serviceType' => $this->serviceType,
            'itemDescription' => $this->itemDescription,
            'isPaid' => $this->isPaid,
            'isDelayed' => $this->isDelayed,
            'company' => $company,
            'client' => $client,
            'driver' => $driver,
            'branch' => $branch,
            'lastTransferBranch' => $lastTransferBranch
        ];
    }
}
