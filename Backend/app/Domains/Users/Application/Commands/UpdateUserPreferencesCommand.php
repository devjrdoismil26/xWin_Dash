<?php

namespace App\Domains\Users\Application\Commands;

class UpdateUserPreferencesCommand
{
    public function __construct(
        public readonly int $userId,
        public readonly array $preferences,
        public readonly bool $merge = true
    ) {
    }

    public function toArray(): array
    {
        return [
            'user_id' => $this->userId,
            'preferences' => $this->preferences,
            'merge' => $this->merge
        ];
    }
}
