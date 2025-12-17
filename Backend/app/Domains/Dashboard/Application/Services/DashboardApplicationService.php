<?php

namespace App\Domains\Dashboard\Application\Services;

use App\Domains\Dashboard\Application\Commands\CreateDashboardWidgetCommand;
use App\Domains\Dashboard\Application\Commands\UpdateDashboardWidgetCommand;
use App\Domains\Dashboard\Application\Commands\DeleteDashboardWidgetCommand;
use App\Domains\Dashboard\Application\Commands\RefreshDashboardDataCommand;
use App\Domains\Dashboard\Application\Commands\ExportDashboardDataCommand;
use App\Domains\Dashboard\Application\Queries\GetDashboardOverviewQuery;
use App\Domains\Dashboard\Application\Queries\GetDashboardWidgetQuery;
use App\Domains\Dashboard\Application\Queries\ListDashboardWidgetsQuery;
use App\Domains\Dashboard\Application\Queries\GetDashboardMetricsQuery;
use App\Domains\Dashboard\Application\UseCases\CreateDashboardWidgetUseCase;
use App\Domains\Dashboard\Application\UseCases\RefreshDashboardDataUseCase;
use App\Domains\Dashboard\Application\UseCases\ExportDashboardDataUseCase;
use App\Domains\Dashboard\Application\UseCases\GetDashboardOverviewUseCase;
use App\Domains\Dashboard\Application\Handlers\GetDashboardMetricsHandler;

class DashboardApplicationService
{
    public function __construct(
        private CreateDashboardWidgetUseCase $createDashboardWidgetUseCase,
        private RefreshDashboardDataUseCase $refreshDashboardDataUseCase,
        private ExportDashboardDataUseCase $exportDashboardDataUseCase,
        private GetDashboardOverviewUseCase $getDashboardOverviewUseCase,
        private GetDashboardMetricsHandler $getDashboardMetricsHandler
    ) {
    }

    public function createWidget(CreateDashboardWidgetCommand $command): array
    {
        return $this->createDashboardWidgetUseCase->execute($command);
    }

    public function refreshData(RefreshDashboardDataCommand $command): array
    {
        return $this->refreshDashboardDataUseCase->execute($command);
    }

    public function exportData(ExportDashboardDataCommand $command): array
    {
        return $this->exportDashboardDataUseCase->execute($command);
    }

    public function getOverview(GetDashboardOverviewQuery $query): array
    {
        return $this->getDashboardOverviewUseCase->execute($query);
    }

    // Métodos de conveniência para operações comuns
    public function createMetricCard(int $userId, string $name, string $metric, string $title, ?string $description = null): array
    {
        $command = new CreateDashboardWidgetCommand(
            userId: $userId,
            name: $name,
            type: 'metric_card',
            configuration: [
                'metric' => $metric,
                'title' => $title,
                'format' => 'number'
            ],
            description: $description
        );

        return $this->createWidget($command);
    }

    public function createChartWidget(int $userId, string $name, string $dataSource, string $chartType, array $options = []): array
    {
        $command = new CreateDashboardWidgetCommand(
            userId: $userId,
            name: $name,
            type: 'chart',
            configuration: array_merge([
                'data_source' => $dataSource,
                'chart_type' => $chartType
            ], $options)
        );

        return $this->createWidget($command);
    }

    public function createTableWidget(int $userId, string $name, array $columns, string $dataSource): array
    {
        $command = new CreateDashboardWidgetCommand(
            userId: $userId,
            name: $name,
            type: 'table',
            configuration: [
                'columns' => $columns,
                'data_source' => $dataSource,
                'pagination' => true,
                'sortable' => true
            ]
        );

        return $this->createWidget($command);
    }

    public function refreshAllWidgets(int $userId, bool $forceRefresh = false): array
    {
        $command = new RefreshDashboardDataCommand(
            userId: $userId,
            forceRefresh: $forceRefresh
        );

        return $this->refreshData($command);
    }

    public function refreshWidget(int $userId, int $widgetId, bool $forceRefresh = false): array
    {
        $command = new RefreshDashboardDataCommand(
            userId: $userId,
            widgetId: $widgetId,
            forceRefresh: $forceRefresh
        );

        return $this->refreshData($command);
    }

    public function exportToCsv(int $userId, ?array $widgetIds = null, ?string $dateRange = null): array
    {
        $command = new ExportDashboardDataCommand(
            userId: $userId,
            format: 'csv',
            widgetIds: $widgetIds,
            dateRange: $dateRange
        );

        return $this->exportData($command);
    }

    public function exportToExcel(int $userId, ?array $widgetIds = null, ?string $dateRange = null): array
    {
        $command = new ExportDashboardDataCommand(
            userId: $userId,
            format: 'excel',
            widgetIds: $widgetIds,
            dateRange: $dateRange
        );

        return $this->exportData($command);
    }

    public function exportToPdf(int $userId, ?array $widgetIds = null, ?string $dateRange = null): array
    {
        $command = new ExportDashboardDataCommand(
            userId: $userId,
            format: 'pdf',
            widgetIds: $widgetIds,
            dateRange: $dateRange
        );

        return $this->exportData($command);
    }

    public function getOverviewMetrics(int $userId, ?string $dateRange = null): array
    {
        $query = new GetDashboardOverviewQuery(
            userId: $userId,
            dateRange: $dateRange
        );

        return $this->getOverview($query);
    }

    public function getLeadsMetrics(int $userId, ?string $dateRange = null): array
    {
        $query = new GetDashboardMetricsQuery(
            userId: $userId,
            metricType: 'leads',
            dateRange: $dateRange
        );

        return $this->getDashboardMetricsHandler->handle($query);
    }

    public function getProjectsMetrics(int $userId, ?string $dateRange = null): array
    {
        $query = new GetDashboardMetricsQuery(
            userId: $userId,
            metricType: 'projects',
            dateRange: $dateRange
        );

        return $this->getDashboardMetricsHandler->handle($query);
    }

    public function getAnalyticsMetrics(int $userId, ?string $dateRange = null): array
    {
        $query = new GetDashboardMetricsQuery(
            userId: $userId,
            metricType: 'analytics',
            dateRange: $dateRange
        );

        return $this->getDashboardMetricsHandler->handle($query);
    }

    public function getPerformanceMetrics(int $userId, ?string $dateRange = null): array
    {
        $query = new GetDashboardMetricsQuery(
            userId: $userId,
            metricType: 'performance',
            dateRange: $dateRange
        );

        return $this->getDashboardMetricsHandler->handle($query);
    }
}
