<?php

namespace App\Domains\Leads\Application\Queries;

class ListLeadsQuery
{
    public function __construct(
        public readonly ?string $search = null,
        public readonly ?string $status = null,
        public readonly ?string $source = null,
        public readonly ?int $assignedTo = null,
        public readonly ?array $tags = null,
        public readonly ?int $minScore = null,
        public readonly ?int $maxScore = null,
        public readonly ?string $dateFrom = null,
        public readonly ?string $dateTo = null,
        public readonly ?int $page = 1,
        public readonly ?int $perPage = 15,
        public readonly ?string $sortBy = 'created_at',
        public readonly ?string $sortDirection = 'desc',
        public readonly bool $includeActivities = false
    ) {
    }

    public function toArray(): array
    {
        return [
            'search' => $this->search,
            'status' => $this->status,
            'source' => $this->source,
            'assigned_to' => $this->assignedTo,
            'tags' => $this->tags,
            'min_score' => $this->minScore,
            'max_score' => $this->maxScore,
            'date_from' => $this->dateFrom,
            'date_to' => $this->dateTo,
            'page' => $this->page,
            'per_page' => $this->perPage,
            'sort_by' => $this->sortBy,
            'sort_direction' => $this->sortDirection,
            'include_activities' => $this->includeActivities
        ];
    }
}
