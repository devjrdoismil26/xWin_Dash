<?php

namespace App\Domains\Categorization\Application\Commands;

class CreateTagCommand
{
    public function __construct(
        public readonly int $userId,
        public readonly string $name,
        public readonly string $projectId,
        public readonly ?string $color = null,
        public readonly ?string $description = null
    ) {
    }

    public function toArray(): array
    {
        return [
            'user_id' => $this->userId,
            'name' => $this->name,
            'project_id' => $this->projectId,
            'color' => $this->color,
            'description' => $this->description
        ];
    }
}
