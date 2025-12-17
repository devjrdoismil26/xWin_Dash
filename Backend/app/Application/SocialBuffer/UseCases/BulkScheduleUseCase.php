<?php

namespace App\Application\SocialBuffer\UseCases;

use App\Application\SocialBuffer\Commands\BulkScheduleCommand;
use App\Domains\SocialBuffer\Services\PostService; // Supondo que este serviço exista

class BulkScheduleUseCase
{
    protected PostService $postService;

    public function __construct(PostService $postService)
    {
        $this->postService = $postService;
    }

    /**
     * Executa o caso de uso para agendamento em massa de posts.
     *
     * @param BulkScheduleCommand $command
     *
     * @return array o resultado do agendamento em massa
     */
    public function execute(BulkScheduleCommand $command): array
    {
        $results = [];
        foreach ($command->postsData as $postData) {
            // Assumindo que postData contém content, platforms, scheduledAt, etc.
            $results[] = $this->postService->createAndSchedulePost(
                $command->userId,
                $postData['content'],
                $postData['platforms'],
                $postData['scheduled_at'],
            );
        }
        return $results;
    }
}
