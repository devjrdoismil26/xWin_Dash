<?php

namespace App\Domains\Core\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
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
            'user_id' => property_exists($resource, 'user_id') ? $resource->user_id : null,
            'message' => property_exists($resource, 'message') ? $resource->message : null,
            'type' => property_exists($resource, 'type') ? $resource->type : null,
            'link' => property_exists($resource, 'link') ? $resource->link : null,
            'read' => property_exists($resource, 'read') ? (bool) $resource->read : false,
            'created_at' => property_exists($resource, 'created_at') && $resource->created_at ? $resource->created_at->toDateTimeString() : null,
            'updated_at' => property_exists($resource, 'updated_at') && $resource->updated_at ? $resource->updated_at->toDateTimeString() : null,
        ];
    }
}
