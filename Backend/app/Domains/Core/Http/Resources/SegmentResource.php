<?php

namespace App\Domains\Core\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SegmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        $resource = $this->resource;
        return [
            'id' => property_exists($resource, 'id') ? $resource->id : null,
            'name' => property_exists($resource, 'name') ? $resource->name : null,
            'description' => property_exists($resource, 'description') ? $resource->description : null,
            'rules' => property_exists($resource, 'rules') ? $resource->rules : null, // Assumindo que regras são um array ou JSON
            'created_at' => property_exists($resource, 'created_at') && $resource->created_at ? $resource->created_at->toDateTimeString() : null,
            'updated_at' => property_exists($resource, 'updated_at') && $resource->updated_at ? $resource->updated_at->toDateTimeString() : null,
        ];
    }
}
