<?php

namespace App\Domains\Aura\Application\Queries;

class ListAuraChatsQuery
{
    public function __construct(
        public readonly ?string $search = null,
        public readonly ?string $personality = null,
        public readonly ?bool $isActive = null,
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
            'personality' => $this->personality,
            'is_active' => $this->isActive,
            'page' => $this->page,
            'per_page' => $this->perPage,
            'sort_by' => $this->sortBy,
            'sort_direction' => $this->sortDirection
        ];
    }
}
