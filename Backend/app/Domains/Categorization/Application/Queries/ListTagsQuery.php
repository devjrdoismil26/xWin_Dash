<?php

namespace App\Domains\Categorization\Application\Queries;

class ListTagsQuery
{
    public function __construct(
        public readonly int $userId,
        public readonly ?string $projectId = null,
        public readonly ?string $search = null,
        public readonly ?string $color = null,
        public readonly int $limit = 20,
        public readonly int $offset = 0,
        public readonly string $sortBy = 'name',
        public readonly string $sortDirection = 'asc'
    ) {
    }
}
