<?php

namespace App\Domains\Dashboard\Application\Queries;

class GetDashboardWidgetQuery
{
    public function __construct(
        public readonly int $userId,
        public readonly int $widgetId,
        public readonly bool $includeData = true
    ) {
    }
}
