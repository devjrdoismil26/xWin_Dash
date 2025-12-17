<?php

namespace App\Domains\Categorization\Application\Queries;

class GetTagQuery
{
    public function __construct(
        public readonly int $userId,
        public readonly string $tagId,
        public readonly bool $includeLeadCount = true
    ) {
    }
}
