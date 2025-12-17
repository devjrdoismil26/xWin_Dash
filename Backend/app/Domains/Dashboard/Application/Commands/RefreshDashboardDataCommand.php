<?php

namespace App\Domains\Dashboard\Application\Commands;

class RefreshDashboardDataCommand
{
    public function __construct(
        public readonly int $userId,
        public readonly ?int $widgetId = null,
        public readonly ?string $dataType = null,
        public readonly bool $forceRefresh = false
    ) {
    }
}
