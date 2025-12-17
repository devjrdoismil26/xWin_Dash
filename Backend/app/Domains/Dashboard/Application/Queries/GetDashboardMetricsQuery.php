<?php

namespace App\Domains\Dashboard\Application\Queries;

class GetDashboardMetricsQuery
{
    public function __construct(
        public readonly int $userId,
        public readonly string $metricType, // 'leads', 'projects', 'analytics', 'performance'
        public readonly ?string $dateRange = null,
        public readonly ?array $filters = null,
        public readonly ?string $groupBy = null
    ) {
    }
}
