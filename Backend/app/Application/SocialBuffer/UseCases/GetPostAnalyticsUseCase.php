<?php

namespace App\Application\SocialBuffer\UseCases;

use App\Application\SocialBuffer\Commands\GetPostAnalyticsCommand; // Supondo que este Command exista
use App\Domains\SocialBuffer\Services\SocialInsightsService; // Supondo que este serviço exista

class GetPostAnalyticsUseCase
{
    protected SocialInsightsService $socialInsightsService;

    public function __construct(SocialInsightsService $socialInsightsService)
    {
        $this->socialInsightsService = $socialInsightsService;
    }

    /**
     * Executa o caso de uso para buscar analytics de um post.
     *
     * @param GetPostAnalyticsCommand $command
     *
     * @return array os dados de analytics do post
     */
    public function execute(GetPostAnalyticsCommand $command): array
    {
        return $this->socialInsightsService->getPostAnalytics($command->postId);
    }
}
