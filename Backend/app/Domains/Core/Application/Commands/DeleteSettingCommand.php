<?php

namespace App\Domains\Core\Application\Commands;

class DeleteSettingCommand
{
    public function __construct(
        public readonly string $userId,
        public readonly string $settingKey,
        public readonly bool $forceDelete = false
    ) {
    }
}
