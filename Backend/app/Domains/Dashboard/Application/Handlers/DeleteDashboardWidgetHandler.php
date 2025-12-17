<?php

namespace App\Domains\Dashboard\Application\Handlers;

use App\Domains\Dashboard\Application\Commands\DeleteDashboardWidgetCommand;
use App\Domains\Dashboard\Services\DashboardService;
use App\Domains\Dashboard\Repositories\DashboardWidgetRepository;
use App\Domains\Dashboard\Exceptions\DashboardWidgetNotFoundException;
use App\Domains\Dashboard\Exceptions\DashboardWidgetDeletionException;
use Illuminate\Support\Facades\Log;

class DeleteDashboardWidgetHandler
{
    public function __construct(
        private DashboardService $dashboardService,
        private DashboardWidgetRepository $dashboardWidgetRepository
    ) {
    }

    public function handle(DeleteDashboardWidgetCommand $command): array
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
                throw new DashboardWidgetDeletionException(
                    "Widget does not belong to user"
                );
            }

            // Verificar se é um widget crítico
            if ($this->isCriticalWidget($widget->type) && !$command->forceDelete) {
                throw new DashboardWidgetDeletionException(
                    "Cannot delete critical widget '{$widget->name}'. Use force delete to proceed."
                );
            }

            // Deletar o widget
            $this->dashboardWidgetRepository->delete($command->widgetId);

            // Reorganizar posições dos widgets restantes
            $this->reorganizeWidgetPositions($command->userId);

            // Log da deleção
            Log::info("Dashboard widget deleted", [
                'widget_id' => $command->widgetId,
                'name' => $widget->name,
                'type' => $widget->type,
                'user_id' => $command->userId,
                'force_delete' => $command->forceDelete
            ]);

            return [
                'success' => true,
                'widget_id' => $command->widgetId,
                'deleted_at' => now()->toISOString()
            ];
        } catch (DashboardWidgetNotFoundException $e) {
            Log::error("Dashboard widget not found for deletion", [
                'widget_id' => $command->widgetId,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        } catch (DashboardWidgetDeletionException $e) {
            Log::error("Dashboard widget deletion failed", [
                'widget_id' => $command->widgetId,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        } catch (\Exception $e) {
            Log::error("Unexpected error during dashboard widget deletion", [
                'widget_id' => $command->widgetId,
                'user_id' => $command->userId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            throw new DashboardWidgetDeletionException(
                "Failed to delete dashboard widget: " . $e->getMessage()
            );
        }
    }

    private function isCriticalWidget(string $type): bool
    {
        $criticalWidgets = ['overview_metrics', 'system_status'];
        return in_array($type, $criticalWidgets);
    }

    private function reorganizeWidgetPositions(int $userId): void
    {
        $widgets = $this->dashboardWidgetRepository->findByUserId($userId);

        foreach ($widgets as $index => $widget) {
            if ($widget->position !== $index + 1) {
                $this->dashboardWidgetRepository->update($widget->id, [
                    'position' => $index + 1
                ]);
            }
        }
    }
}
