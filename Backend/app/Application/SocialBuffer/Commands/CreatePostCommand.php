<?php

namespace App\Application\SocialBuffer\Commands;

class CreatePostCommand
{
    public int $userId;

    public string $content;

    public ?array $mediaUrls;

    public array $platforms;

    public ?string $scheduledAt;

    public function __construct(int $userId, string $content, array $platforms, ?array $mediaUrls = null, ?string $scheduledAt = null)
    {
        $this->userId = $userId;
        $this->content = $content;
        $this->mediaUrls = $mediaUrls;
        $this->platforms = $platforms;
        $this->scheduledAt = $scheduledAt;
    }
}
