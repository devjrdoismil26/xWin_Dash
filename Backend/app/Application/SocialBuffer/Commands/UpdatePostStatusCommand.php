<?php

namespace App\Application\SocialBuffer\Commands;

class UpdatePostStatusCommand
{
    public int $postId;

    public string $newStatus;

    public function __construct(int $postId, string $newStatus)
    {
        $this->postId = $postId;
        $this->newStatus = $newStatus;
    }
}
