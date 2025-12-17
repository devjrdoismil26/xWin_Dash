<?php

namespace App\Domains\Analytics\Application\Queries;

class ListMetricsQuery
{
    public function __construct(
        public readonly ?string $search = null,
        public readonly ?string $type = null,
        public readonly ?string $category = null,
        public readonly ?bool $isActive = null,
        public readonly ?array $tags = null,
        public readonly ?int $page = 1,
        public readonly ?int $perPage = 15,
        public readonly ?string $sortBy = 'created_at',
        public readonly ?string $sortDirection = 'desc'
    ) {
    }

    public function toArray(): array
    {
        return [
            'search' => $this->search,
            'type' => $this->type,
            'category' => $this->category,
            'is_active' => $this->isActive,
            'tags' => $this->tags,
            'page' => $this->page,
            'per_page' => $this->perPage,
            'sort_by' => $this->sortBy,
            'sort_direction' => $this->sortDirection
        ];
    }
}
