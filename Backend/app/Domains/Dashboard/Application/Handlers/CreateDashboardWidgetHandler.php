<?php

namespace App\Domains\Dashboard\Application\Handlers;

use App\Domains\Dashboard\Application\Commands\CreateDashboardWidgetCommand;
use App\Domains\Dashboard\Services\DashboardService;
use App\Domains\Dashboard\Repositories\DashboardWidgetRepository;
use App\Domains\Dashboard\Exceptions\DashboardWidgetCreationException;
use Illuminate\Support\Facades\Log;

class CreateDashboardWidgetHandler
{
    public function __construct(
        private DashboardService $dashboardService,
        private DashboardWidgetRepository $dashboardWidgetRepository
    ) {
    }

    public function handle(CreateDashboardWidgetCommand $command): array
    {
        try {
            // Validar tipo de widget
            $this->validateWidgetType($command->type);

            // Validar configuração
            $this->validateWidgetConfiguration($command->type, $command->configuration);

            // Determinar posição se não fornecida
            $position = $command->position ?? $this->getNextPosition($command->userId);

            // Criar o widget
            $widget = $this->dashboardWidgetRepository->create([
                'user_id' => $command->userId,
                'name' => $command->name,
                'type' => $command->type,
                'configuration' => $command->configuration,
                'description' => $command->description,
                'position' => $position,
                'size' => $command->size ?? 'medium',
                'is_visible' => true
            ]);

            // Log da criação
            Log::info("Dashboard widget created", [
                'widget_id' => $widget->id,
                'name' => $widget->name,
                'type' => $widget->type,
                'user_id' => $command->userId
            ]);

            return [
                'success' => true,
                'widget_id' => $widget->id,
                'name' => $widget->name,
                'type' => $widget->type,
                'position' => $widget->position,
                'size' => $widget->size,
                'created_at' => $widget->created_at->toISOString()
            ];
        } catch (DashboardWidgetCreationException $e) {
            Log::error("Dashboard widget creation failed", [
                'name' => $command->name,
                'type' => $command->type,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        } catch (\Exception $e) {
            Log::error("Unexpected error during dashboard widget creation", [
                'name' => $command->name,
                'type' => $command->type,
                'user_id' => $command->userId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            throw new DashboardWidgetCreationException(
                "Failed to create dashboard widget: " . $e->getMessage()
            );
        }
    }

    private function validateWidgetType(string $type): void
    {
        $allowedTypes = [
            'metric_card', 'chart', 'table', 'list', 'gauge',
            'progress_bar', 'pie_chart', 'line_chart', 'bar_chart'
        ];

        if (!in_array($type, $allowedTypes)) {
            throw new DashboardWidgetCreationException(
                "Invalid widget type. Allowed types: " . implode(', ', $allowedTypes)
            );
        }
    }

    private function validateWidgetConfiguration(string $type, array $configuration): void
    {
        switch ($type) {
            case 'metric_card':
                if (!isset($configuration['metric']) || !isset($configuration['title'])) {
                    throw new DashboardWidgetCreationException(
                        "Metric card widget requires 'metric' and 'title' in configuration"
                    );
                }
                break;

            case 'chart':
                if (!isset($configuration['data_source']) || !isset($configuration['chart_type'])) {
                    throw new DashboardWidgetCreationException(
                        "Chart widget requires 'data_source' and 'chart_type' in configuration"
                    );
                }
                break;

            case 'table':
                if (!isset($configuration['columns']) || !isset($configuration['data_source'])) {
                    throw new DashboardWidgetCreationException(
                        "Table widget requires 'columns' and 'data_source' in configuration"
                    );
                }
                break;
        }
    }

    private function getNextPosition(int $userId): int
    {
        $maxPosition = $this->dashboardWidgetRepository->getMaxPosition($userId);
        return $maxPosition + 1;
    }
}
