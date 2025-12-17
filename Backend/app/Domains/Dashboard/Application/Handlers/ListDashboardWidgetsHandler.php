<?php

namespace App\Domains\Dashboard\Application\Handlers;

use App\Domains\Dashboard\Application\Queries\ListDashboardWidgetsQuery;
use App\Domains\Dashboard\Repositories\DashboardWidgetRepository;

class ListDashboardWidgetsHandler
{
    public function __construct(
        private DashboardWidgetRepository $dashboardWidgetRepository
    ) {
    }

    public function handle(ListDashboardWidgetsQuery $query): array
    {
        $filters = [
            'user_id' => $query->userId,
            'type' => $query->type,
            'is_visible' => $query->isVisible
        ];

        $widgets = $this->dashboardWidgetRepository->findByFilters(
            $filters,
            $query->limit,
            $query->offset,
            $query->sortBy,
            $query->sortDirection
        );

        $total = $this->dashboardWidgetRepository->countByFilters($filters);

        return [
            'widgets' => $widgets->map(function ($widget) {
                return [
                    'id' => $widget->id,
                    'name' => $widget->name,
                    'type' => $widget->type,
                    'description' => $widget->description,
                    'position' => $widget->position,
                    'size' => $widget->size,
                    'is_visible' => $widget->is_visible,
                    'created_at' => $widget->created_at->toISOString(),
                    'updated_at' => $widget->updated_at->toISOString()
                ];
            })->toArray(),
            'pagination' => [
                'total' => $total,
                'limit' => $query->limit,
                'offset' => $query->offset,
                'has_more' => ($query->offset + $query->limit) < $total
            ]
        ];
    }
}
