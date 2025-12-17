<?php

namespace App\Domains\ADStool\Application\Services;

use App\Domains\ADStool\Application\Services\ADSCampaignService;
use App\Domains\ADStool\Application\Services\ADSAnalyticsService;
use App\Domains\ADStool\Application\UseCases\CreateCreativeUseCase;
use App\Domains\ADStool\Application\UseCases\CreateAccountUseCase;
use App\Domains\ADStool\Domain\ADSCampaign;
use App\Domains\ADStool\Domain\Creative;
use App\Domains\ADStool\Domain\Account;
use Illuminate\Support\Facades\Log;

/**
 * Application Service para ADStool
 *
 * Orquestra serviços especializados e fornece interface unificada
 * para operações de campanhas ADS, analytics e recursos.
 */
class ADStoolApplicationService
{
    private ADSCampaignService $adsCampaignService;
    private ADSAnalyticsService $adsAnalyticsService;
    private CreateCreativeUseCase $createCreativeUseCase;
    private CreateAccountUseCase $createAccountUseCase;

    public function __construct(
        ADSCampaignService $adsCampaignService,
        ADSAnalyticsService $adsAnalyticsService,
        CreateCreativeUseCase $createCreativeUseCase,
        CreateAccountUseCase $createAccountUseCase
    ) {
        $this->adsCampaignService = $adsCampaignService;
        $this->adsAnalyticsService = $adsAnalyticsService;
        $this->createCreativeUseCase = $createCreativeUseCase;
        $this->createAccountUseCase = $createAccountUseCase;
    }

    // ===== CAMPAIGN OPERATIONS =====

    /**
     * Cria uma nova campanha ADS
     */
    public function createCampaign(array $data): array
    {
        try {
            return $this->adsCampaignService->createCampaign($data);
        } catch (\Throwable $exception) {
            Log::error('Error in ADStoolApplicationService::createCampaign', [
                'error' => $exception->getMessage(),
                'data' => $data
            ]);

            throw $exception;
        }
    }

    /**
     * Atualiza uma campanha ADS existente
     */
    public function updateCampaign(int $campaignId, array $data): array
    {
        try {
            return $this->adsCampaignService->updateCampaign($campaignId, $data);
        } catch (\Throwable $exception) {
            Log::error('Error in ADStoolApplicationService::updateCampaign', [
                'error' => $exception->getMessage(),
                'campaignId' => $campaignId,
                'data' => $data
            ]);

            throw $exception;
        }
    }

    /**
     * Remove uma campanha ADS
     */
    public function deleteCampaign(int $campaignId): array
    {
        try {
            return $this->adsCampaignService->deleteCampaign($campaignId);
        } catch (\Throwable $exception) {
            Log::error('Error in ADStoolApplicationService::deleteCampaign', [
                'error' => $exception->getMessage(),
                'campaignId' => $campaignId
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém uma campanha ADS por ID
     */
    public function getCampaign(int $campaignId): array
    {
        try {
            return $this->adsCampaignService->getCampaign($campaignId);
        } catch (\Throwable $exception) {
            Log::error('Error in ADStoolApplicationService::getCampaign', [
                'error' => $exception->getMessage(),
                'campaignId' => $campaignId
            ]);

            throw $exception;
        }
    }

    /**
     * Lista campanhas ADS com filtros
     */
    public function listCampaigns(array $filters = []): array
    {
        try {
            return $this->adsCampaignService->listCampaigns($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in ADStoolApplicationService::listCampaigns', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Busca campanhas por termo
     */
    public function searchCampaigns(string $term, array $filters = []): array
    {
        try {
            return $this->adsCampaignService->searchCampaigns($term, $filters);
        } catch (\Throwable $exception) {
            Log::error('Error in ADStoolApplicationService::searchCampaigns', [
                'error' => $exception->getMessage(),
                'term' => $term,
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém campanhas por status
     */
    public function getCampaignsByStatus(string $status, array $filters = []): array
    {
        try {
            return $this->adsCampaignService->getCampaignsByStatus($status, $filters);
        } catch (\Throwable $exception) {
            Log::error('Error in ADStoolApplicationService::getCampaignsByStatus', [
                'error' => $exception->getMessage(),
                'status' => $status,
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém campanhas por plataforma
     */
    public function getCampaignsByPlatform(string $platform, array $filters = []): array
    {
        try {
            return $this->adsCampaignService->getCampaignsByPlatform($platform, $filters);
        } catch (\Throwable $exception) {
            Log::error('Error in ADStoolApplicationService::getCampaignsByPlatform', [
                'error' => $exception->getMessage(),
                'platform' => $platform,
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém campanhas por conta
     */
    public function getCampaignsByAccount(int $accountId, array $filters = []): array
    {
        try {
            return $this->adsCampaignService->getCampaignsByAccount($accountId, $filters);
        } catch (\Throwable $exception) {
            Log::error('Error in ADStoolApplicationService::getCampaignsByAccount', [
                'error' => $exception->getMessage(),
                'accountId' => $accountId,
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém campanhas por usuário
     */
    public function getCampaignsByUser(int $userId, array $filters = []): array
    {
        try {
            return $this->adsCampaignService->getCampaignsByUser($userId, $filters);
        } catch (\Throwable $exception) {
            Log::error('Error in ADStoolApplicationService::getCampaignsByUser', [
                'error' => $exception->getMessage(),
                'userId' => $userId,
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém campanhas ativas
     */
    public function getActiveCampaigns(array $filters = []): array
    {
        try {
            return $this->adsCampaignService->getActiveCampaigns($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in ADStoolApplicationService::getActiveCampaigns', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém campanhas pausadas
     */
    public function getPausedCampaigns(array $filters = []): array
    {
        try {
            return $this->adsCampaignService->getPausedCampaigns($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in ADStoolApplicationService::getPausedCampaigns', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém estatísticas de campanhas
     */
    public function getCampaignStatistics(array $filters = []): array
    {
        try {
            return $this->adsCampaignService->getCampaignStatistics($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in ADStoolApplicationService::getCampaignStatistics', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém campanhas com melhor performance
     */
    public function getTopPerformingCampaigns(int $limit = 10, array $filters = []): array
    {
        try {
            return $this->adsCampaignService->getTopPerformingCampaigns($limit, $filters);
        } catch (\Throwable $exception) {
            Log::error('Error in ADStoolApplicationService::getTopPerformingCampaigns', [
                'error' => $exception->getMessage(),
                'limit' => $limit,
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém campanhas com pior performance
     */
    public function getWorstPerformingCampaigns(int $limit = 10, array $filters = []): array
    {
        try {
            return $this->adsCampaignService->getWorstPerformingCampaigns($limit, $filters);
        } catch (\Throwable $exception) {
            Log::error('Error in ADStoolApplicationService::getWorstPerformingCampaigns', [
                'error' => $exception->getMessage(),
                'limit' => $limit,
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    // ===== ANALYTICS OPERATIONS =====

    /**
     * Obtém analytics gerais
     */
    public function getGeneralAnalytics(array $filters = []): array
    {
        try {
            return $this->adsAnalyticsService->getGeneralAnalytics($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in ADStoolApplicationService::getGeneralAnalytics', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém analytics por plataforma
     */
    public function getPlatformAnalytics(array $filters = []): array
    {
        try {
            return $this->adsAnalyticsService->getPlatformAnalytics($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in ADStoolApplicationService::getPlatformAnalytics', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém analytics por período
     */
    public function getPeriodAnalytics(string $period = '30d', array $filters = []): array
    {
        try {
            return $this->adsAnalyticsService->getPeriodAnalytics($period, $filters);
        } catch (\Throwable $exception) {
            Log::error('Error in ADStoolApplicationService::getPeriodAnalytics', [
                'error' => $exception->getMessage(),
                'period' => $period,
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém analytics de performance
     */
    public function getPerformanceAnalytics(array $filters = []): array
    {
        try {
            return $this->adsAnalyticsService->getPerformanceAnalytics($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in ADStoolApplicationService::getPerformanceAnalytics', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém analytics de orçamento
     */
    public function getBudgetAnalytics(array $filters = []): array
    {
        try {
            return $this->adsAnalyticsService->getBudgetAnalytics($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in ADStoolApplicationService::getBudgetAnalytics', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    // ===== CREATIVE OPERATIONS =====

    /**
     * Cria um novo creative
     */
    public function createCreative(array $data): array
    {
        try {
            return $this->createCreativeUseCase->execute($data);
        } catch (\Throwable $exception) {
            Log::error('Error in ADStoolApplicationService::createCreative', [
                'error' => $exception->getMessage(),
                'data' => $data
            ]);

            throw $exception;
        }
    }

    // ===== ACCOUNT OPERATIONS =====

    /**
     * Cria uma nova conta
     */
    public function createAccount(array $data): array
    {
        try {
            return $this->createAccountUseCase->execute($data);
        } catch (\Throwable $exception) {
            Log::error('Error in ADStoolApplicationService::createAccount', [
                'error' => $exception->getMessage(),
                'data' => $data
            ]);

            throw $exception;
        }
    }

    // ===== CONVENIENCE METHODS =====

    /**
     * Obtém dashboard completo do ADStool
     */
    public function getDashboard(array $filters = []): array
    {
        try {
            return $this->adsAnalyticsService->getDashboard($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in ADStoolApplicationService::getDashboard', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém estatísticas resumidas
     */
    public function getSummaryStatistics(array $filters = []): array
    {
        try {
            $campaignStats = $this->getCampaignStatistics($filters);
            $generalAnalytics = $this->getGeneralAnalytics($filters);

            return [
                'total_campaigns' => $campaignStats['total_campaigns'] ?? 0,
                'active_campaigns' => $campaignStats['active_campaigns'] ?? 0,
                'paused_campaigns' => $campaignStats['paused_campaigns'] ?? 0,
                'total_budget' => $campaignStats['total_budget'] ?? 0,
                'total_spent' => $campaignStats['total_spent'] ?? 0,
                'total_impressions' => $campaignStats['total_impressions'] ?? 0,
                'total_clicks' => $campaignStats['total_clicks'] ?? 0,
                'average_ctr' => $campaignStats['average_ctr'] ?? 0,
                'average_cpc' => $campaignStats['average_cpc'] ?? 0,
                'budget_utilization' => $generalAnalytics['budget']['budget_utilization'] ?? 0,
            ];
        } catch (\Throwable $exception) {
            Log::error('Error in ADStoolApplicationService::getSummaryStatistics', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }
}
