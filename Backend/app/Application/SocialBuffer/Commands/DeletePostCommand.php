<?php

namespace App\Application\SocialBuffer\Commands;

use App\Domains\SocialBuffer\Models\Post;

class DeletePostCommand
{
    public function __construct(
        public readonly Post $post,
    ) {
    }
}
