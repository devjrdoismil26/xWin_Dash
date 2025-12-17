<?php

namespace App\Domains\EmailMarketing\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EmailLinkResource extends JsonResource
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
            'campaign_id' => $this->campaign_id,
            'original_url' => $this->original_url,
            'tracked_url' => $this->tracked_url,
            'clicks' => $this->clicks,
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
        ];
    }
}
