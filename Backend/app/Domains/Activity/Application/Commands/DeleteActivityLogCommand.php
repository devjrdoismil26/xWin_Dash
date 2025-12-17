<?php

namespace App\Domains\Activity\Application\Commands;

class DeleteActivityLogCommand
{
    public function __construct(
        public readonly int $activityId,
        public readonly bool $forceDelete = false
    ) {
    }

    public function toArray(): array
    {
        return [
            'activity_id' => $this->activityId,
            'force_delete' => $this->forceDelete
        ];
    }
}
