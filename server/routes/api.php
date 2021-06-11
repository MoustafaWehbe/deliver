<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('/login', 'AuthController@login');
    Route::post('/register', 'AuthController@register');
    Route::get('/logout', 'AuthController@logout');
    Route::post('/refresh', 'AuthController@refresh');
    Route::get('/profile', 'AuthController@userProfile');
});

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['middleware' => ['jwt.verify', 'admin']], function () {
    Route::prefix('/users')->group(function () {
        Route::get('all', 'UserController@all');
        Route::post('delete', 'UserController@deleteUser');
    });

    Route::prefix('/drivers')->group(function () {
        Route::get('all', 'DriverController@all');
        Route::post('create', 'DriverController@create');
    });

    Route::prefix('/orders')->group(function () {
        Route::post('update/{orderId}', 'OrderController@update');
        Route::post('transferToBranch/{branchId}', 'OrderController@transferToBranch');
        Route::post('assignToDriver/{driverId}', 'OrderController@assignToDriver');
        Route::post('delete', 'OrderController@deleteOrder');
        Route::post('changeStatus', 'OrderController@changeStatus');
        Route::get('generatePaidOrders', 'OrderController@generatePaidOrders');
        Route::get('generateAssignedOrders', 'OrderController@generateAssignedOrders');
    });
    Route::prefix('/branches')->group(function () {
        Route::get('all', 'BranchController@all');
        Route::post('create', 'BranchController@create');
    });
});

Route::group(['middleware' => ['jwt.verify']], function () {
    Route::prefix('/orders')->group(function () {
        Route::get('all', 'OrderController@all');
        Route::post('create', 'OrderController@create');
        Route::get('history/{orderId}', 'OrderController@history');
    });
});
