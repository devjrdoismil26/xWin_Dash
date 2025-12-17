<?php

namespace App\Domains\Core\Application\DTOs;

readonly class IntegrationConfigDTO
{
    public function __construct(
        public string $service,
        public array $credentials,
        public array $settings = [],
        public bool $is_active = true
    ) {}
}
