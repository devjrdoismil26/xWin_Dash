<?php

namespace App\Domains\SocialBuffer\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property mixed $total_posts
 * @property mixed $scheduled_posts
 * @property mixed $published_posts
 * @property mixed $total_engagement
 * @property mixed $average_engagement_rate
 * @property mixed $platform_breakdown
 */
class PostDashboardResource extends JsonResource
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
            'total_posts' => $this->total_posts,
            'scheduled_posts' => $this->scheduled_posts,
            'published_posts' => $this->published_posts,
            'total_engagement' => $this->total_engagement,
            'average_engagement_rate' => $this->average_engagement_rate,
            'platform_breakdown' => $this->platform_breakdown,
        ];
    }
}
