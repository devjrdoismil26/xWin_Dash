<?php

namespace App\Domains\Products\Application\Queries;

class ListProductCategoriesQuery
{
    public function __construct(
        public readonly ?int $parentId = null,
        public readonly ?string $search = null,
        public readonly ?int $page = 1,
        public readonly ?int $perPage = 20,
        public readonly ?string $sortBy = 'name',
        public readonly ?string $sortDirection = 'asc'
    ) {
    }

    public function toArray(): array
    {
        return [
            'parent_id' => $this->parentId,
            'search' => $this->search,
            'page' => $this->page,
            'per_page' => $this->perPage,
            'sort_by' => $this->sortBy,
            'sort_direction' => $this->sortDirection
        ];
    }
}
