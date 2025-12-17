<?php

namespace App\Domains\Core\Application\Queries;

class GetModuleStatusQuery
{
    public function __construct(
        public readonly int $userId,
        public readonly ?string $moduleName = null,
        public readonly bool $includeConfiguration = false
    ) {
    }
}
