<?php

namespace App\Domains\Dashboard\Application\Queries;

class ListDashboardWidgetsQuery
{
    public function __construct(
        public readonly int $userId,
        public readonly ?string $type = null,
        public readonly ?bool $isVisible = null,
        public readonly int $limit = 20,
        public readonly int $offset = 0,
        public readonly string $sortBy = 'position',
        public readonly string $sortDirection = 'asc'
    ) {
    }
}
