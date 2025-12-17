<?php

namespace App\Domains\Core\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ActivityLogResource extends JsonResource
{
    /**
     * @property int|string $id
     * @property string|null $log_name
     * @property string|null $description
     * @property string|null $subject_type
     * @property int|string|null $subject_id
     * @property string|null $causer_type
     * @property int|string|null $causer_id
     * @property mixed $properties
     * @property \Illuminate\Support\Carbon|null $created_at
     * @property \Illuminate\Support\Carbon|null $updated_at
     *
     * @param mixed $request
     */
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
            'log_name' => property_exists($resource, 'log_name') ? $resource->log_name : null,
            'description' => property_exists($resource, 'description') ? $resource->description : null,
            'subject_type' => property_exists($resource, 'subject_type') ? $resource->subject_type : null,
            'subject_id' => property_exists($resource, 'subject_id') ? $resource->subject_id : null,
            'causer_type' => property_exists($resource, 'causer_type') ? $resource->causer_type : null,
            'causer_id' => property_exists($resource, 'causer_id') ? $resource->causer_id : null,
            'properties' => property_exists($resource, 'properties') ? $resource->properties : null,
            'created_at' => property_exists($resource, 'created_at') && $resource->created_at ? $resource->created_at->toDateTimeString() : null,
            'updated_at' => property_exists($resource, 'updated_at') && $resource->updated_at ? $resource->updated_at->toDateTimeString() : null,
        ];
    }
}
