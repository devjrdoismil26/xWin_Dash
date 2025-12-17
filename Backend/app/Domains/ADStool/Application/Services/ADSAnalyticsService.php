<?php

namespace App\Domains\ADStool\Application\Services;

use App\Domains\ADStool\Application\Services\ADSCampaignService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

/**
 * Serviço especializado para analytics de campanhas ADS
 */
class ADSAnalyticsService
{
    private ADSCampaignService $adsCampaignService;

    public function __construct(ADSCampaignService $adsCampaignService)
    {
        $this->adsCampaignService = $adsCampaignService;
    }

    /**
     * Obtém analytics gerais
     */
    public function getGeneralAnalytics(array $filters = []): array
    {
        try {
            $cacheKey = 'ads_general_analytics_' . md5(serialize($filters));

            return Cache::remember($cacheKey, 300, function () use ($filters) {
                $statistics = $this->adsCampaignService->getCampaignStatistics($filters);

                return [
                    'overview' => [
                        'total_campaigns' => $statistics['total_campaigns'] ?? 0,
                        'active_campaigns' => $statistics['active_campaigns'] ?? 0,
                        'paused_campaigns' => $statistics['paused_campaigns'] ?? 0,
                        'completed_campaigns' => $statistics['completed_campaigns'] ?? 0,
                    ],
                    'performance' => [
                        'total_impressions' => $statistics['total_impressions'] ?? 0,
                        'total_clicks' => $statistics['total_clicks'] ?? 0,
                        'average_ctr' => $statistics['average_ctr'] ?? 0,
                        'average_cpc' => $statistics['average_cpc'] ?? 0,
                    ],
                    'budget' => [
                        'total_budget' => $statistics['total_budget'] ?? 0,
                        'total_spent' => $statistics['total_spent'] ?? 0,
                        'average_budget' => $statistics['average_budget'] ?? 0,
                        'average_spent' => $statistics['average_spent'] ?? 0,
                        'budget_utilization' => $this->calculateBudgetUtilization($statistics),
                    ],
                    'platforms' => $statistics['campaigns_by_platform'] ?? [],
                    'status_distribution' => $statistics['campaigns_by_status'] ?? [],
                ];
            });
        } catch (\Throwable $exception) {
            Log::error('Error in ADSAnalyticsService::getGeneralAnalytics', [
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
            $cacheKey = 'ads_platform_analytics_' . md5(serialize($filters));

            return Cache::remember($cacheKey, 300, function () use ($filters) {
                $platforms = ['facebook', 'google', 'instagram', 'linkedin', 'twitter', 'tiktok'];
                $analytics = [];

                foreach ($platforms as $platform) {
                    $platformFilters = array_merge($filters, ['platform' => $platform]);
                    $platformStats = $this->adsCampaignService->getCampaignStatistics($platformFilters);

                    $analytics[$platform] = [
                        'campaigns' => $platformStats['total_campaigns'] ?? 0,
                        'active_campaigns' => $platformStats['active_campaigns'] ?? 0,
                        'total_budget' => $platformStats['total_budget'] ?? 0,
                        'total_spent' => $platformStats['total_spent'] ?? 0,
                        'total_impressions' => $platformStats['total_impressions'] ?? 0,
                        'total_clicks' => $platformStats['total_clicks'] ?? 0,
                        'average_ctr' => $platformStats['average_ctr'] ?? 0,
                        'average_cpc' => $platformStats['average_cpc'] ?? 0,
                        'budget_utilization' => $this->calculateBudgetUtilization($platformStats),
                    ];
                }

                return $analytics;
            });
        } catch (\Throwable $exception) {
            Log::error('Error in ADSAnalyticsService::getPlatformAnalytics', [
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
            $cacheKey = 'ads_period_analytics_' . $period . '_' . md5(serialize($filters));

            return Cache::remember($cacheKey, 300, function () use ($period, $filters) {
                $dateRange = $this->getDateRange($period);
                $periodFilters = array_merge($filters, [
                    'date_from' => $dateRange['from'],
                    'date_to' => $dateRange['to']
                ]);

                $statistics = $this->adsCampaignService->getCampaignStatistics($periodFilters);

                return [
                    'period' => $period,
                    'date_range' => $dateRange,
                    'campaigns' => [
                        'total' => $statistics['total_campaigns'] ?? 0,
                        'active' => $statistics['active_campaigns'] ?? 0,
                        'paused' => $statistics['paused_campaigns'] ?? 0,
                        'completed' => $statistics['completed_campaigns'] ?? 0,
                    ],
                    'performance' => [
                        'impressions' => $statistics['total_impressions'] ?? 0,
                        'clicks' => $statistics['total_clicks'] ?? 0,
                        'ctr' => $statistics['average_ctr'] ?? 0,
                        'cpc' => $statistics['average_cpc'] ?? 0,
                    ],
                    'budget' => [
                        'total_budget' => $statistics['total_budget'] ?? 0,
                        'total_spent' => $statistics['total_spent'] ?? 0,
                        'average_budget' => $statistics['average_budget'] ?? 0,
                        'average_spent' => $statistics['average_spent'] ?? 0,
                        'utilization' => $this->calculateBudgetUtilization($statistics),
                    ],
                ];
            });
        } catch (\Throwable $exception) {
            Log::error('Error in ADSAnalyticsService::getPeriodAnalytics', [
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
            $cacheKey = 'ads_performance_analytics_' . md5(serialize($filters));

            return Cache::remember($cacheKey, 300, function () use ($filters) {
                $statistics = $this->adsCampaignService->getCampaignStatistics($filters);

                return [
                    'metrics' => [
                        'total_impressions' => $statistics['total_impressions'] ?? 0,
                        'total_clicks' => $statistics['total_clicks'] ?? 0,
                        'average_ctr' => $statistics['average_ctr'] ?? 0,
                        'average_cpc' => $statistics['average_cpc'] ?? 0,
                        'total_spent' => $statistics['total_spent'] ?? 0,
                    ],
                    'top_performers' => $this->adsCampaignService->getTopPerformingCampaigns(5, $filters),
                    'worst_performers' => $this->adsCampaignService->getWorstPerformingCampaigns(5, $filters),
                    'benchmarks' => $this->getPerformanceBenchmarks($statistics),
                ];
            });
        } catch (\Throwable $exception) {
            Log::error('Error in ADSAnalyticsService::getPerformanceAnalytics', [
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
            $cacheKey = 'ads_budget_analytics_' . md5(serialize($filters));

            return Cache::remember($cacheKey, 300, function () use ($filters) {
                $statistics = $this->adsCampaignService->getCampaignStatistics($filters);

                return [
                    'overview' => [
                        'total_budget' => $statistics['total_budget'] ?? 0,
                        'total_spent' => $statistics['total_spent'] ?? 0,
                        'remaining_budget' => ($statistics['total_budget'] ?? 0) - ($statistics['total_spent'] ?? 0),
                        'utilization_rate' => $this->calculateBudgetUtilization($statistics),
                    ],
                    'averages' => [
                        'average_budget' => $statistics['average_budget'] ?? 0,
                        'average_spent' => $statistics['average_spent'] ?? 0,
                    ],
                    'platforms' => $this->getBudgetByPlatform($filters),
                    'trends' => $this->getBudgetTrends($filters),
                ];
            });
        } catch (\Throwable $exception) {
            Log::error('Error in ADSAnalyticsService::getBudgetAnalytics', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém dashboard completo
     */
    public function getDashboard(array $filters = []): array
    {
        try {
            return [
                'general' => $this->getGeneralAnalytics($filters),
                'platforms' => $this->getPlatformAnalytics($filters),
                'performance' => $this->getPerformanceAnalytics($filters),
                'budget' => $this->getBudgetAnalytics($filters),
                'recent_campaigns' => $this->adsCampaignService->getActiveCampaigns(array_merge($filters, ['per_page' => 5])),
                'top_performers' => $this->adsCampaignService->getTopPerformingCampaigns(5, $filters),
            ];
        } catch (\Throwable $exception) {
            Log::error('Error in ADSAnalyticsService::getDashboard', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Calcula utilização de orçamento
     */
    private function calculateBudgetUtilization(array $statistics): float
    {
        $totalBudget = $statistics['total_budget'] ?? 0;
        $totalSpent = $statistics['total_spent'] ?? 0;

        if ($totalBudget === 0) {
            return 0;
        }

        return ($totalSpent / $totalBudget) * 100;
    }

    /**
     * Obtém range de datas baseado no período
     */
    private function getDateRange(string $period): array
    {
        $now = now();

        return match ($period) {
            '7d' => [
                'from' => $now->subDays(7)->format('Y-m-d'),
                'to' => $now->format('Y-m-d')
            ],
            '30d' => [
                'from' => $now->subDays(30)->format('Y-m-d'),
                'to' => $now->format('Y-m-d')
            ],
            '90d' => [
                'from' => $now->subDays(90)->format('Y-m-d'),
                'to' => $now->format('Y-m-d')
            ],
            '1y' => [
                'from' => $now->subYear()->format('Y-m-d'),
                'to' => $now->format('Y-m-d')
            ],
            default => [
                'from' => $now->subDays(30)->format('Y-m-d'),
                'to' => $now->format('Y-m-d')
            ]
        };
    }

    /**
     * Obtém benchmarks de performance
     */
    private function getPerformanceBenchmarks(array $statistics): array
    {
        return [
            'ctr_benchmark' => [
                'excellent' => 3.0,
                'good' => 2.0,
                'average' => 1.0,
                'poor' => 0.5,
                'current' => $statistics['average_ctr'] ?? 0,
            ],
            'cpc_benchmark' => [
                'excellent' => 0.50,
                'good' => 1.00,
                'average' => 2.00,
                'poor' => 5.00,
                'current' => $statistics['average_cpc'] ?? 0,
            ],
        ];
    }

    /**
     * Obtém orçamento por plataforma
     */
    private function getBudgetByPlatform(array $filters): array
    {
        $platforms = ['facebook', 'google', 'instagram', 'linkedin', 'twitter', 'tiktok'];
        $budgetByPlatform = [];

        foreach ($platforms as $platform) {
            $platformFilters = array_merge($filters, ['platform' => $platform]);
            $platformStats = $this->adsCampaignService->getCampaignStatistics($platformFilters);

            $budgetByPlatform[$platform] = [
                'budget' => $platformStats['total_budget'] ?? 0,
                'spent' => $platformStats['total_spent'] ?? 0,
                'utilization' => $this->calculateBudgetUtilization($platformStats),
            ];
        }

        return $budgetByPlatform;
    }

    /**
     * Obtém tendências de orçamento
     */
    private function getBudgetTrends(array $filters): array
    {
        $periods = ['7d', '30d', '90d'];
        $trends = [];

        foreach ($periods as $period) {
            $periodAnalytics = $this->getPeriodAnalytics($period, $filters);
            $trends[$period] = [
                'budget' => $periodAnalytics['budget']['total_budget'] ?? 0,
                'spent' => $periodAnalytics['budget']['total_spent'] ?? 0,
                'utilization' => $periodAnalytics['budget']['utilization'] ?? 0,
            ];
        }

        return $trends;
    }
}
