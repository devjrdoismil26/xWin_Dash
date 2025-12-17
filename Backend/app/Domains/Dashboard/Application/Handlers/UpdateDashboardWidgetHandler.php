<?php

namespace App\Domains\Dashboard\Application\Handlers;

use App\Domains\Dashboard\Application\Commands\UpdateDashboardWidgetCommand;
use App\Domains\Dashboard\Services\DashboardService;
use App\Domains\Dashboard\Repositories\DashboardWidgetRepository;
use App\Domains\Dashboard\Exceptions\DashboardWidgetNotFoundException;
use App\Domains\Dashboard\Exceptions\DashboardWidgetUpdateException;
use Illuminate\Support\Facades\Log;

class UpdateDashboardWidgetHandler
{
    public function __construct(
        private DashboardService $dashboardService,
        private DashboardWidgetRepository $dashboardWidgetRepository
    ) {
    }

    public function handle(UpdateDashboardWidgetCommand $command): array
    {
        try {
            // Buscar o widget existente
            $widget = $this->dashboardWidgetRepository->findById($command->widgetId);

            if (!$widget) {
                throw new DashboardWidgetNotFoundException(
                    "Dashboard widget with ID {$command->widgetId} not found"
                );
            }

            // Verificar se o widget pertence ao usuário
            if ($widget->user_id !== $command->userId) {
                throw new DashboardWidgetUpdateException(
                    "Widget does not belong to user"
                );
            }

            // Validar configuração se estiver sendo alterada
            if ($command->configuration) {
                $this->validateWidgetConfiguration($widget->type, $command->configuration);
            }

            // Preparar dados para atualização
            $updateData = $command->toArray();
            unset($updateData['user_id']); // Remover user_id dos dados de atualização

            // Atualizar o widget
            $this->dashboardWidgetRepository->update($command->widgetId, $updateData);

            // Buscar o widget atualizado
            $updatedWidget = $this->dashboardWidgetRepository->findById($command->widgetId);

            // Log da atualização
            Log::info("Dashboard widget updated", [
                'widget_id' => $command->widgetId,
                'user_id' => $command->userId,
                'updated_fields' => array_keys($updateData)
            ]);

            return [
                'success' => true,
                'widget_id' => $updatedWidget->id,
                'name' => $updatedWidget->name,
                'type' => $updatedWidget->type,
                'position' => $updatedWidget->position,
                'size' => $updatedWidget->size,
                'is_visible' => $updatedWidget->is_visible,
                'updated_at' => $updatedWidget->updated_at->toISOString()
            ];
        } catch (DashboardWidgetNotFoundException $e) {
            Log::error("Dashboard widget not found for update", [
                'widget_id' => $command->widgetId,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        } catch (DashboardWidgetUpdateException $e) {
            Log::error("Dashboard widget update failed", [
                'widget_id' => $command->widgetId,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        } catch (\Exception $e) {
            Log::error("Unexpected error during dashboard widget update", [
                'widget_id' => $command->widgetId,
                'user_id' => $command->userId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            throw new DashboardWidgetUpdateException(
                "Failed to update dashboard widget: " . $e->getMessage()
            );
        }
    }

    private function validateWidgetConfiguration(string $type, array $configuration): void
    {
        switch ($type) {
            case 'metric_card':
                if (isset($configuration['metric']) && empty($configuration['metric'])) {
                    throw new DashboardWidgetUpdateException("Metric cannot be empty");
                }
                break;

            case 'chart':
                if (isset($configuration['data_source']) && empty($configuration['data_source'])) {
                    throw new DashboardWidgetUpdateException("Data source cannot be empty");
                }
                break;
        }
    }
}
