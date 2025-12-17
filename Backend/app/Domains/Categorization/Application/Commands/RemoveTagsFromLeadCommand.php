<?php

namespace App\Domains\Categorization\Application\Commands;

class RemoveTagsFromLeadCommand
{
    public function __construct(
        public readonly int $userId,
        public readonly string $leadId,
        public readonly array $tagIds
    ) {
    }
}
