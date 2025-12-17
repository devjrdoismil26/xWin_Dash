<?php

namespace App\Domains\Activity\Application\Commands;

class LogActivityCommand
{
    public function __construct(
        public readonly string $action,
        public readonly ?string $description = null,
        public readonly ?string $entityType = null,
        public readonly ?int $entityId = null,
        public readonly ?int $userId = null,
        public readonly ?array $metadata = null,
        public readonly ?string $ipAddress = null,
        public readonly ?string $userAgent = null
    ) {
    }

    public function toArray(): array
    {
        return [
            'action' => $this->action,
            'description' => $this->description,
            'entity_type' => $this->entityType,
            'entity_id' => $this->entityId,
            'user_id' => $this->userId,
            'metadata' => $this->metadata,
            'ip_address' => $this->ipAddress,
            'user_agent' => $this->userAgent
        ];
    }
}
