<?php

namespace App\Domains\Aura\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AuraConnectionResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'phone_number' => $this->phone_number,
            'business_name' => $this->business_name,
            'connection_type' => $this->connection_type,
            'status' => $this->status,
            'credentials' => $this->when($request->user()?->can('view-credentials', $this), $this->credentials),
            'settings' => $this->settings,
            'webhook_config' => $this->webhook_config,
            'last_activity_at' => $this->last_activity_at?->toIso8601String(),
            'connected_at' => $this->connected_at?->toIso8601String(),
            'disconnected_at' => $this->disconnected_at?->toIso8601String(),
            'error_message' => $this->error_message,
            'messages_sent_today' => $this->messages_sent_today,
            'messages_received_today' => $this->messages_received_today,
            'created_at' => $this->created_at->toIso8601String(),
            'chats_count' => $this->whenCounted('chats'),
            'active_chats_count' => $this->chats()->where('status', 'active')->count(),
        ];
    }
}
