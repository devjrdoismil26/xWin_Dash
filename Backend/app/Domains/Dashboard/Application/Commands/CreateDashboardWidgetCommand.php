<?php

namespace App\Domains\Dashboard\Application\Commands;

class CreateDashboardWidgetCommand
{
    public function __construct(
        public readonly int $userId,
        public readonly string $name,
        public readonly string $type,
        public readonly array $configuration,
        public readonly ?string $description = null,
        public readonly ?int $position = null,
        public readonly ?string $size = null
    ) {
    }

    public function toArray(): array
    {
        return [
            'user_id' => $this->userId,
            'name' => $this->name,
            'type' => $this->type,
            'configuration' => $this->configuration,
            'description' => $this->description,
            'position' => $this->position,
            'size' => $this->size ?? 'medium'
        ];
    }
}
