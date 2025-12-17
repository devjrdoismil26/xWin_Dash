<?php

namespace App\Domains\ADStool\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CreativeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array<string, mixed>
     */
    /**
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->resource->id,
            'name' => $this->resource->name,
            'type' => $this->resource->type,
            'content' => $this->resource->content,
            'headline' => $this->resource->headline,
            'description' => $this->resource->description,
            'campaign_id' => $this->resource->campaign_id,
            'created_at' => $this->resource->created_at->toIso8601String(),
        ];
    }
}
