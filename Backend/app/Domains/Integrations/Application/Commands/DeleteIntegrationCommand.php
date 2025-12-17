<?php

namespace App\Domains\Integrations\Application\Commands;

class DeleteIntegrationCommand
{
    public function __construct(
        public readonly int $integrationId,
        public readonly bool $forceDelete = false
    ) {
    }

    public function toArray(): array
    {
        return [
            'integration_id' => $this->integrationId,
            'force_delete' => $this->forceDelete
        ];
    }
}
