<?php

namespace App\Domains\Projects\Application\DTOs;

class TimelineDTO
{
    public function __construct(
        public readonly string $projectId,
        public readonly array $events,
        public readonly ?string $startDate = null,
        public readonly ?string $endDate = null
    ) {
    }

    public function toArray(): array
    {
        return [
            'project_id' => $this->projectId,
            'events' => $this->events,
            'start_date' => $this->startDate,
            'end_date' => $this->endDate,
        ];
    }
}
