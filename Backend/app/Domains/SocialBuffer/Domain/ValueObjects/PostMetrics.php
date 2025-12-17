<?php

namespace App\Domains\SocialBuffer\Domain\ValueObjects;

class PostMetrics
{
    public int $views = 0;
    public int $likes = 0;
    public int $comments = 0;
    public int $shares = 0;
    public int $clicks = 0;
    public int $saves = 0;
    public int $reactions = 0;
    public float $engagementRate = 0.0;
    public float $clickThroughRate = 0.0;
    public float $reach = 0.0;
    public float $impressions = 0.0;

    public function __construct(
        int $views = 0,
        int $likes = 0,
        int $comments = 0,
        int $shares = 0,
        int $clicks = 0,
        int $saves = 0,
        int $reactions = 0,
        float $engagementRate = 0.0,
        float $clickThroughRate = 0.0,
        float $reach = 0.0,
        float $impressions = 0.0
    ) {
        $this->views = $views;
        $this->likes = $likes;
        $this->comments = $comments;
        $this->shares = $shares;
        $this->clicks = $clicks;
        $this->saves = $saves;
        $this->reactions = $reactions;
        $this->engagementRate = $engagementRate;
        $this->clickThroughRate = $clickThroughRate;
        $this->reach = $reach;
        $this->impressions = $impressions;
    }

    public static function empty(): self
    {
        return new self();
    }

    public static function fromArray(array $data): self
    {
        return new self(
            views: $data['views'] ?? 0,
            likes: $data['likes'] ?? 0,
            comments: $data['comments'] ?? 0,
            shares: $data['shares'] ?? 0,
            clicks: $data['clicks'] ?? 0,
            saves: $data['saves'] ?? 0,
            reactions: $data['reactions'] ?? 0,
            engagementRate: $data['engagement_rate'] ?? 0.0,
            clickThroughRate: $data['click_through_rate'] ?? 0.0,
            reach: $data['reach'] ?? 0.0,
            impressions: $data['impressions'] ?? 0.0
        );
    }

    public function toArray(): array
    {
        return [
            'views' => $this->views,
            'likes' => $this->likes,
            'comments' => $this->comments,
            'shares' => $this->shares,
            'clicks' => $this->clicks,
            'saves' => $this->saves,
            'reactions' => $this->reactions,
            'engagement_rate' => $this->engagementRate,
            'click_through_rate' => $this->clickThroughRate,
            'reach' => $this->reach,
            'impressions' => $this->impressions
        ];
    }

    public function getTotalEngagement(): int
    {
        return $this->likes + $this->comments + $this->shares + $this->saves + $this->reactions;
    }

    public function getEngagementRate(): float
    {
        if ($this->impressions === 0) {
            return 0.0;
        }
        return round(($this->getTotalEngagement() / $this->impressions) * 100, 2);
    }

    public function getClickThroughRate(): float
    {
        if ($this->impressions === 0) {
            return 0.0;
        }
        return round(($this->clicks / $this->impressions) * 100, 2);
    }

    public function getReachRate(): float
    {
        if ($this->impressions === 0) {
            return 0.0;
        }
        return round(($this->reach / $this->impressions) * 100, 2);
    }

    public function incrementViews(int $count = 1): void
    {
        $this->views += $count;
    }

    public function incrementLikes(int $count = 1): void
    {
        $this->likes += $count;
    }

    public function incrementComments(int $count = 1): void
    {
        $this->comments += $count;
    }

    public function incrementShares(int $count = 1): void
    {
        $this->shares += $count;
    }

    public function incrementClicks(int $count = 1): void
    {
        $this->clicks += $count;
    }

    public function incrementSaves(int $count = 1): void
    {
        $this->saves += $count;
    }

    public function incrementReactions(int $count = 1): void
    {
        $this->reactions += $count;
    }

    public function updateEngagementRate(float $rate): void
    {
        $this->engagementRate = $rate;
    }

    public function updateClickThroughRate(float $rate): void
    {
        $this->clickThroughRate = $rate;
    }

    public function updateReach(float $reach): void
    {
        $this->reach = $reach;
    }

    public function updateImpressions(float $impressions): void
    {
        $this->impressions = $impressions;
    }

    public function addMetrics(PostMetrics $other): self
    {
        return new self(
            views: $this->views + $other->views,
            likes: $this->likes + $other->likes,
            comments: $this->comments + $other->comments,
            shares: $this->shares + $other->shares,
            clicks: $this->clicks + $other->clicks,
            saves: $this->saves + $other->saves,
            reactions: $this->reactions + $other->reactions,
            engagementRate: ($this->engagementRate + $other->engagementRate) / 2,
            clickThroughRate: ($this->clickThroughRate + $other->clickThroughRate) / 2,
            reach: $this->reach + $other->reach,
            impressions: $this->impressions + $other->impressions
        );
    }

    public function isHighEngagement(): bool
    {
        return $this->getEngagementRate() > 5.0;
    }

    public function isLowEngagement(): bool
    {
        return $this->getEngagementRate() < 1.0;
    }

    public function isViral(): bool
    {
        return $this->getEngagementRate() > 10.0 && $this->shares > 100;
    }

    public function getPerformanceScore(): int
    {
        $score = 0;

        // Engagement score (0-40 points)
        $engagementRate = $this->getEngagementRate();
        if ($engagementRate > 10) {
            $score += 40;
        } elseif ($engagementRate > 5) {
            $score += 30;
        } elseif ($engagementRate > 2) {
            $score += 20;
        } elseif ($engagementRate > 1) {
            $score += 10;
        }

        // Reach score (0-30 points)
        if ($this->reach > 10000) {
            $score += 30;
        } elseif ($this->reach > 5000) {
            $score += 20;
        } elseif ($this->reach > 1000) {
            $score += 10;
        }

        // CTR score (0-30 points)
        $ctr = $this->getClickThroughRate();
        if ($ctr > 5) {
            $score += 30;
        } elseif ($ctr > 2) {
            $score += 20;
        } elseif ($ctr > 1) {
            $score += 10;
        }

        return min($score, 100);
    }

    public function getPerformanceLevel(): string
    {
        $score = $this->getPerformanceScore();

        if ($score >= 80) {
            return 'excellent';
        }
        if ($score >= 60) {
            return 'good';
        }
        if ($score >= 40) {
            return 'average';
        }
        if ($score >= 20) {
            return 'poor';
        }
        return 'very_poor';
    }
}
