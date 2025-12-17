<?php

namespace App\Domains\Integrations\Application\Commands;

class SyncIntegrationCommand
{
    public function __construct(
        public readonly int $integrationId,
        public readonly ?string $syncType = 'full',
        public readonly ?array $filters = null,
        public readonly ?bool $forceSync = false
    ) {
    }

    public function toArray(): array
    {
        return [
            'integration_id' => $this->integrationId,
            'sync_type' => $this->syncType,
            'filters' => $this->filters,
            'force_sync' => $this->forceSync
        ];
    }
}
