<?php

namespace App\Domains\Dashboard\Application\Commands;

class ExportDashboardDataCommand
{
    public function __construct(
        public readonly int $userId,
        public readonly string $format, // 'csv', 'excel', 'pdf'
        public readonly ?array $widgetIds = null,
        public readonly ?string $dateRange = null,
        public readonly ?array $filters = null
    ) {
    }
}
