<?php

namespace App\Domains\Workflows\ValueObjects;

class SocialPostNodeConfig
{
    public function __construct(
        public readonly array $platforms,
        public readonly string $content,
        public readonly array $mediaUrls = [],
        public readonly ?string $scheduledAt = null,
        public readonly array $hashtags = []
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['platforms'],
            $data['content'],
            $data['media_urls'] ?? [],
            $data['scheduled_at'] ?? null,
            $data['hashtags'] ?? []
        );
    }

    public function toArray(): array
    {
        return [
            'platforms' => $this->platforms,
            'content' => $this->content,
            'media_urls' => $this->mediaUrls,
            'scheduled_at' => $this->scheduledAt,
            'hashtags' => $this->hashtags,
        ];
    }
}
