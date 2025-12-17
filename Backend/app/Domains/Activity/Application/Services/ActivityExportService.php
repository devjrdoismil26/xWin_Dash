<?php

namespace App\Domains\Activity\Application\Services;

use App\Domains\Activity\Application\DTOs\ActivityExportDTO;
use Illuminate\Support\Collection;

class ActivityExportService
{
    public function export(ActivityExportDTO $dto): string
    {
        $activities = $this->getActivities($dto);

        return match($dto->format) {
            'csv' => $this->generateCSV($activities),
            'json' => $this->generateJSON($activities),
            default => throw new \InvalidArgumentException('Invalid format')
        };
    }

    private function getActivities(ActivityExportDTO $dto): Collection
    {
        $query = \DB::table('activity_logs');

        if ($dto->filters->user_id) {
            $query->where('user_id', $dto->filters->user_id);
        }
        if ($dto->filters->entity_type) {
            $query->where('entity_type', $dto->filters->entity_type);
        }
        if ($dto->filters->action) {
            $query->where('action', $dto->filters->action);
        }

        return $query->get();
    }

    public function generateCSV(Collection $activities): string
    {
        $csv = "ID,User ID,Action,Entity Type,Entity ID,Created At\n";
        
        foreach ($activities as $activity) {
            $csv .= implode(',', [
                $activity->id,
                $activity->user_id,
                $activity->action,
                $activity->entity_type,
                $activity->entity_id,
                $activity->created_at
            ]) . "\n";
        }

        return $csv;
    }

    public function generateJSON(Collection $activities): string
    {
        return json_encode($activities->toArray(), JSON_PRETTY_PRINT);
    }
}
