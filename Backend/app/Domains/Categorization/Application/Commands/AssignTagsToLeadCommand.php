<?php

namespace App\Domains\Categorization\Application\Commands;

class AssignTagsToLeadCommand
{
    public function __construct(
        public readonly int $userId,
        public readonly string $leadId,
        public readonly array $tagIds,
        public readonly bool $replaceExisting = false
    ) {
    }
}
