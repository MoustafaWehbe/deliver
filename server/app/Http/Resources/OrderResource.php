<?php

namespace App\Http\Resources;

use Exception;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
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
        try {
            $client = $this->client;
        } catch (Exception $e) {
            // throw $e;
        }
        try {
            $driver = $this->driver;
        } catch (Exception $e) {
            // throw $e;
        }
        try {
            $branch = $this->branch;
        } catch (Exception $e) {
            // throw $e;
        }
        return [
            'id' => $this->id,
            'shipmentCode' => $this->shipmentCode,
            'receiverName' => $this->receiverName,
            'receiverPhone' => $this->receiverPhone,
            'receiverAddress' => $this->receiverAddress,
            'receiverLandmark' => $this->receiverLandmark,
            'currency' => $this->currency,
            'comment' => $this->comment,
            'weight' => $this->weight,
            'createdBy' => $this->createdBy,
            'fees' => $this->fees,
            'barcode' => $this->barcode,
            'status' => $this->status,
            'serviceType' => $this->serviceType,
            'itemDescription' => $this->itemDescription,
            'isPaid' => $this->isPaid,
            'isDelayed' => $this->isDelayed,
            'client' => $client,
            'driver' => $driver,
            'branch' => $branch,
            'created_at' => $this->created_at
        ];
    }
}
