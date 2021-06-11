<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderHistory extends Model
{
    protected $fillable = ['status', 'userId', 'orderId'];
    protected $table = "orders_history";
}
