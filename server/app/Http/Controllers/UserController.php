<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Resources\UserCollection;

class UserController extends ApiController
{
    public function all(Request $request)
    {
        $users = User::orderBy('userName', 'asc')->get();
        // $users = User::orderBy('userName', 'asc')->paginate(30);
        // return $this->respondSuccess(UserResource::collection($users));

        return $this->respondSuccess(new UserCollection($users));
    }

    public function deleteUser(Request $request)
    {
        $usersIds = array_unique($request->usersIds);
        try {
            User::whereIn('id', $usersIds)->delete();
        } catch (\Exception $e) {
            return $this->respondWithError("Failed to delete user(s).");
        }

        return $this->respondSuccess([], 'user(s) was successfully deleted!');
    }
}
