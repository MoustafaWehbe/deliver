<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class UserRole extends Model
{
 	protected $table = "users_roles";
 	// protected $primaryKey = "id";
 	protected $fillable = ['userId', 'roleId'];

}
