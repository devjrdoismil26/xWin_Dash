<?php

namespace App\Application\SocialBuffer\Commands;

class SchedulePostCommand
{
    public int $postId;

    public string $scheduledAt;

    public function __construct(int $postId, string $scheduledAt)
    {
        $this->postId = $postId;
        $this->scheduledAt = $scheduledAt;
    }
}
