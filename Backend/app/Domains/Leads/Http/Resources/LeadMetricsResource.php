<?php

namespace App\Domains\Leads\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class LeadMetricsResource extends JsonResource
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
            'lead_id' => $this->lead_id,
            'score' => $this->score,
            'status' => $this->status,
            'last_activity_at' => $this->last_activity_at ? $this->last_activity_at->toDateTimeString() : null,
            'total_activities' => $this->total_activities,
            // Adicione outras métricas conforme necessário
        ];
    }
}
