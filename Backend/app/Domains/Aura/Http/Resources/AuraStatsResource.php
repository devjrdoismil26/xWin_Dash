<?php

namespace App\Domains\Aura\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AuraStatsResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'connection_id' => $this->connection_id,
            'date' => $this->date,
            'messages_sent' => $this->messages_sent,
            'messages_received' => $this->messages_received,
            'chats_opened' => $this->chats_opened,
            'chats_closed' => $this->chats_closed,
            'avg_response_time' => $this->avg_response_time,
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
