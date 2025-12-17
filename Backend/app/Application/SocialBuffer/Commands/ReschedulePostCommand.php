<?php

namespace App\Application\SocialBuffer\Commands;

class ReschedulePostCommand
{
    public int $postId;

    public string $newScheduledAt;

    public function __construct(int $postId, string $newScheduledAt)
    {
        $this->postId = $postId;
        $this->newScheduledAt = $newScheduledAt;
    }
}
