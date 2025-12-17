<?php

namespace App\Application\SocialBuffer\UseCases;

use App\Application\SocialBuffer\Commands\GetCalendarViewCommand;
use App\Domains\SocialBuffer\Services\PostService; // Supondo que este serviço exista

class GetCalendarViewUseCase
{
    protected PostService $postService;

    public function __construct(PostService $postService)
    {
        $this->postService = $postService;
    }

    /**
     * Executa o caso de uso para buscar dados para a visualização de calendário.
     *
     * @param GetCalendarViewCommand $command
     *
     * @return array os posts agendados para o período
     */
    public function execute(GetCalendarViewCommand $command): array
    {
        return $this->postService->getScheduledPostsForCalendar(
            $command->userId,
            $command->startDate,
            $command->endDate,
            $command->platforms,
        );
    }
}
