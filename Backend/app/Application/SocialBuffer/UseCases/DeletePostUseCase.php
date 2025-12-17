<?php

namespace App\Application\SocialBuffer\UseCases;

use App\Application\SocialBuffer\Commands\DeletePostCommand;

class DeletePostUseCase
{
    public function execute(DeletePostCommand $command): bool
    {
        $post = $command->post;
        // Delete schedules and the post itself
        $post->schedules()->delete();

        return $post->delete();
    }
}
