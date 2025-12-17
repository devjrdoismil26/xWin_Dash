<?php

namespace App\Domains\Aura\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AuraChatResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'connection_id' => $this->connection_id,
            'contact_phone' => $this->contact_phone,
            'contact_name' => $this->contact_name,
            'contact_avatar' => $this->contact_avatar,
            'status' => $this->status,
            'assigned_to' => $this->assigned_to,
            'lead_id' => $this->lead_id,
            'contact_info' => $this->contact_info,
            'labels' => $this->labels,
            'is_business' => $this->is_business,
            'is_group' => $this->is_group,
            'group_name' => $this->group_name,
            'group_participants' => $this->group_participants,
            'unread_count' => $this->unread_count,
            'last_message_at' => $this->last_message_at?->toIso8601String(),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
            'connection' => $this->whenLoaded('connection'),
            'messages' => AuraMessageResource::collection($this->whenLoaded('messages')),
            'assigned_user' => $this->whenLoaded('assignedUser'),
            'lead' => $this->whenLoaded('lead'),
        ];
    }
}
