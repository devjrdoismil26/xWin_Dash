<?php

namespace App\Domains\Analytics\Application\Queries;

class GetMetricQuery
{
    public function __construct(
        public readonly int $metricId,
        public readonly bool $includeData = false,
        public readonly ?string $dateFrom = null,
        public readonly ?string $dateTo = null
    ) {
    }

    public function toArray(): array
    {
        return [
            'metric_id' => $this->metricId,
            'include_data' => $this->includeData,
            'date_from' => $this->dateFrom,
            'date_to' => $this->dateTo
        ];
    }
}
