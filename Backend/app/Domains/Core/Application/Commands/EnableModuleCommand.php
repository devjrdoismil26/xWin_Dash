<?php

namespace App\Domains\Core\Application\Commands;

class EnableModuleCommand
{
    public function __construct(
        public readonly int $userId,
        public readonly string $moduleName,
        public readonly ?array $configuration = null
    ) {
    }
}
