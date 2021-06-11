<?php

namespace App\Http\Controllers;

use App\Http\Resources\BranchResource;
use App\Models\Branch;
use Illuminate\Http\Request;

class BranchController extends ApiController
{
    public function all(Request $request)
    {
        $branches = Branch::all();
        return $this->respondSuccess(BranchResource::collection($branches));
    }

    public function create(Request $request)
    {
        $branch = new Branch;

        $branch->name = $request['name'];
        $branch->userId = $request['userId'];
        $branch->isMain = $request['isMain'] ?: false;

        $branch->save();

        return $this->respondSuccess($branch);
    }
}
