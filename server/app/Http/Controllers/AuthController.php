<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\JWTAuth;
use Illuminate\Support\Facades\Validator;
use App\Models\Company;
use App\Models\User;
use App\Models\Role;
use App\Models\UserRole;
use App\Permissions\HasPermissionsTrait;

abstract class RoleName
{
    const Admin = 1;
    const Manager = 2;
    const Client = 3;
}

class AuthController extends ApiController
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    // use HasPermissionsTrait; //Import The Trait

    public function __construct()
    {
        // $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'userName' => 'required|min:3',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        if (!$token = auth('api')->attempt($validator->validated())) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $this->respondSuccess($this->createNewToken($token));
    }

    /**
     * Register a User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'userName' => 'required|string|between:2,100',
            'email' => 'required|string|email|max:100|unique:users',
            'password' => 'required|string|min:6',
            'phone' => 'required|string',
            'companyName' => 'string',
            // 'companyId' => 'int',
            'role' => 'required|string',
            'locationAddress' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }

        $allData = $validator->validated();
        // unset($allData['companyName']);
        // unset($allData['phone']);
        unset($allData['role']);
        // if ($request['companyId'] == 0) {
        //     try {
        //         $company = new Company;
        //         $company->name = $request['companyName'];
        //         $company->phone = $request['phone'];
        //         $company->save();
        //         $allData['companyId'] = $company['id'];
        //     } catch (\Exception $e) {
        //         throw $e;
        //     }
        //     // if ($request['companyBranches']) {
        //     //     $arr = explode(":", $request['companyBranches']);
        //     //     foreach ($arr as $branch) {
        //     //         try {
        //     //             $branch = new CompanyBranch;
        //     //             $branch->name = $request['companyName'];
        //     //             $branch->isMain = true;
        //     //             $branch->companyId = $company['id'];
        //     //             $branch->save();
        //     //         } catch (\Exception $e) {
        //     //             throw $e;
        //     //         }
        //     //     }
        //     // }
        // }

        $user = User::create(array_merge(
            $allData,
            ['password' => bcrypt($request->password)]
        ));

        $roleId = 3;
        switch ($request['role']) {
            case "manager":
                $roleId = 1;
                break;
            case "admin":
                $roleId = 2;
                break;
            case "client":
                $roleId = 3;
                break;
            case "accountant":
                $roleId = 4;
                break;
            case "agent":
                $roleId = 5;
                break;
        }

        UserRole::updateOrCreate(
            ['userId' => $user->id],
            ['roleId' => $roleId]
        );

        return $this->respondSuccess($user, 'User successfully registered');
    }


    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        try {
            auth('api')->logout();
        } catch (\Exception $e) {
            return $this->respondUnauthorized('Error token issue!');
        }
        return $this->respondSuccess([], 'User successfully signed out');
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->createNewToken(auth('api')->refresh());
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function userProfile()
    {
        $user = auth('api')->user();
        if ($user) {
            $user['roles'] = $user->roles;
        }
        return response()->json($user);
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function createNewToken($token)
    {
        $user = auth('api')->user();
        if ($user) {
            $user['roles'] = $user->roles;
        }
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => $user
        ]);
    }
}
