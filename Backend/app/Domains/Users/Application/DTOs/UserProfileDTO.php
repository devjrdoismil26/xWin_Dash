<?php

namespace App\Domains\Users\Application\DTOs;

readonly class UserProfileDTO
{
    public function __construct(
        public string $user_id,
        public ?string $avatar,
        public ?string $bio,
        public ?string $phone,
        public string $timezone,
        public array $preferences = []
    ) {}
}
