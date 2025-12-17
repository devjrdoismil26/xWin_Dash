<?php

namespace App\Domains\SocialBuffer\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property mixed $total_engagement
 * @property mixed $likes
 * @property mixed $comments
 * @property mixed $shares
 * @property mixed $clicks
 * @property mixed $impressions
 * @property mixed $reach
 * @property mixed $engagement_rate
 * @property mixed $platform_breakdown
 */
class PostAnalyticsResource extends JsonResource
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
            'total_engagement' => $this->total_engagement,
            'likes' => $this->likes,
            'comments' => $this->comments,
            'shares' => $this->shares,
            'clicks' => $this->clicks,
            'impressions' => $this->impressions,
            'reach' => $this->reach,
            'engagement_rate' => $this->engagement_rate,
            'platform_breakdown' => $this->platform_breakdown,
        ];
    }
}
