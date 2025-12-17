<?php

namespace App\Domains\Analytics\Application\Queries;

class GetAnalyticsDataQuery
{
    public function __construct(
        public readonly array $metrics,
        public readonly ?string $dateFrom = null,
        public readonly ?string $dateTo = null,
        public readonly ?array $filters = null,
        public readonly ?string $groupBy = null,
        public readonly ?string $aggregation = 'sum'
    ) {
    }

    public function toArray(): array
    {
        return [
            'metrics' => $this->metrics,
            'date_from' => $this->dateFrom,
            'date_to' => $this->dateTo,
            'filters' => $this->filters,
            'group_by' => $this->groupBy,
            'aggregation' => $this->aggregation
        ];
    }
}
