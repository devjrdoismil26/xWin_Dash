<?php

namespace App\Domains\SocialBuffer\DTOs;

use DateTimeImmutable;

class PostDataDTO
{
    public string $content;

    public array $mediaUrls;

    public array $platformIds;

    public ?DateTimeImmutable $scheduledAt;

    public ?array $hashtags;

    public function __construct(
        string $content,
        array $mediaUrls = [],
        array $platformIds = [],
        ?DateTimeImmutable $scheduledAt = null,
        ?array $hashtags = null,
    ) {
        $this->content = $content;
        $this->mediaUrls = $mediaUrls;
        $this->platformIds = $platformIds;
        $this->scheduledAt = $scheduledAt;
        $this->hashtags = $hashtags;
    }

    public function toArray(): array
    {
        return [
            'content' => $this->content,
            'media_urls' => $this->mediaUrls,
            'platform_ids' => $this->platformIds,
            'scheduled_at' => $this->scheduledAt ? $this->scheduledAt->format('Y-m-d H:i:s') : null,
            'hashtags' => $this->hashtags,
        ];
    }
}
