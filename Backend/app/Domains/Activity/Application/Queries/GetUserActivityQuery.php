<?php

namespace App\Domains\Activity\Application\Queries;

class GetUserActivityQuery
{
    public function __construct(
        public readonly int $userId,
        public readonly ?string $action = null,
        public readonly ?string $dateFrom = null,
        public readonly ?string $dateTo = null,
        public readonly ?int $page = 1,
        public readonly ?int $perPage = 20
    ) {
    }

    public function toArray(): array
    {
        return [
            'user_id' => $this->userId,
            'action' => $this->action,
            'date_from' => $this->dateFrom,
            'date_to' => $this->dateTo,
            'page' => $this->page,
            'per_page' => $this->perPage
        ];
    }
}
