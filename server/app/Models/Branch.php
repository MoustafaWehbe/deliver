<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    protected $fillable = ['name', 'userId', 'isMain'];
    protected $table = "branches";

    public function user() {
        return $this->belongsTo(User::class, 'userId');
    }
}
