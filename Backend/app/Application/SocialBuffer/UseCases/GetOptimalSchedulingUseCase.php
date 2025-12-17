<?php

namespace App\Application\SocialBuffer\UseCases;

use App\Application\SocialBuffer\Commands\GetOptimalSchedulingCommand;
use App\Domains\SocialBuffer\Services\SocialInsightsService; // Supondo que este serviço exista

class GetOptimalSchedulingUseCase
{
    protected SocialInsightsService $socialInsightsService;

    public function __construct(SocialInsightsService $socialInsightsService)
    {
        $this->socialInsightsService = $socialInsightsService;
    }

    /**
     * Executa o caso de uso para calcular os melhores horários de postagem.
     *
     * @param GetOptimalSchedulingCommand $command
     *
     * @return array os horários ideais de postagem
     */
    public function execute(GetOptimalSchedulingCommand $command): array
    {
        return $this->socialInsightsService->getOptimalSchedulingTimes(
            $command->userId,
            $command->platform,
            $command->contentType,
            $command->targetAudience,
        );
    }
}
