<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'shipmentCode', 'receiverName', 'receiverPhone', 'customerId', 'driverId', 'branchId', 'lastTransferBranchId',
        'receiverAddress', 'receiverLandmark', 'createdBy', 'fees', 'barcode', 'status', 'serviceType',
        'currency', 'itemDescription', 'isPaid', 'weight', 'comment', 'isTransferedConfirmed', 'isDelayed'
    ];
    protected $table = "orders";

    public function client()
    {
        return $this->belongsTo(User::class, 'customerId');
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class, 'branchId');
    }

    public function lastTransferBranch()
    {
        return $this->belongsTo(Branch::class, 'lastTransferBranchId');
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class, 'driverId');
    }
}
