<?php

namespace App\Domains\Integrations\Application\Commands;

class UpdateIntegrationCommand
{
    public function __construct(
        public readonly int $integrationId,
        public readonly ?string $name = null,
        public readonly ?string $type = null,
        public readonly ?string $description = null,
        public readonly ?array $configuration = null,
        public readonly ?array $credentials = null,
        public readonly ?bool $isActive = null,
        public readonly ?array $metadata = null
    ) {
    }

    public function toArray(): array
    {
        return array_filter([
            'integration_id' => $this->integrationId,
            'name' => $this->name,
            'type' => $this->type,
            'description' => $this->description,
            'configuration' => $this->configuration,
            'credentials' => $this->credentials,
            'is_active' => $this->isActive,
            'metadata' => $this->metadata
        ], function ($value) {
            return $value !== null;
        });
    }
}
