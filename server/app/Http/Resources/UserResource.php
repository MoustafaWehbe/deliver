<?php

namespace App\Http\Resources;

use Exception;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        // return parent::toArray($request);
        $roles = [];
        try {
            $roles = $this->roles;
        } catch (Exception $e) {
            throw $e;
        }
        try {
            $branches = $this->branches;
        } catch (Exception $e) {
            throw $e;
        }
        return [
            'id' => $this->id,
            'userName' => $this->userName,
            'email' => $this->email,
            'phone' => $this->phone,
            'locationAddress' => $this->locationAddress,
            'institution' => $this->institution,
            'companyName' => $this->companyName,
            'branches' => $branches,
            'roles' => $roles,
        ];
    }
}
