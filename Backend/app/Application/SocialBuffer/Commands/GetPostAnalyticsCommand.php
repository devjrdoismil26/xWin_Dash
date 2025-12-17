<?php

namespace App\Application\SocialBuffer\Commands;

class GetPostAnalyticsCommand
{
    public function __construct(
        public readonly string $postId,
    ) {
    }
}
