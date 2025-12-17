<?php

namespace App\Domains\ADStool\Application\Handlers;

use App\Domains\ADStool\Application\Queries\ListADSCampaignsQuery;
use App\Domains\ADStool\Domain\Repositories\ADSCampaignRepositoryInterface;
use App\Domains\ADStool\Domain\Services\ADSCampaignServiceInterface;
use App\Domains\ADStool\Domain\ValueObjects\ADSCampaignId;
use App\Domains\ADStool\Domain\ValueObjects\CampaignStatus;
use App\Domains\ADStool\Domain\ValueObjects\Budget;
use Illuminate\Support\Facades\Log;
use Illuminate\Pagination\LengthAwarePaginator;

class ListADSCampaignsHandler
{
    public function __construct(
        private ADSCampaignRepositoryInterface $campaignRepository,
        private ADSCampaignServiceInterface $campaignService
    ) {
    }

    public function handle(ListADSCampaignsQuery $query): LengthAwarePaginator
    {
        try {
            // Preparar filtros
            $filters = $this->prepareFilters($query);

            // Preparar opções de paginação e ordenação
            $paginationOptions = $this->preparePaginationOptions($query);

            // Buscar campanhas
            $campaigns = $this->campaignRepository->findByFilters(
                $filters,
                $paginationOptions
            );

            // Aplicar transformações se necessário
            if ($query->includeAnalytics) {
                $campaigns = $this->enrichWithAnalytics($campaigns);
            }

            if ($query->includeCreatives) {
                $campaigns = $this->enrichWithCreatives($campaigns);
            }

            if ($query->includeAccount) {
                $campaigns = $this->enrichWithAccount($campaigns);
            }

            Log::info('ADS Campaigns listed successfully', [
                'user_id' => $query->userId,
                'filters' => $filters,
                'total_results' => $campaigns->total()
            ]);

            return $campaigns;
        } catch (\Exception $e) {
            Log::error('Failed to list ADS campaigns', [
                'user_id' => $query->userId,
                'filters' => $filters ?? [],
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function prepareFilters(ListADSCampaignsQuery $query): array
    {
        $filters = [
            'user_id' => $query->userId
        ];

        if ($query->status !== null) {
            $filters['status'] = new CampaignStatus($query->status);
        }

        if ($query->accountId !== null) {
            $filters['account_id'] = $query->accountId;
        }

        if ($query->minBudget !== null) {
            $filters['min_budget'] = new Budget($query->minBudget);
        }

        if ($query->maxBudget !== null) {
            $filters['max_budget'] = new Budget($query->maxBudget);
        }

        if ($query->dateFrom !== null) {
            $filters['date_from'] = $query->dateFrom;
        }

        if ($query->dateTo !== null) {
            $filters['date_to'] = $query->dateTo;
        }

        if ($query->search !== null) {
            $filters['search'] = $query->search;
        }

        if ($query->tags !== null && !empty($query->tags)) {
            $filters['tags'] = $query->tags;
        }

        return $filters;
    }

    private function preparePaginationOptions(ListADSCampaignsQuery $query): array
    {
        return [
            'page' => $query->page,
            'per_page' => $query->perPage,
            'sort_by' => $query->sortBy,
            'sort_direction' => $query->sortDirection
        ];
    }

    private function enrichWithAnalytics(LengthAwarePaginator $campaigns): LengthAwarePaginator
    {
        foreach ($campaigns->items() as $campaign) {
            try {
                $analytics = $this->campaignService->getCampaignAnalytics($campaign->getId());
                $campaign->setAnalytics($analytics);
            } catch (\Exception $e) {
                Log::warning('Failed to load analytics for campaign', [
                    'campaign_id' => $campaign->getId(),
                    'error' => $e->getMessage()
                ]);
            }
        }

        return $campaigns;
    }

    private function enrichWithCreatives(LengthAwarePaginator $campaigns): LengthAwarePaginator
    {
        foreach ($campaigns->items() as $campaign) {
            try {
                $creatives = $this->campaignService->getCampaignCreatives($campaign->getId());
                $campaign->setCreatives($creatives);
            } catch (\Exception $e) {
                Log::warning('Failed to load creatives for campaign', [
                    'campaign_id' => $campaign->getId(),
                    'error' => $e->getMessage()
                ]);
            }
        }

        return $campaigns;
    }

    private function enrichWithAccount(LengthAwarePaginator $campaigns): LengthAwarePaginator
    {
        foreach ($campaigns->items() as $campaign) {
            try {
                $account = $this->campaignService->getCampaignAccount($campaign->getId());
                $campaign->setAccount($account);
            } catch (\Exception $e) {
                Log::warning('Failed to load account for campaign', [
                    'campaign_id' => $campaign->getId(),
                    'error' => $e->getMessage()
                ]);
            }
        }

        return $campaigns;
    }
}
