<?php

namespace App\Domains\Core\Application\Commands;

class UpdateSettingCommand
{
    public function __construct(
        public readonly string $userId,
        public readonly string $settingKey,
        public readonly ?mixed $value = null,
        public readonly ?string $description = null,
        public readonly ?string $type = null,
        public readonly ?array $metadata = null
    ) {
    }

    public function toArray(): array
    {
        $data = ['user_id' => $this->userId];

        if ($this->value !== null) {
            $data['value'] = $this->value;
        }
        if ($this->description !== null) {
            $data['description'] = $this->description;
        }
        if ($this->type !== null) {
            $data['type'] = $this->type;
        }
        if ($this->metadata !== null) {
            $data['metadata'] = $this->metadata;
        }

        return $data;
    }
}
