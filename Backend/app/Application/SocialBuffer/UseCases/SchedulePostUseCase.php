<?php

namespace App\Application\SocialBuffer\UseCases;

use App\Application\SocialBuffer\Commands\SchedulePostCommand;
use App\Domains\SocialBuffer\Services\PostService; // Supondo que este serviço exista

class SchedulePostUseCase
{
    protected PostService $postService;

    public function __construct(PostService $postService)
    {
        $this->postService = $postService;
    }

    /**
     * Executa o caso de uso para agendar um post.
     *
     * @param SchedulePostCommand $command
     *
     * @return mixed o post agendado
     */
    public function execute(SchedulePostCommand $command)
    {
        return $this->postService->schedulePost($command->postId, $command->scheduledAt);
    }
}
