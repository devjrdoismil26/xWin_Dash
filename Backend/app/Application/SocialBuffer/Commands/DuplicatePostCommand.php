<?php

namespace App\Application\SocialBuffer\Commands;

use App\Domains\SocialBuffer\Models\Post;

class DuplicatePostCommand
{
    public function __construct(
        public readonly Post $post,
    ) {
    }
}
