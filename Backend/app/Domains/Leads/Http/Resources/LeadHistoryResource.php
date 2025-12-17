<?php

namespace App\Domains\Leads\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class LeadHistoryResource extends JsonResource
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
        return [
            'id' => $this->id,
            'lead_id' => $this->lead_id,
            'event_type' => $this->event_type,
            'description' => $this->description,
            'properties' => $this->properties,
            'causer_id' => $this->causer_id,
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
        ];
    }
}
