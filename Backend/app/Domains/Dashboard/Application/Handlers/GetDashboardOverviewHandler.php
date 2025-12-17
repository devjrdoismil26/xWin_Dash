<?php

namespace App\Domains\Dashboard\Application\Handlers;

use App\Domains\Dashboard\Application\Queries\GetDashboardOverviewQuery;
use App\Domains\Dashboard\Services\DashboardService;
use Illuminate\Support\Facades\Cache;

class GetDashboardOverviewHandler
{
    public function __construct(
        private DashboardService $dashboardService
    ) {
    }

    public function handle(GetDashboardOverviewQuery $query): array
    {
        $cacheKey = "dashboard.overview.{$query->userId}";

        if ($query->dateRange) {
            $cacheKey .= ".{$query->dateRange}";
        }

        return Cache::remember($cacheKey, 300, function () use ($query) {
            $overview = [];

            // Métricas padrão se não especificadas
            $metrics = $query->metrics ?? [
                'total_leads', 'total_projects', 'active_campaigns',
                'conversion_rate', 'revenue', 'growth_rate'
            ];

            foreach ($metrics as $metric) {
                $overview[$metric] = $this->getMetricValue($metric, $query->dateRange);
            }

            // Adicionar dados de tendência
            $overview['trends'] = $this->getTrendData($query->dateRange);

            // Adicionar dados de performance
            $overview['performance'] = $this->getPerformanceData($query->dateRange);

            return [
                'overview' => $overview,
                'date_range' => $query->dateRange,
                'generated_at' => now()->toISOString()
            ];
        });
    }

    private function getMetricValue(string $metric, ?string $dateRange): mixed
    {
        switch ($metric) {
            case 'total_leads':
                return $this->dashboardService->getTotalLeads($dateRange);

            case 'total_projects':
                return $this->dashboardService->getTotalProjects($dateRange);

            case 'active_campaigns':
                return $this->dashboardService->getActiveCampaigns($dateRange);

            case 'conversion_rate':
                return $this->dashboardService->getConversionRate($dateRange);

            case 'revenue':
                return $this->dashboardService->getRevenue($dateRange);

            case 'growth_rate':
                return $this->dashboardService->getGrowthRate($dateRange);

            default:
                return 0;
        }
    }

    private function getTrendData(?string $dateRange): array
    {
        return [
            'leads_trend' => $this->dashboardService->getLeadsTrend($dateRange),
            'revenue_trend' => $this->dashboardService->getRevenueTrend($dateRange),
            'conversion_trend' => $this->dashboardService->getConversionTrend($dateRange)
        ];
    }

    private function getPerformanceData(?string $dateRange): array
    {
        return [
            'top_performing_campaigns' => $this->dashboardService->getTopPerformingCampaigns($dateRange),
            'top_sources' => $this->dashboardService->getTopSources($dateRange),
            'geographic_distribution' => $this->dashboardService->getGeographicDistribution($dateRange)
        ];
    }
}
