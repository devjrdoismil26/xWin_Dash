<?php

namespace App\Domains\Universe\Application\Queries;

class GetUniverseInstanceQuery
{
    public function __construct(
        public readonly int $instanceId,
        public readonly int $userId,
        public readonly bool $includeBlocks = false,
        public readonly bool $includeConnections = false,
        public readonly bool $includeAnalytics = false,
        public readonly bool $includeConfiguration = false
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            instanceId: $data['instance_id'],
            userId: $data['user_id'],
            includeBlocks: $data['include_blocks'] ?? false,
            includeConnections: $data['include_connections'] ?? false,
            includeAnalytics: $data['include_analytics'] ?? false,
            includeConfiguration: $data['include_configuration'] ?? false
        );
    }

    public function toArray(): array
    {
        return [
            'instance_id' => $this->instanceId,
            'user_id' => $this->userId,
            'include_blocks' => $this->includeBlocks,
            'include_connections' => $this->includeConnections,
            'include_analytics' => $this->includeAnalytics,
            'include_configuration' => $this->includeConfiguration
        ];
    }

    public function isValid(): bool
    {
        return $this->instanceId > 0 && $this->userId > 0;
    }

    public function getValidationErrors(): array
    {
        $errors = [];

        if ($this->instanceId <= 0) {
            $errors[] = 'ID da instância é obrigatório';
        }

        if ($this->userId <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        return $errors;
    }
}
