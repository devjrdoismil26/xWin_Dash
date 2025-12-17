<?php

namespace App\Domains\Categorization\Application\Queries;

class GetLeadTagsQuery
{
    public function __construct(
        public readonly int $userId,
        public readonly string $leadId
    ) {
    }
}
