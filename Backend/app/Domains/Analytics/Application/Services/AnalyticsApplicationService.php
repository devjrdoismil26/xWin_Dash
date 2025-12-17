<?php

namespace App\Domains\Analytics\Application\Services;

use App\Domains\Analytics\Application\Commands\CreateMetricCommand;
use App\Domains\Analytics\Application\Commands\UpdateMetricCommand;
use App\Domains\Analytics\Application\Commands\DeleteMetricCommand;
use App\Domains\Analytics\Application\Commands\CreateDashboardCommand;
use App\Domains\Analytics\Application\Commands\GenerateReportCommand;
use App\Domains\Analytics\Application\Queries\GetMetricQuery;
use App\Domains\Analytics\Application\Queries\ListMetricsQuery;
use App\Domains\Analytics\Application\Queries\GetDashboardQuery;
use App\Domains\Analytics\Application\Queries\GetAnalyticsDataQuery;
use App\Domains\Analytics\Application\UseCases\CreateMetricUseCase;
use App\Domains\Analytics\Application\UseCases\UpdateMetricUseCase;
use App\Domains\Analytics\Application\UseCases\DeleteMetricUseCase;
use App\Domains\Analytics\Application\UseCases\CreateDashboardUseCase;
use App\Domains\Analytics\Application\UseCases\GenerateReportUseCase;
use App\Domains\Analytics\Application\UseCases\GetMetricUseCase;
use App\Domains\Analytics\Application\UseCases\ListMetricsUseCase;
use App\Domains\Analytics\Application\UseCases\GetDashboardUseCase;
use App\Domains\Analytics\Application\UseCases\GetAnalyticsDataUseCase;
use Illuminate\Support\Facades\Log;

class AnalyticsApplicationService
{
    public function __construct(
        private CreateMetricUseCase $createMetricUseCase,
        private UpdateMetricUseCase $updateMetricUseCase,
        private DeleteMetricUseCase $deleteMetricUseCase,
        private CreateDashboardUseCase $createDashboardUseCase,
        private GenerateReportUseCase $generateReportUseCase,
        private GetMetricUseCase $getMetricUseCase,
        private ListMetricsUseCase $listMetricsUseCase,
        private GetDashboardUseCase $getDashboardUseCase,
        private GetAnalyticsDataUseCase $getAnalyticsDataUseCase
    ) {
    }

    public function createMetric(array $data): array
    {
        $command = new CreateMetricCommand(
            name: $data['name'],
            type: $data['type'],
            description: $data['description'] ?? null,
            configuration: $data['configuration'] ?? null,
            category: $data['category'] ?? null,
            tags: $data['tags'] ?? null,
            isActive: $data['is_active'] ?? true
        );

        return $this->createMetricUseCase->execute($command);
    }

    public function updateMetric(int $metricId, array $data): array
    {
        $command = new UpdateMetricCommand(
            metricId: $metricId,
            name: $data['name'] ?? null,
            type: $data['type'] ?? null,
            description: $data['description'] ?? null,
            configuration: $data['configuration'] ?? null,
            category: $data['category'] ?? null,
            tags: $data['tags'] ?? null,
            isActive: $data['is_active'] ?? null
        );

        return $this->updateMetricUseCase->execute($command);
    }

    public function deleteMetric(int $metricId, bool $forceDelete = false): array
    {
        $command = new DeleteMetricCommand(
            metricId: $metricId,
            forceDelete: $forceDelete
        );

        return $this->deleteMetricUseCase->execute($command);
    }

    public function createDashboard(array $data): array
    {
        $command = new CreateDashboardCommand(
            name: $data['name'],
            description: $data['description'] ?? null,
            layout: $data['layout'] ?? null,
            widgets: $data['widgets'] ?? null,
            isPublic: $data['is_public'] ?? false,
            tags: $data['tags'] ?? null
        );

        return $this->createDashboardUseCase->execute($command);
    }

    public function generateReport(array $data): array
    {
        $command = new GenerateReportCommand(
            reportType: $data['report_type'],
            metrics: $data['metrics'] ?? null,
            dateFrom: $data['date_from'] ?? null,
            dateTo: $data['date_to'] ?? null,
            filters: $data['filters'] ?? null,
            format: $data['format'] ?? 'json',
            parameters: $data['parameters'] ?? null
        );

        return $this->generateReportUseCase->execute($command);
    }

    public function getMetric(int $metricId, bool $includeData = false, ?string $dateFrom = null, ?string $dateTo = null): array
    {
        $query = new GetMetricQuery(
            metricId: $metricId,
            includeData: $includeData,
            dateFrom: $dateFrom,
            dateTo: $dateTo
        );

        return $this->getMetricUseCase->execute($query);
    }

    public function listMetrics(array $filters = [], int $page = 1, int $perPage = 15, string $sortBy = 'created_at', string $sortDirection = 'desc'): array
    {
        $query = new ListMetricsQuery(
            search: $filters['search'] ?? null,
            type: $filters['type'] ?? null,
            category: $filters['category'] ?? null,
            isActive: $filters['is_active'] ?? null,
            tags: $filters['tags'] ?? null,
            page: $page,
            perPage: $perPage,
            sortBy: $sortBy,
            sortDirection: $sortDirection
        );

        return $this->listMetricsUseCase->execute($query);
    }

    public function getDashboard(int $dashboardId, bool $includeData = false, ?string $dateFrom = null, ?string $dateTo = null): array
    {
        $query = new GetDashboardQuery(
            dashboardId: $dashboardId,
            includeData: $includeData,
            dateFrom: $dateFrom,
            dateTo: $dateTo
        );

        return $this->getDashboardUseCase->execute($query);
    }

    public function getAnalyticsData(array $metrics, ?string $dateFrom = null, ?string $dateTo = null, ?array $filters = null, ?string $groupBy = null, string $aggregation = 'sum'): array
    {
        $query = new GetAnalyticsDataQuery(
            metrics: $metrics,
            dateFrom: $dateFrom,
            dateTo: $dateTo,
            filters: $filters,
            groupBy: $groupBy,
            aggregation: $aggregation
        );

        return $this->getAnalyticsDataUseCase->execute($query);
    }
}
