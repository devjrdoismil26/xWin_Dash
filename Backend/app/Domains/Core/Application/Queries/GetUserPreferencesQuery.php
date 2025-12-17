<?php

namespace App\Domains\Core\Application\Queries;

class GetUserPreferencesQuery
{
    public function __construct(
        public readonly string $userId,
        public readonly ?string $category = null,
        public readonly ?string $preferenceKey = null
    ) {
    }
}
