<?php

namespace App\Domains\Projects\Application\Services;

use App\Domains\Projects\Application\DTOs\TimelineDTO;
use Illuminate\Support\Collection;

class TimelineService
{
    public function generateTimeline(string $projectId): TimelineDTO
    {
        $events = $this->getProjectEvents($projectId);
        $dates = $this->calculateProjectDates($projectId);

        return new TimelineDTO(
            projectId: $projectId,
            events: $events->toArray(),
            startDate: $dates['start'],
            endDate: $dates['end']
        );
    }

    private function getProjectEvents(string $projectId): Collection
    {
        return collect([]);
    }

    private function calculateProjectDates(string $projectId): array
    {
        return [
            'start' => now()->toDateString(),
            'end' => now()->addMonths(3)->toDateString(),
        ];
    }
}
