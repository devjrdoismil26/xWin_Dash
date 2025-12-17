<?php

namespace App\Domains\Products\Application\Commands;

class CreateProductCategoryCommand
{
    public function __construct(
        public readonly string $name,
        public readonly ?string $description = null,
        public readonly ?int $parentId = null,
        public readonly ?string $slug = null,
        public readonly ?array $metadata = null
    ) {
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'description' => $this->description,
            'parent_id' => $this->parentId,
            'slug' => $this->slug,
            'metadata' => $this->metadata
        ];
    }
}
