<?php

namespace App\Domains\Integrations\Application\Commands;

class CreateIntegrationCommand
{
    public function __construct(
        public readonly string $name,
        public readonly string $type,
        public readonly ?string $description = null,
        public readonly ?array $configuration = null,
        public readonly ?array $credentials = null,
        public readonly ?bool $isActive = true,
        public readonly ?array $metadata = null
    ) {
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'type' => $this->type,
            'description' => $this->description,
            'configuration' => $this->configuration,
            'credentials' => $this->credentials,
            'is_active' => $this->isActive,
            'metadata' => $this->metadata
        ];
    }
}
