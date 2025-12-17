<?php

namespace App\Domains\Users\Application\Queries;

class ListUsersQuery
{
    public function __construct(
        public readonly ?string $search = null,
        public readonly ?string $role = null,
        public readonly ?bool $isActive = null,
        public readonly ?string $dateFrom = null,
        public readonly ?string $dateTo = null,
        public readonly ?int $page = 1,
        public readonly ?int $perPage = 15,
        public readonly ?string $sortBy = 'created_at',
        public readonly ?string $sortDirection = 'desc',
        public readonly bool $includeProfile = false,
        public readonly bool $includeActivity = false
    ) {
    }

    public function toArray(): array
    {
        return [
            'search' => $this->search,
            'role' => $this->role,
            'is_active' => $this->isActive,
            'date_from' => $this->dateFrom,
            'date_to' => $this->dateTo,
            'page' => $this->page,
            'per_page' => $this->perPage,
            'sort_by' => $this->sortBy,
            'sort_direction' => $this->sortDirection,
            'include_profile' => $this->includeProfile,
            'include_activity' => $this->includeActivity
        ];
    }
}
