<?php

namespace App\Domains\Integrations\Application\Commands;

class TestIntegrationCommand
{
    public function __construct(
        public readonly int $integrationId,
        public readonly ?array $testData = null,
        public readonly ?string $testType = 'connection'
    ) {
    }

    public function toArray(): array
    {
        return [
            'integration_id' => $this->integrationId,
            'test_data' => $this->testData,
            'test_type' => $this->testType
        ];
    }
}
