<?php

namespace App\Domains\EmailMarketing\Application\Services;

use App\Domains\EmailMarketing\Application\Services\EmailCampaignService;
use App\Domains\EmailMarketing\Application\Services\EmailListService;
use App\Domains\EmailMarketing\Application\Services\EmailAnalyticsService;
use Illuminate\Support\Facades\Log;

/**
 * Application Service para EmailMarketing
 *
 * Orquestra serviços especializados e fornece interface unificada
 * para operações de campanhas, listas e analytics de email.
 */
class EmailMarketingApplicationService
{
    private EmailCampaignService $emailCampaignService;
    private EmailListService $emailListService;
    private EmailAnalyticsService $emailAnalyticsService;

    public function __construct(
        EmailCampaignService $emailCampaignService,
        EmailListService $emailListService,
        EmailAnalyticsService $emailAnalyticsService
    ) {
        $this->emailCampaignService = $emailCampaignService;
        $this->emailListService = $emailListService;
        $this->emailAnalyticsService = $emailAnalyticsService;
    }

    // ===== CAMPANHAS DE EMAIL =====

    /**
     * Cria uma nova campanha de email
     */
    public function createCampaign(array $data): array
    {
        try {
            return $this->emailCampaignService->createCampaign($data);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailMarketingApplicationService::createCampaign', [
                'error' => $exception->getMessage(),
                'data' => $data
            ]);

            throw $exception;
        }
    }

    /**
     * Atualiza uma campanha de email
     */
    public function updateCampaign(int $campaignId, array $data): array
    {
        try {
            return $this->emailCampaignService->updateCampaign($campaignId, $data);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailMarketingApplicationService::updateCampaign', [
                'error' => $exception->getMessage(),
                'campaignId' => $campaignId,
                'data' => $data
            ]);

            throw $exception;
        }
    }

    /**
     * Remove uma campanha de email
     */
    public function deleteCampaign(int $campaignId): array
    {
        try {
            return $this->emailCampaignService->deleteCampaign($campaignId);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailMarketingApplicationService::deleteCampaign', [
                'error' => $exception->getMessage(),
                'campaignId' => $campaignId
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém uma campanha de email
     */
    public function getCampaign(int $campaignId): array
    {
        try {
            return $this->emailCampaignService->getCampaign($campaignId);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailMarketingApplicationService::getCampaign', [
                'error' => $exception->getMessage(),
                'campaignId' => $campaignId
            ]);

            throw $exception;
        }
    }

    /**
     * Lista campanhas de email
     */
    public function listCampaigns(array $filters = []): array
    {
        try {
            return $this->emailCampaignService->listCampaigns($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailMarketingApplicationService::listCampaigns', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Envia uma campanha de email
     */
    public function sendCampaign(int $campaignId, array $options = []): array
    {
        try {
            return $this->emailCampaignService->sendCampaign($campaignId, $options);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailMarketingApplicationService::sendCampaign', [
                'error' => $exception->getMessage(),
                'campaignId' => $campaignId,
                'options' => $options
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém estatísticas de uma campanha
     */
    public function getCampaignStats(int $campaignId): array
    {
        try {
            return $this->emailCampaignService->getCampaignStats($campaignId);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailMarketingApplicationService::getCampaignStats', [
                'error' => $exception->getMessage(),
                'campaignId' => $campaignId
            ]);

            throw $exception;
        }
    }

    // ===== LISTAS DE EMAIL =====

    /**
     * Cria uma nova lista de email
     */
    public function createList(array $data): array
    {
        try {
            return $this->emailListService->createList($data);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailMarketingApplicationService::createList', [
                'error' => $exception->getMessage(),
                'data' => $data
            ]);

            throw $exception;
        }
    }

    /**
     * Atualiza uma lista de email
     */
    public function updateList(int $listId, array $data): array
    {
        try {
            return $this->emailListService->updateList($listId, $data);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailMarketingApplicationService::updateList', [
                'error' => $exception->getMessage(),
                'listId' => $listId,
                'data' => $data
            ]);

            throw $exception;
        }
    }

    /**
     * Remove uma lista de email
     */
    public function deleteList(int $listId): array
    {
        try {
            return $this->emailListService->deleteList($listId);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailMarketingApplicationService::deleteList', [
                'error' => $exception->getMessage(),
                'listId' => $listId
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém uma lista de email
     */
    public function getList(int $listId): array
    {
        try {
            return $this->emailListService->getList($listId);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailMarketingApplicationService::getList', [
                'error' => $exception->getMessage(),
                'listId' => $listId
            ]);

            throw $exception;
        }
    }

    /**
     * Lista listas de email
     */
    public function listLists(array $filters = []): array
    {
        try {
            return $this->emailListService->listLists($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailMarketingApplicationService::listLists', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Adiciona um subscriber a uma lista
     */
    public function addSubscriber(int $listId, array $subscriberData): array
    {
        try {
            return $this->emailListService->addSubscriber($listId, $subscriberData);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailMarketingApplicationService::addSubscriber', [
                'error' => $exception->getMessage(),
                'listId' => $listId,
                'subscriberData' => $subscriberData
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém estatísticas de uma lista
     */
    public function getListStats(int $listId): array
    {
        try {
            return $this->emailListService->getListStats($listId);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailMarketingApplicationService::getListStats', [
                'error' => $exception->getMessage(),
                'listId' => $listId
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém contagem de listas por usuário
     */
    public function getListsCountByUser(int $userId): int
    {
        try {
            return $this->emailListService->getListsCountByUser($userId);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailMarketingApplicationService::getListsCountByUser', [
                'error' => $exception->getMessage(),
                'userId' => $userId
            ]);

            return 0;
        }
    }

    /**
     * Verifica se usuário pode criar mais listas
     */
    public function canUserCreateMoreLists(int $userId, int $maxLists = 50): bool
    {
        try {
            return $this->emailListService->canUserCreateMoreLists($userId, $maxLists);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailMarketingApplicationService::canUserCreateMoreLists', [
                'error' => $exception->getMessage(),
                'userId' => $userId,
                'maxLists' => $maxLists
            ]);

            return false;
        }
    }

    // ===== ANALYTICS =====

    /**
     * Obtém overview de analytics
     */
    public function getAnalyticsOverview(array $filters = []): array
    {
        try {
            return $this->emailAnalyticsService->getOverview($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailMarketingApplicationService::getAnalyticsOverview', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém performance de campanhas
     */
    public function getCampaignPerformance(array $filters = []): array
    {
        try {
            return $this->emailAnalyticsService->getCampaignPerformance($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailMarketingApplicationService::getCampaignPerformance', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém analytics de subscribers
     */
    public function getSubscriberAnalytics(array $filters = []): array
    {
        try {
            return $this->emailAnalyticsService->getSubscriberAnalytics($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailMarketingApplicationService::getSubscriberAnalytics', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém analytics de engajamento
     */
    public function getEngagementAnalytics(array $filters = []): array
    {
        try {
            return $this->emailAnalyticsService->getEngagementAnalytics($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailMarketingApplicationService::getEngagementAnalytics', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    // ===== MÉTODOS DE CONVENIÊNCIA =====

    /**
     * Obtém dashboard completo de email marketing
     */
    public function getDashboard(array $filters = []): array
    {
        try {
            return [
                'overview' => $this->getAnalyticsOverview($filters),
                'campaign_performance' => $this->getCampaignPerformance($filters),
                'subscriber_analytics' => $this->getSubscriberAnalytics($filters),
                'engagement_analytics' => $this->getEngagementAnalytics($filters),
            ];
        } catch (\Throwable $exception) {
            Log::error('Error in EmailMarketingApplicationService::getDashboard', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém estatísticas resumidas
     */
    public function getSummaryStats(array $filters = []): array
    {
        try {
            $overview = $this->getAnalyticsOverview($filters);

            return [
                'total_campaigns' => $overview['total_campaigns'] ?? 0,
                'total_subscribers' => $overview['total_subscribers'] ?? 0,
                'open_rate' => $overview['open_rate'] ?? 0,
                'click_rate' => $overview['click_rate'] ?? 0,
                'bounce_rate' => $overview['bounce_rate'] ?? 0,
                'unsubscribe_rate' => $overview['unsubscribe_rate'] ?? 0,
            ];
        } catch (\Throwable $exception) {
            Log::error('Error in EmailMarketingApplicationService::getSummaryStats', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }
}
