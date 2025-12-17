<?php

namespace App\Domains\Core\Application\DTOs;

readonly class NotificationDTO
{
    public function __construct(
        public string $title,
        public string $message,
        public string $type,
        public array $data = [],
        public array $channels = ['database']
    ) {}
}
