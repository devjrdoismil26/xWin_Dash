<?php

namespace App\Domains\Leads\Application\Queries;

class GetLeadAnalyticsQuery
{
    public function __construct(
        public readonly ?string $dateFrom = null,
        public readonly ?string $dateTo = null,
        public readonly ?string $source = null,
        public readonly ?string $status = null,
        public readonly ?int $assignedTo = null
    ) {
    }

    public function toArray(): array
    {
        return [
            'date_from' => $this->dateFrom,
            'date_to' => $this->dateTo,
            'source' => $this->source,
            'status' => $this->status,
            'assigned_to' => $this->assignedTo
        ];
    }
}
