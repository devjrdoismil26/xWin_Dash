<?php

namespace App\Application\SocialBuffer\UseCases;

use App\Application\SocialBuffer\Commands\UpdatePostCommand;
use App\Domains\SocialBuffer\Models\Post;

class UpdatePostUseCase
{
    public function execute(UpdatePostCommand $command): Post
    {
        $post = $command->post;
        $post->update($command->validatedData);

        return $post;
    }
}
