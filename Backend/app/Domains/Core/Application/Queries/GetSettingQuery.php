<?php

namespace App\Domains\Core\Application\Queries;

class GetSettingQuery
{
    public function __construct(
        public readonly string $userId,
        public readonly string $settingKey,
        public readonly bool $includeMetadata = true
    ) {
    }
}
