<?php

namespace App\Domains\Dashboard\Application\Handlers;

use App\Domains\Dashboard\Application\Queries\GetDashboardMetricsQuery;
use App\Domains\Dashboard\Services\DashboardService;
use Illuminate\Support\Facades\Cache;

class GetDashboardMetricsHandler
{
    public function __construct(
        private DashboardService $dashboardService
    ) {
    }

    public function handle(GetDashboardMetricsQuery $query): array
    {
        $cacheKey = "dashboard.metrics.{$query->userId}.{$query->metricType}";

        if ($query->dateRange) {
            $cacheKey .= ".{$query->dateRange}";
        }

        return Cache::remember($cacheKey, 300, function () use ($query) {
            switch ($query->metricType) {
                case 'leads':
                    return $this->getLeadsMetrics($query);

                case 'projects':
                    return $this->getProjectsMetrics($query);

                case 'analytics':
                    return $this->getAnalyticsMetrics($query);

                case 'performance':
                    return $this->getPerformanceMetrics($query);

                default:
                    return [];
            }
        });
    }

    private function getLeadsMetrics(GetDashboardMetricsQuery $query): array
    {
        $metrics = [
            'total_leads' => $this->dashboardService->getTotalLeads($query->dateRange),
            'new_leads' => $this->dashboardService->getNewLeads($query->dateRange),
            'converted_leads' => $this->dashboardService->getConvertedLeads($query->dateRange),
            'conversion_rate' => $this->dashboardService->getConversionRate($query->dateRange),
            'leads_by_source' => $this->dashboardService->getLeadsBySource($query->dateRange),
            'leads_by_status' => $this->dashboardService->getLeadsByStatus($query->dateRange)
        ];

        if ($query->groupBy) {
            $metrics['grouped_data'] = $this->dashboardService->getLeadsGroupedBy(
                $query->groupBy,
                $query->dateRange
            );
        }

        return $metrics;
    }

    private function getProjectsMetrics(GetDashboardMetricsQuery $query): array
    {
        return [
            'total_projects' => $this->dashboardService->getTotalProjects($query->dateRange),
            'active_projects' => $this->dashboardService->getActiveProjects($query->dateRange),
            'completed_projects' => $this->dashboardService->getCompletedProjects($query->dateRange),
            'projects_by_status' => $this->dashboardService->getProjectsByStatus($query->dateRange),
            'project_performance' => $this->dashboardService->getProjectPerformance($query->dateRange)
        ];
    }

    private function getAnalyticsMetrics(GetDashboardMetricsQuery $query): array
    {
        return [
            'page_views' => $this->dashboardService->getPageViews($query->dateRange),
            'unique_visitors' => $this->dashboardService->getUniqueVisitors($query->dateRange),
            'bounce_rate' => $this->dashboardService->getBounceRate($query->dateRange),
            'session_duration' => $this->dashboardService->getSessionDuration($query->dateRange),
            'traffic_sources' => $this->dashboardService->getTrafficSources($query->dateRange),
            'device_breakdown' => $this->dashboardService->getDeviceBreakdown($query->dateRange)
        ];
    }

    private function getPerformanceMetrics(GetDashboardMetricsQuery $query): array
    {
        return [
            'revenue' => $this->dashboardService->getRevenue($query->dateRange),
            'revenue_growth' => $this->dashboardService->getRevenueGrowth($query->dateRange),
            'average_deal_size' => $this->dashboardService->getAverageDealSize($query->dateRange),
            'sales_cycle_length' => $this->dashboardService->getSalesCycleLength($query->dateRange),
            'top_performing_campaigns' => $this->dashboardService->getTopPerformingCampaigns($query->dateRange),
            'roi_by_campaign' => $this->dashboardService->getRoiByCampaign($query->dateRange)
        ];
    }
}
