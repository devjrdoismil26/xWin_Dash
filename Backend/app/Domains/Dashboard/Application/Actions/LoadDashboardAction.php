<?php

namespace App\Domains\Dashboard\Application\Actions;

use App\Domains\Dashboard\Application\Services\CustomizationService;
use App\Domains\Dashboard\Application\Services\LayoutService;
use App\Domains\Dashboard\Application\Services\MetricsAggregatorService;
use App\Domains\Dashboard\Application\Services\WidgetService;

class LoadDashboardAction
{
    public function __construct(
        private readonly WidgetService $widgetService,
        private readonly LayoutService $layoutService,
        private readonly CustomizationService $customizationService,
        private readonly MetricsAggregatorService $metricsAggregatorService
    ) {
    }

    public function execute(string $userId): array
    {
        return [
            'widgets' => $this->widgetService->getAllWidgets(),
            'layout' => $this->layoutService->getLayoutByUserId($userId),
            'customization' => $this->customizationService->getConfigByUserId($userId),
            'metrics' => $this->metricsAggregatorService->getAggregatedMetrics($userId),
        ];
    }
}
