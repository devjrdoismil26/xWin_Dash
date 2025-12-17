<?php

namespace App\Domains\Users\Application\Queries;

class GetUserActivityQuery
{
    public function __construct(
        public readonly int $userId,
        public readonly ?string $activityType = null,
        public readonly ?string $dateFrom = null,
        public readonly ?string $dateTo = null,
        public readonly ?int $page = 1,
        public readonly ?int $perPage = 20,
        public readonly ?string $sortBy = 'created_at',
        public readonly ?string $sortDirection = 'desc'
    ) {
    }

    public function toArray(): array
    {
        return [
            'user_id' => $this->userId,
            'activity_type' => $this->activityType,
            'date_from' => $this->dateFrom,
            'date_to' => $this->dateTo,
            'page' => $this->page,
            'per_page' => $this->perPage,
            'sort_by' => $this->sortBy,
            'sort_direction' => $this->sortDirection
        ];
    }
}
