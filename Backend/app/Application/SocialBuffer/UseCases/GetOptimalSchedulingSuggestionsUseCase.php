<?php

namespace App\Application\SocialBuffer\UseCases;

use App\Application\SocialBuffer\Commands\GetOptimalSchedulingSuggestionsCommand;
use App\Domains\SocialBuffer\Services\SocialInsightsService; // Supondo que este serviço exista

class GetOptimalSchedulingSuggestionsUseCase
{
    protected SocialInsightsService $socialInsightsService;

    public function __construct(SocialInsightsService $socialInsightsService)
    {
        $this->socialInsightsService = $socialInsightsService;
    }

    /**
     * Executa o caso de uso para gerar sugestões de agendamento.
     *
     * @param GetOptimalSchedulingSuggestionsCommand $command
     *
     * @return array as sugestões de agendamento
     */
    public function execute(GetOptimalSchedulingSuggestionsCommand $command): array
    {
        return $this->socialInsightsService->getOptimalSchedulingSuggestions(
            $command->userId,
            $command->platform,
            $command->contentType,
            $command->numberOfSuggestions,
        );
    }
}
