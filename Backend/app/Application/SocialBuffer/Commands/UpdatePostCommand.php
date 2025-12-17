<?php

namespace App\Application\SocialBuffer\Commands;

class UpdatePostCommand
{
    public int $postId;

    public ?string $content;

    public ?array $mediaUrls;

    public ?array $platforms;

    public ?string $scheduledAt;

    public function __construct(int $postId, ?string $content = null, ?array $mediaUrls = null, ?array $platforms = null, ?string $scheduledAt = null)
    {
        $this->postId = $postId;
        $this->content = $content;
        $this->mediaUrls = $mediaUrls;
        $this->platforms = $platforms;
        $this->scheduledAt = $scheduledAt;
    }
}
