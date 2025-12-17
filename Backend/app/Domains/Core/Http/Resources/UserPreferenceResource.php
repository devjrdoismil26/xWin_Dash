<?php

namespace App\Domains\Core\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserPreferenceResource extends JsonResource
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
            'theme' => property_exists($resource, 'theme') ? $resource->theme : null,
            'language' => property_exists($resource, 'language') ? $resource->language : null,
            'notifications_enabled' => property_exists($resource, 'notifications_enabled') ? (bool) $resource->notifications_enabled : false,
            'dashboard_layout' => property_exists($resource, 'dashboard_layout') ? $resource->dashboard_layout : null,
            'created_at' => property_exists($resource, 'created_at') && $resource->created_at ? $resource->created_at->toDateTimeString() : null,
            'updated_at' => property_exists($resource, 'updated_at') && $resource->updated_at ? $resource->updated_at->toDateTimeString() : null,
        ];
    }
}
