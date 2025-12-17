<?php

namespace App\Domains\Dashboard\Application\Handlers;

use App\Domains\Dashboard\Application\Commands\RefreshDashboardDataCommand;
use App\Domains\Dashboard\Services\DashboardService;
use App\Domains\Dashboard\Repositories\DashboardWidgetRepository;
use App\Domains\Dashboard\Exceptions\DashboardDataRefreshException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class RefreshDashboardDataHandler
{
    public function __construct(
        private DashboardService $dashboardService,
        private DashboardWidgetRepository $dashboardWidgetRepository
    ) {
    }

    public function handle(RefreshDashboardDataCommand $command): array
    {
        try {
            $refreshedWidgets = [];
            $refreshedData = [];

            if ($command->widgetId) {
                // Atualizar dados de um widget específico
                $widget = $this->dashboardWidgetRepository->findById($command->widgetId);

                if (!$widget || $widget->user_id !== $command->userId) {
                    throw new DashboardDataRefreshException(
                        "Widget not found or does not belong to user"
                    );
                }

                $data = $this->refreshWidgetData($widget, $command->forceRefresh);
                $refreshedWidgets[] = $widget->id;
                $refreshedData[$widget->id] = $data;
            } elseif ($command->dataType) {
                // Atualizar dados de um tipo específico
                $widgets = $this->dashboardWidgetRepository->findByUserIdAndType(
                    $command->userId,
                    $command->dataType
                );

                foreach ($widgets as $widget) {
                    $data = $this->refreshWidgetData($widget, $command->forceRefresh);
                    $refreshedWidgets[] = $widget->id;
                    $refreshedData[$widget->id] = $data;
                }
            } else {
                // Atualizar todos os widgets do usuário
                $widgets = $this->dashboardWidgetRepository->findByUserId($command->userId);

                foreach ($widgets as $widget) {
                    $data = $this->refreshWidgetData($widget, $command->forceRefresh);
                    $refreshedWidgets[] = $widget->id;
                    $refreshedData[$widget->id] = $data;
                }
            }

            // Log da atualização
            Log::info("Dashboard data refreshed", [
                'user_id' => $command->userId,
                'widget_id' => $command->widgetId,
                'data_type' => $command->dataType,
                'refreshed_widgets' => count($refreshedWidgets),
                'force_refresh' => $command->forceRefresh
            ]);

            return [
                'success' => true,
                'refreshed_widgets' => $refreshedWidgets,
                'refreshed_data' => $refreshedData,
                'refreshed_at' => now()->toISOString()
            ];
        } catch (DashboardDataRefreshException $e) {
            Log::error("Dashboard data refresh failed", [
                'user_id' => $command->userId,
                'widget_id' => $command->widgetId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        } catch (\Exception $e) {
            Log::error("Unexpected error during dashboard data refresh", [
                'user_id' => $command->userId,
                'widget_id' => $command->widgetId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            throw new DashboardDataRefreshException(
                "Failed to refresh dashboard data: " . $e->getMessage()
            );
        }
    }

    private function refreshWidgetData($widget, bool $forceRefresh): array
    {
        $cacheKey = "dashboard.widget.{$widget->id}.data";

        if ($forceRefresh) {
            Cache::forget($cacheKey);
        }

        return Cache::remember($cacheKey, 300, function () use ($widget) {
            // Buscar dados específicos baseado no tipo do widget
            switch ($widget->type) {
                case 'metric_card':
                    return $this->dashboardService->getMetricData($widget->configuration);

                case 'chart':
                    return $this->dashboardService->getChartData($widget->configuration);

                case 'table':
                    return $this->dashboardService->getTableData($widget->configuration);

                case 'list':
                    return $this->dashboardService->getListData($widget->configuration);

                default:
                    return [];
            }
        });
    }
}
