<?php

namespace App\Domains\Core\Application\Commands;

class DisableModuleCommand
{
    public function __construct(
        public readonly int $userId,
        public readonly string $moduleName,
        public readonly bool $forceDisable = false
    ) {
    }
}
