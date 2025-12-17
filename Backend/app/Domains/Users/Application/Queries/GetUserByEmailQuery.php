<?php

namespace App\Domains\Users\Application\Queries;

class GetUserByEmailQuery
{
    public function __construct(
        public readonly string $email,
        public readonly bool $includeProfile = false,
        public readonly bool $includePreferences = false
    ) {
    }

    public function toArray(): array
    {
        return [
            'email' => $this->email,
            'include_profile' => $this->includeProfile,
            'include_preferences' => $this->includePreferences
        ];
    }
}
