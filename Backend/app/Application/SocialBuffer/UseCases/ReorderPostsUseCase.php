<?php

namespace App\Application\SocialBuffer\UseCases;

use App\Application\SocialBuffer\Commands\ReorderPostsCommand;
use App\Domains\SocialBuffer\Models\Post;

class ReorderPostsUseCase
{
    public function execute(ReorderPostsCommand $command): void
    {
        foreach ($command->postIds as $index => $postId) {
            Post::where('id', $postId)
                ->where('user_id', $command->userId)
                ->update(['order_column' => $index + 1]);
        }
    }
}
