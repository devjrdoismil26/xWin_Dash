<?php

namespace App\Domains\ADStool\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CampaignMetricResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        // Este resource pode ser usado para formatar um DTO, não apenas um Model.
        // Exemplo: return new CampaignMetricResource(new AnalyticsSummaryDTO(...));

        return [
            'impressions' => $this->resource->impressions ?? 0,
            'clicks' => $this->resource->clicks ?? 0,
            'cost' => round($this->resource->cost ?? 0.0, 2),
            'conversions' => $this->resource->conversions ?? 0,
            'ctr' => round($this->resource->ctr ?? 0.0, 2),
            'cpc' => round($this->resource->cpc ?? 0.0, 2),
            'cpa' => round($this->resource->cpa ?? 0.0, 2),
            'date' => isset($this->resource->date) ? $this->resource->date->format('Y-m-d') : null,
        ];
    }
}
