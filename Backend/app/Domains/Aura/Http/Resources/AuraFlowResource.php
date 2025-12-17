<?php

namespace App\Domains\Aura\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AuraFlowResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'is_active' => $this->is_active,
            'triggers' => $this->triggers,
            'structure' => $this->structure,
            'variables' => $this->variables,
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
