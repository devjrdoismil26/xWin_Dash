<?php

namespace App\Domains\Core\Application\Commands;

class CreateSettingCommand
{
    public function __construct(
        public readonly string $userId,
        public readonly string $key,
        public readonly mixed $value,
        public readonly ?string $description = null,
        public readonly ?string $type = null,
        public readonly ?array $metadata = null
    ) {
    }

    public function toArray(): array
    {
        return [
            'user_id' => $this->userId,
            'key' => $this->key,
            'value' => $this->value,
            'description' => $this->description,
            'type' => $this->type,
            'metadata' => $this->metadata
        ];
    }
}
