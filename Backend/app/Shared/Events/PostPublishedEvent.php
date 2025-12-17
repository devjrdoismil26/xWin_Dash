<?php

namespace App\Shared\Events;

class PostPublishedEvent extends BaseDomainEvent
{
    public function __construct(
        int $postId,
        string $postContent,
        int $userId,
        ?int $projectId = null,
        ?string $postType = null,
        ?array $socialAccounts = null,
        ?array $metadata = null
    ) {
        parent::__construct(
            [
                'post_id' => $postId,
                'post_content' => $postContent,
                'post_type' => $postType,
                'social_accounts' => $socialAccounts,
            ],
            $userId,
            $projectId,
            $metadata
        );
    }

    public static function getEventType(): string
    {
        return 'post.published';
    }

    public function getPostId(): int
    {
        return $this->payload['post_id'];
    }

    public function getPostContent(): string
    {
        return $this->payload['post_content'];
    }

    public function getPostType(): ?string
    {
        return $this->payload['post_type'];
    }

    public function getSocialAccounts(): ?array
    {
        return $this->payload['social_accounts'];
    }
}