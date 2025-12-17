<?php

namespace App\Application\SocialBuffer\UseCases;

use App\Application\SocialBuffer\Commands\GetScheduleAnalyticsCommand; // Supondo que este Command exista
use App\Domains\SocialBuffer\Services\SocialInsightsService; // Supondo que este serviço exista

class GetScheduleAnalyticsUseCase
{
    protected SocialInsightsService $socialInsightsService;

    public function __construct(SocialInsightsService $socialInsightsService)
    {
        $this->socialInsightsService = $socialInsightsService;
    }

    /**
     * Executa o caso de uso para buscar analytics de uma grade de agendamento.
     *
     * @param GetScheduleAnalyticsCommand $command
     *
     * @return array os dados de analytics da grade de agendamento
     */
    public function execute(GetScheduleAnalyticsCommand $command): array
    {
        return $this->socialInsightsService->getScheduleAnalytics($command->scheduleId);
    }
}
