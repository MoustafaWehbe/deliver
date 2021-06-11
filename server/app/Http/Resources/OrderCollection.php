<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class OrderCollection extends ResourceCollection
{
    private $pagination;
    private $transfered = false;

    public function __construct($resource, $transfered)
    {
        $this->pagination = [
            'total' => $resource->total(),
            'count' => $resource->count(),
            'per_page' => $resource->perPage(),
            'current_page' => $resource->currentPage(),
            'total_pages' => $resource->lastPage()
        ];

        $this->transfered = $transfered;

        $resource = $resource->getCollection();

        parent::__construct($resource);
    }

    public function toArray($request)
    {
        return [
            'orders' => $this->transfered ? TransferedOrderResource::collection($this->collection) : OrderResource::collection($this->collection),
            'pagination' => $this->pagination
        ];
    }
}
