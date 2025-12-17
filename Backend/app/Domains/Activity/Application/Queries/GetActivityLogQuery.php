<?php

namespace App\Domains\Activity\Application\Queries;

class GetActivityLogQuery
{
    public function __construct(
        public readonly int $activityId,
        public readonly bool $includeMetadata = false,
        public readonly bool $includeUser = false
    ) {
    }

    public function toArray(): array
    {
        return [
            'activity_id' => $this->activityId,
            'include_metadata' => $this->includeMetadata,
            'include_user' => $this->includeUser
        ];
    }
}
