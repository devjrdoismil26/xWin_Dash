<?php

namespace App\Domains\Analytics\Application\Commands;

class CreateMetricCommand
{
    public function __construct(
        public readonly string $name,
        public readonly string $type,
        public readonly ?string $description = null,
        public readonly ?array $configuration = null,
        public readonly ?string $category = null,
        public readonly ?array $tags = null,
        public readonly ?bool $isActive = true
    ) {
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'type' => $this->type,
            'description' => $this->description,
            'configuration' => $this->configuration,
            'category' => $this->category,
            'tags' => $this->tags,
            'is_active' => $this->isActive
        ];
    }
}
