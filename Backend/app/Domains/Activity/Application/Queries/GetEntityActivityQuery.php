<?php

namespace App\Domains\Activity\Application\Queries;

class GetEntityActivityQuery
{
    public function __construct(
        public readonly string $entityType,
        public readonly int $entityId,
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
            'entity_type' => $this->entityType,
            'entity_id' => $this->entityId,
            'action' => $this->action,
            'date_from' => $this->dateFrom,
            'date_to' => $this->dateTo,
            'page' => $this->page,
            'per_page' => $this->perPage
        ];
    }
}
