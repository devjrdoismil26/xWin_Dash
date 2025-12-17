<?php

namespace App\Domains\Categorization\Application\Commands;

class UpdateTagCommand
{
    public function __construct(
        public readonly int $userId,
        public readonly string $tagId,
        public readonly ?string $name = null,
        public readonly ?string $color = null,
        public readonly ?string $description = null
    ) {
    }

    public function toArray(): array
    {
        $data = ['user_id' => $this->userId];

        if ($this->name !== null) {
            $data['name'] = $this->name;
        }
        if ($this->color !== null) {
            $data['color'] = $this->color;
        }
        if ($this->description !== null) {
            $data['description'] = $this->description;
        }

        return $data;
    }
}
