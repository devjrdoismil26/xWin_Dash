<?php

namespace App\Domains\AI\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ChatResponseResource extends JsonResource
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
        // Este resource pode formatar um DTO ou um Model que represente uma mensagem de chat
        return [
            'id' => $this->id, // ID da mensagem ou da geração
            'role' => $this->role, // 'user' ou 'model' (ou 'assistant')
            'content' => $this->content,
            'model_used' => $this->when(isset($this->model_used), $this->model_used),
            'timestamp' => $this->created_at->toIso8601String(),
            'usage' => $this->when(isset($this->usage_meta), $this->usage_meta),
        ];
    }
}
