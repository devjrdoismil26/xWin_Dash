<?php

namespace App\Domains\Activity\Application\Commands;

class UpdateActivityLogCommand
{
    public function __construct(
        public readonly int $activityId,
        public readonly ?string $description = null,
        public readonly ?array $metadata = null,
        public readonly ?string $level = null
    ) {
    }

    public function toArray(): array
    {
        return array_filter([
            'activity_id' => $this->activityId,
            'description' => $this->description,
            'metadata' => $this->metadata,
            'level' => $this->level
        ], function ($value) {
            return $value !== null;
        });
    }
}
