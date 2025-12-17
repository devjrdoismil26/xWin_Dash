<?php

namespace App\Domains\Dashboard\Application\Queries;

class GetDashboardOverviewQuery
{
    public function __construct(
        public readonly int $userId,
        public readonly ?string $dateRange = null,
        public readonly ?array $metrics = null
    ) {
    }
}
