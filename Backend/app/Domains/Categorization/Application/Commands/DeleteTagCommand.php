<?php

namespace App\Domains\Categorization\Application\Commands;

class DeleteTagCommand
{
    public function __construct(
        public readonly int $userId,
        public readonly string $tagId,
        public readonly bool $forceDelete = false
    ) {
    }
}
