<?php

namespace App\Http\Controllers;

use App\Http\Resources\DriverResource;
use Illuminate\Http\Request;
use App\Models\Driver;

class DriverController extends ApiController
{
    public function all(Request $request)
    {
        $drivers = Driver::all();
        return $this->respondSuccess(DriverResource::collection($drivers));
    }

    public function create(Request $request)
    {
        $driver = new Driver;

        $driver->name = $request['name'];
        $driver->phone = $request['phone'];

        $driver->save();

        return $this->respondSuccess($driver);
    }
}
