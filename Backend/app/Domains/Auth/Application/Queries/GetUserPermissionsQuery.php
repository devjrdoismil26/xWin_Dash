<?php

namespace App\Domains\Auth\Application\Queries;

class GetUserPermissionsQuery
{
    public function __construct(
        public readonly int $userId,
        public readonly ?string $module = null,
        public readonly ?bool $includeRoles = true
    ) {
    }

    public function toArray(): array
    {
        return [
            'user_id' => $this->userId,
            'module' => $this->module,
            'include_roles' => $this->includeRoles
        ];
    }
}
