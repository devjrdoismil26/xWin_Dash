<?php

namespace App\Domains\EmailMarketing\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EmailMetricResource extends JsonResource
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
            'metric_type' => $this->metric_type,
            'occurred_at' => $this->occurred_at->toDateTimeString(),
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
        ];
    }
}
