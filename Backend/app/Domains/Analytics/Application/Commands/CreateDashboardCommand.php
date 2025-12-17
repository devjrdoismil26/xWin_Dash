<?php

namespace App\Domains\Analytics\Application\Commands;

class CreateDashboardCommand
{
    public function __construct(
        public readonly string $name,
        public readonly ?string $description = null,
        public readonly ?array $layout = null,
        public readonly ?array $widgets = null,
        public readonly ?bool $isPublic = false,
        public readonly ?array $tags = null
    ) {
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'description' => $this->description,
            'layout' => $this->layout,
            'widgets' => $this->widgets,
            'is_public' => $this->isPublic,
            'tags' => $this->tags
        ];
    }
}
