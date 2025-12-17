<?php

namespace App\Domains\Core\Application\Queries;

class ListSettingsQuery
{
    public function __construct(
        public readonly string $userId,
        public readonly ?string $category = null,
        public readonly ?string $type = null,
        public readonly ?string $search = null,
        public readonly int $limit = 20,
        public readonly int $offset = 0,
        public readonly string $sortBy = 'key',
        public readonly string $sortDirection = 'asc'
    ) {
    }
}
