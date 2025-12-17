<?php

namespace App\Domains\SocialBuffer\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
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
            'content' => $this->content,
            'status' => $this->status,
            'scheduled_at' => $this->scheduled_at ? $this->scheduled_at->toDateTimeString() : null,
            'published_at' => $this->published_at ? $this->published_at->toDateTimeString() : null,
            'user_id' => $this->user_id,
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
            // Adicione relacionamentos carregados, se necessário
            // 'social_accounts' => SocialAccountResource::collection($this->whenLoaded('socialAccounts')),
            // 'media' => MediaResource::collection($this->whenLoaded('media')),
        ];
    }
}
