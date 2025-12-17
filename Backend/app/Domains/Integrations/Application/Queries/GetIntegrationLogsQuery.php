<?php

namespace App\Domains\Integrations\Application\Queries;

class GetIntegrationLogsQuery
{
    public function __construct(
        public readonly int $integrationId,
        public readonly ?string $logLevel = null,
        public readonly ?string $dateFrom = null,
        public readonly ?string $dateTo = null,
        public readonly ?int $page = 1,
        public readonly ?int $perPage = 20
    ) {
    }

    public function toArray(): array
    {
        return [
            'integration_id' => $this->integrationId,
            'log_level' => $this->logLevel,
            'date_from' => $this->dateFrom,
            'date_to' => $this->dateTo,
            'page' => $this->page,
            'per_page' => $this->perPage
        ];
    }
}
