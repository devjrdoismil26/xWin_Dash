<?php

namespace App\Domains\Aura\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AuraMessageResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'chat_id' => $this->chat_id,
            'whatsapp_message_id' => $this->whatsapp_message_id,
            'direction' => $this->direction,
            'type' => $this->type,
            'content' => $this->content,
            'media' => $this->media,
            'status' => $this->status,
            'metadata' => $this->metadata,
            'is_template' => $this->is_template,
            'template_name' => $this->template_name,
            'template_params' => $this->template_params,
            'error_message' => $this->error_message,
            'read_at' => $this->read_at?->toIso8601String(),
            'sent_at' => $this->sent_at?->toIso8601String(),
            'delivered_at' => $this->delivered_at?->toIso8601String(),
            'created_at' => $this->created_at->toIso8601String(),
            'sent_by' => $this->whenLoaded('sentBy'),
        ];
    }
}
