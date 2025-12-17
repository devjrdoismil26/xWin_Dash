<?php

namespace App\Domains\ADStool\Application\Services;

use App\Domains\ADStool\Application\UseCases\CreateADSCampaignUseCase;
use App\Domains\ADStool\Application\UseCases\UpdateADSCampaignUseCase;
use App\Domains\ADStool\Application\UseCases\DeleteADSCampaignUseCase;
use App\Domains\ADStool\Application\UseCases\GetADSCampaignUseCase;
use App\Domains\ADStool\Application\UseCases\ListADSCampaignsUseCase;
use App\Domains\ADStool\Application\Commands\CreateADSCampaignCommand;
use App\Domains\ADStool\Application\Commands\UpdateADSCampaignCommand;
use App\Domains\ADStool\Application\Commands\DeleteADSCampaignCommand;
use App\Domains\ADStool\Application\Queries\GetADSCampaignQuery;
use App\Domains\ADStool\Application\Queries\ListADSCampaignsQuery;
use App\Domains\ADStool\Domain\ADSCampaign;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

/**
 * Serviço especializado para gerenciamento de campanhas ADS
 */
class ADSCampaignService
{
    private CreateADSCampaignUseCase $createCampaignUseCase;
    private UpdateADSCampaignUseCase $updateCampaignUseCase;
    private DeleteADSCampaignUseCase $deleteCampaignUseCase;
    private GetADSCampaignUseCase $getCampaignUseCase;
    private ListADSCampaignsUseCase $listCampaignsUseCase;

    public function __construct(
        CreateADSCampaignUseCase $createCampaignUseCase,
        UpdateADSCampaignUseCase $updateCampaignUseCase,
        DeleteADSCampaignUseCase $deleteCampaignUseCase,
        GetADSCampaignUseCase $getCampaignUseCase,
        ListADSCampaignsUseCase $listCampaignsUseCase
    ) {
        $this->createCampaignUseCase = $createCampaignUseCase;
        $this->updateCampaignUseCase = $updateCampaignUseCase;
        $this->deleteCampaignUseCase = $deleteCampaignUseCase;
        $this->getCampaignUseCase = $getCampaignUseCase;
        $this->listCampaignsUseCase = $listCampaignsUseCase;
    }

    /**
     * Cria uma nova campanha ADS
     */
    public function createCampaign(array $data): array
    {
        try {
            $command = CreateADSCampaignCommand::fromArray($data);
            return $this->createCampaignUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in ADSCampaignService::createCampaign', [
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
            $command = UpdateADSCampaignCommand::fromArray(array_merge($data, ['id' => $campaignId]));
            return $this->updateCampaignUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in ADSCampaignService::updateCampaign', [
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
            $command = DeleteADSCampaignCommand::fromArray(['id' => $campaignId]);
            return $this->deleteCampaignUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in ADSCampaignService::deleteCampaign', [
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
            $query = GetADSCampaignQuery::fromArray(['id' => $campaignId]);
            return $this->getCampaignUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in ADSCampaignService::getCampaign', [
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
            $query = ListADSCampaignsQuery::fromArray($filters);
            return $this->listCampaignsUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in ADSCampaignService::listCampaigns', [
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
            $filters['search'] = $term;
            $query = ListADSCampaignsQuery::fromArray($filters);
            return $this->listCampaignsUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in ADSCampaignService::searchCampaigns', [
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
            $filters['status'] = $status;
            $query = ListADSCampaignsQuery::fromArray($filters);
            return $this->listCampaignsUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in ADSCampaignService::getCampaignsByStatus', [
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
            $filters['platform'] = $platform;
            $query = ListADSCampaignsQuery::fromArray($filters);
            return $this->listCampaignsUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in ADSCampaignService::getCampaignsByPlatform', [
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
            $filters['account_id'] = $accountId;
            $query = ListADSCampaignsQuery::fromArray($filters);
            return $this->listCampaignsUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in ADSCampaignService::getCampaignsByAccount', [
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
            $filters['user_id'] = $userId;
            $query = ListADSCampaignsQuery::fromArray($filters);
            return $this->listCampaignsUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in ADSCampaignService::getCampaignsByUser', [
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
            $filters['status'] = 'active';
            $query = ListADSCampaignsQuery::fromArray($filters);
            return $this->listCampaignsUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in ADSCampaignService::getActiveCampaigns', [
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
            $filters['status'] = 'paused';
            $query = ListADSCampaignsQuery::fromArray($filters);
            return $this->listCampaignsUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in ADSCampaignService::getPausedCampaigns', [
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
            $cacheKey = 'ads_campaign_statistics_' . md5(serialize($filters));

            return Cache::remember($cacheKey, 300, function () use ($filters) {
                $allCampaigns = $this->listCampaigns($filters);

                $statistics = [
                    'total_campaigns' => count($allCampaigns['data'] ?? []),
                    'active_campaigns' => 0,
                    'paused_campaigns' => 0,
                    'completed_campaigns' => 0,
                    'campaigns_by_platform' => [],
                    'campaigns_by_status' => [],
                    'total_budget' => 0,
                    'average_budget' => 0,
                    'total_spent' => 0,
                    'average_spent' => 0,
                    'total_impressions' => 0,
                    'total_clicks' => 0,
                    'average_ctr' => 0,
                    'average_cpc' => 0,
                ];

                $budgets = [];
                $spent = [];

                foreach ($allCampaigns['data'] ?? [] as $campaign) {
                    $status = $campaign['status'] ?? 'unknown';
                    $platform = $campaign['platform'] ?? 'unknown';
                    $budget = $campaign['budget'] ?? 0;
                    $spentAmount = $campaign['spent'] ?? 0;
                    $impressions = $campaign['impressions'] ?? 0;
                    $clicks = $campaign['clicks'] ?? 0;

                    // Contar por status
                    if (!isset($statistics['campaigns_by_status'][$status])) {
                        $statistics['campaigns_by_status'][$status] = 0;
                    }
                    $statistics['campaigns_by_status'][$status]++;

                    // Contar por plataforma
                    if (!isset($statistics['campaigns_by_platform'][$platform])) {
                        $statistics['campaigns_by_platform'][$platform] = 0;
                    }
                    $statistics['campaigns_by_platform'][$platform]++;

                    // Somar orçamentos e gastos
                    $statistics['total_budget'] += $budget;
                    $statistics['total_spent'] += $spentAmount;
                    $budgets[] = $budget;
                    $spent[] = $spentAmount;

                    // Somar impressões e cliques
                    $statistics['total_impressions'] += $impressions;
                    $statistics['total_clicks'] += $clicks;

                    // Contar campanhas ativas
                    if ($status === 'active') {
                        $statistics['active_campaigns']++;
                    }

                    // Contar campanhas pausadas
                    if ($status === 'paused') {
                        $statistics['paused_campaigns']++;
                    }

                    // Contar campanhas completadas
                    if ($status === 'completed') {
                        $statistics['completed_campaigns']++;
                    }
                }

                if (!empty($budgets)) {
                    $statistics['average_budget'] = $statistics['total_budget'] / count($budgets);
                }

                if (!empty($spent)) {
                    $statistics['average_spent'] = $statistics['total_spent'] / count($spent);
                }

                if ($statistics['total_impressions'] > 0) {
                    $statistics['average_ctr'] = ($statistics['total_clicks'] / $statistics['total_impressions']) * 100;
                }

                if ($statistics['total_clicks'] > 0) {
                    $statistics['average_cpc'] = $statistics['total_spent'] / $statistics['total_clicks'];
                }

                return $statistics;
            });
        } catch (\Throwable $exception) {
            Log::error('Error in ADSCampaignService::getCampaignStatistics', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém contagem de campanhas por status
     */
    public function getCampaignsCountByStatus(): array
    {
        try {
            $cacheKey = 'ads_campaigns_count_by_status';

            return Cache::remember($cacheKey, 300, function () {
                $statistics = $this->getCampaignStatistics();
                return $statistics['campaigns_by_status'] ?? [];
            });
        } catch (\Throwable $exception) {
            Log::error('Error in ADSCampaignService::getCampaignsCountByStatus', [
                'error' => $exception->getMessage()
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém contagem de campanhas por plataforma
     */
    public function getCampaignsCountByPlatform(): array
    {
        try {
            $cacheKey = 'ads_campaigns_count_by_platform';

            return Cache::remember($cacheKey, 300, function () {
                $statistics = $this->getCampaignStatistics();
                return $statistics['campaigns_by_platform'] ?? [];
            });
        } catch (\Throwable $exception) {
            Log::error('Error in ADSCampaignService::getCampaignsCountByPlatform', [
                'error' => $exception->getMessage()
            ]);

            throw $exception;
        }
    }

    /**
     * Verifica se campanha existe
     */
    public function campaignExists(int $campaignId): bool
    {
        try {
            $campaign = $this->getCampaign($campaignId);
            return !empty($campaign);
        } catch (\Throwable $exception) {
            Log::error('Error in ADSCampaignService::campaignExists', [
                'error' => $exception->getMessage(),
                'campaignId' => $campaignId
            ]);

            return false;
        }
    }

    /**
     * Obtém campanhas com melhor performance
     */
    public function getTopPerformingCampaigns(int $limit = 10, array $filters = []): array
    {
        try {
            $filters['sort_by'] = 'ctr';
            $filters['sort_direction'] = 'desc';
            $filters['per_page'] = $limit;
            $query = ListADSCampaignsQuery::fromArray($filters);
            return $this->listCampaignsUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in ADSCampaignService::getTopPerformingCampaigns', [
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
            $filters['sort_by'] = 'ctr';
            $filters['sort_direction'] = 'asc';
            $filters['per_page'] = $limit;
            $query = ListADSCampaignsQuery::fromArray($filters);
            return $this->listCampaignsUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in ADSCampaignService::getWorstPerformingCampaigns', [
                'error' => $exception->getMessage(),
                'limit' => $limit,
                'filters' => $filters
            ]);

            throw $exception;
        }
    }
}
