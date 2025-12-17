<?php

namespace App\Domains\Auth\Application\Queries;

class GetUserSessionsQuery
{
    public function __construct(
        public readonly int $userId,
        public readonly ?bool $activeOnly = true,
        public readonly ?int $page = 1,
        public readonly ?int $perPage = 20
    ) {
    }

    public function toArray(): array
    {
        return [
            'user_id' => $this->userId,
            'active_only' => $this->activeOnly,
            'page' => $this->page,
            'per_page' => $this->perPage
        ];
    }
}
