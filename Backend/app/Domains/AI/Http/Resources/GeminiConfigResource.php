<?php

namespace App\Domains\AI\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class GeminiConfigResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        // O objeto $this->resource seria um DTO ou Model com as configurações do Gemini
        return [
            'project_id' => $this->project_id,
            'location' => $this->location,
            'enabled_models' => $this->enabled_models, // Lista de modelos habilitados
            // NUNCA exponha a chave de API ou outras credenciais aqui.
        ];
    }
}
