<?php

namespace App\Domains\Integrations\Application\Queries;

class GetIntegrationStatusQuery
{
    public function __construct(
        public readonly int $integrationId,
        public readonly ?string $statusType = 'health'
    ) {
    }

    public function toArray(): array
    {
        return [
            'integration_id' => $this->integrationId,
            'status_type' => $this->statusType
        ];
    }
}
