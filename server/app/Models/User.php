<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use PhpParser\Builder\Use_;
use Tymon\JWTAuth\Contracts\JWTSubject;


class User extends Authenticatable implements JWTSubject
{
    // use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'userName',
        'email',
        'password',
        'phone',
        // 'companyId',
        'companyName',
        'locationAddress'
    ];
    protected $table = "users";

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier() {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims() {
        return [];
    }

    public function company() {
    	return $this->hasOne(Company::class, 'id');
    }

    public function branches() {
    	return $this->hasMany(Branch::class, 'userId');
    }

    public function roles() {
        return $this->belongsToMany(Role::class, 'users_roles', 'userId', 'roleId');
    }

    public function isAdmin() {
        foreach ($this->roles as $role) {
            if ($role->name == "admin") {
                return true;
            }
        }
        return false;
    }

    public function isAccountant() {
        foreach ($this->roles as $role) {
            if ($role->name == "accountant") {
                return true;
            }
        }
        return false;
    }

    public function isAgent() {
        foreach ($this->roles as $role) {
            if ($role->name == "agent") {
                return true;
            }
        }
        return false;
    }

    public function isManager() {
        foreach ($this->roles as $role) {
            if ($role->name == "manager") {
                return true;
            }
        }
        return false;
    }

    public function isClient() {
        foreach ($this->roles as $role) {
            if ($role->name == "client") {
                return true;
            }
        }
        return false;
    }
}
