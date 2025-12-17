<?php

namespace App\Application\SocialBuffer\UseCases;

use App\Application\SocialBuffer\Commands\BulkScheduleCommand; // Reutilizando o command
use App\Domains\SocialBuffer\Services\PostService; // Supondo que este serviço exista

class BulkCreateAndSchedulePostsUseCase
{
    protected PostService $postService;

    public function __construct(PostService $postService)
    {
        $this->postService = $postService;
    }

    /**
     * Executa o caso de uso para criar e agendar múltiplos posts.
     *
     * @param BulkScheduleCommand $command
     *
     * @return array o resultado da operação
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
                $postData['scheduled_at'] ?? null, // Pode ser nulo para posts não agendados
            );
        }
        return $results;
    }
}
