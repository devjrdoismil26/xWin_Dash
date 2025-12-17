<?php

namespace App\Domains\Users\Application\Queries;

class GetUserQuery
{
    public function __construct(
        public readonly int $userId,
        public readonly bool $includeProfile = false,
        public readonly bool $includePreferences = false,
        public readonly bool $includeActivity = false,
        public readonly bool $includePermissions = false
    ) {
    }

    public function toArray(): array
    {
        return [
            'user_id' => $this->userId,
            'include_profile' => $this->includeProfile,
            'include_preferences' => $this->includePreferences,
            'include_activity' => $this->includeActivity,
            'include_permissions' => $this->includePermissions
        ];
    }
}
