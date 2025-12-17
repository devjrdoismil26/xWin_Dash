<?php

namespace App\Domains\Dashboard\Application\Commands;

class DeleteDashboardWidgetCommand
{
    public function __construct(
        public readonly int $userId,
        public readonly int $widgetId,
        public readonly bool $forceDelete = false
    ) {
    }
}
