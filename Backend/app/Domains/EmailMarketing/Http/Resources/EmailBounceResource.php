<?php

namespace App\Domains\EmailMarketing\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EmailBounceResource extends JsonResource
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
            'email_log_id' => $this->email_log_id,
            'bounce_type' => $this->bounce_type,
            'reason' => $this->reason,
            'bounced_at' => $this->bounced_at->toDateTimeString(),
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
        ];
    }
}
