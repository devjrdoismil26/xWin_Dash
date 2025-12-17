<?php

namespace App\Domains\Leads\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class LeadResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'source' => $this->source,
            'status' => $this->status,
            'score' => $this->score,
            'tags' => $this->tags,
            'custom_fields' => $this->custom_fields,
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
            // Adicione relacionamentos carregados, se necessário
            // 'history' => LeadHistoryResource::collection($this->whenLoaded('history')),
            // 'custom_values' => LeadCustomValueResource::collection($this->whenLoaded('customValues')),
        ];
    }
}
