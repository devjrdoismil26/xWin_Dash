<?php

namespace App\Domains\Categorization\Application\Queries;

class GetPopularTagsQuery
{
    public function __construct(
        public readonly int $userId,
        public readonly ?string $projectId = null,
        public readonly int $limit = 10,
        public readonly ?string $period = null // 'day', 'week', 'month', 'year'
    ) {
    }
}
