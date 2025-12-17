<?php

namespace App\Domains\Analytics\Application\Queries;

class GetDashboardQuery
{
    public function __construct(
        public readonly int $dashboardId,
        public readonly bool $includeData = false,
        public readonly ?string $dateFrom = null,
        public readonly ?string $dateTo = null
    ) {
    }

    public function toArray(): array
    {
        return [
            'dashboard_id' => $this->dashboardId,
            'include_data' => $this->includeData,
            'date_from' => $this->dateFrom,
            'date_to' => $this->dateTo
        ];
    }
}
