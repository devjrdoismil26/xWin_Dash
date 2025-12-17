<?php

namespace App\Domains\Dashboard\Application\Handlers;

use App\Domains\Dashboard\Application\Queries\GetDashboardWidgetQuery;
use App\Domains\Dashboard\Repositories\DashboardWidgetRepository;
use App\Domains\Dashboard\Services\DashboardService;
use App\Domains\Dashboard\Exceptions\DashboardWidgetNotFoundException;

class GetDashboardWidgetHandler
{
    public function __construct(
        private DashboardWidgetRepository $dashboardWidgetRepository,
        private DashboardService $dashboardService
    ) {
    }

    public function handle(GetDashboardWidgetQuery $query): array
    {
        $widget = $this->dashboardWidgetRepository->findById($query->widgetId);

        if (!$widget) {
            throw new DashboardWidgetNotFoundException(
                "Dashboard widget with ID {$query->widgetId} not found"
            );
        }

        // Verificar se o widget pertence ao usuário
        if ($widget->user_id !== $query->userId) {
            throw new DashboardWidgetNotFoundException(
                "Widget does not belong to user"
            );
        }

        $result = [
            'id' => $widget->id,
            'name' => $widget->name,
            'type' => $widget->type,
            'description' => $widget->description,
            'position' => $widget->position,
            'size' => $widget->size,
            'is_visible' => $widget->is_visible,
            'configuration' => $widget->configuration,
            'created_at' => $widget->created_at->toISOString(),
            'updated_at' => $widget->updated_at->toISOString()
        ];

        if ($query->includeData) {
            $result['data'] = $this->dashboardService->getWidgetData($widget);
            $result['data_updated_at'] = now()->toISOString();
        }

        return $result;
    }
}
