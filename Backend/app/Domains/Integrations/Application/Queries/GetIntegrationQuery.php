<?php

namespace App\Domains\Integrations\Application\Queries;

class GetIntegrationQuery
{
    public function __construct(
        public readonly int $integrationId,
        public readonly bool $includeCredentials = false,
        public readonly bool $includeStatus = false
    ) {
    }

    public function toArray(): array
    {
        return [
            'integration_id' => $this->integrationId,
            'include_credentials' => $this->includeCredentials,
            'include_status' => $this->includeStatus
        ];
    }
}
