<?php

namespace App\Domains\AI\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class GeminiHistoryResource extends JsonResource
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
        // O objeto $this->resource seria uma coleção de mensagens de chat
        return [
            'chat_id' => $this->id, // ID da sessão de chat
            'user_id' => $this->user_id,
            'history' => ChatResponseResource::collection($this->whenLoaded('messages')), // Usa o outro resource para as mensagens
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
