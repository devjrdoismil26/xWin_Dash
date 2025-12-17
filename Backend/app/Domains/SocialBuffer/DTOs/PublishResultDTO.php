<?php

namespace App\Domains\SocialBuffer\DTOs;

class PublishResultDTO
{
    public bool $success;

    public ?string $message;

    public ?string $platformPostId;

    public ?string $platform;

    public ?string $postUrl;

    public function __construct(
        bool $success,
        ?string $message = null,
        ?string $platformPostId = null,
        ?string $platform = null,
        ?string $postUrl = null,
    ) {
        $this->success = $success;
        $this->message = $message;
        $this->platformPostId = $platformPostId;
        $this->platform = $platform;
        $this->postUrl = $postUrl;
    }

    public function toArray(): array
    {
        return [
            'success' => $this->success,
            'message' => $this->message,
            'platform_post_id' => $this->platformPostId,
            'platform' => $this->platform,
            'post_url' => $this->postUrl,
        ];
    }
}
