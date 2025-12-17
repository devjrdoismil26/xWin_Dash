<?php

namespace App\Domains\SocialBuffer\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property mixed $id
 * @property mixed $platform
 * @property mixed $type
 * @property mixed $content
 * @property mixed $author
 * @property mixed $created_at
 * @property mixed $status
 * @property mixed $post_id
 * @property mixed $social_account_id
 */
class EngagementResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'platform' => $this->platform,
            'type' => $this->type,
            'content' => $this->content,
            'author' => $this->author,
            'created_at' => $this->created_at,
            'status' => $this->status,
            'post_id' => $this->post_id,
            'social_account_id' => $this->social_account_id,
        ];
    }
}
