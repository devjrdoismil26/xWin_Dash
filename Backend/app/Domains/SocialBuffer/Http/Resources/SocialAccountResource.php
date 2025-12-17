<?php

namespace App\Domains\SocialBuffer\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SocialAccountResource extends JsonResource
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
            'platform' => $this->platform,
            'username' => $this->username,
            'access_token' => $this->access_token, // Cuidado ao expor tokens em produção
            'expires_at' => $this->expires_at ? $this->expires_at->toDateTimeString() : null,
            'user_id' => $this->user_id,
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
        ];
    }
}
