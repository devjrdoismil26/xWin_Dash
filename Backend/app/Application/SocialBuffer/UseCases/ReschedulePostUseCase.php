<?php

namespace App\Application\SocialBuffer\UseCases;

use App\Application\SocialBuffer\Commands\ReschedulePostCommand;
use App\Domains\SocialBuffer\Services\PostService; // Supondo que este serviço exista

class ReschedulePostUseCase
{
    protected PostService $postService;

    public function __construct(PostService $postService)
    {
        $this->postService = $postService;
    }

    /**
     * Executa o caso de uso para reagendar um post.
     *
     * @param ReschedulePostCommand $command
     *
     * @return mixed o post reagendado
     */
    public function execute(ReschedulePostCommand $command)
    {
        return $this->postService->reschedulePost($command->postId, $command->newScheduledAt);
    }
}
