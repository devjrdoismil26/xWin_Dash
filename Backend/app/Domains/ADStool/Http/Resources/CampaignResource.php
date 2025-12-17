<?php

namespace App\Domains\ADStool\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CampaignResource extends JsonResource
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
            'platform' => $this->resource->platform,
            'status' => $this->resource->status,
            'daily_budget' => $this->resource->daily_budget,
            'objective' => $this->resource->objective,
            'start_date' => $this->resource->start_date->format('d/m/Y'),
            'end_date' => $this->resource->end_date ? $this->resource->end_date->format('d/m/Y') : null,
            'created_at' => $this->resource->created_at->toIso8601String(),
            'updated_at' => $this->resource->updated_at->toIso8601String(),
            // Exemplo de como incluir dados de uma relação
            // 'creatives' => CreativeResource::collection($this->whenLoaded('creatives')),
            // Exemplo de como adicionar um link
            '_links' => [
                'self' => route('adstool.campaigns.show', $this->resource->id),
            ],
        ];
    }
}
