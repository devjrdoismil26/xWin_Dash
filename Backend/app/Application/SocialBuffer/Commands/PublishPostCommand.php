<?php

namespace App\Application\SocialBuffer\Commands;

class PublishPostCommand
{
    public int $postId;

    public ?array $platforms;

    public function __construct(int $postId, ?array $platforms = null)
    {
        $this->postId = $postId;
        $this->platforms = $platforms;
    }
}
