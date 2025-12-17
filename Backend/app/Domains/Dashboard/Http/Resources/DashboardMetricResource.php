<?php

namespace App\Domains\Dashboard\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DashboardMetricResource extends JsonResource
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
            'id' => $this->id ?? null,
            'name' => $this->name ?? null,
            'value' => $this->value ?? 0,
            'type' => $this->type ?? 'count',
            'period' => $this->period ?? 'daily',
            'trend' => $this->trend ?? null,
            'change_percentage' => $this->change_percentage ?? null,
            'widget_id' => $this->widget_id ?? null,
            'user_id' => $this->user_id ?? null,
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
        ];
    }
}
