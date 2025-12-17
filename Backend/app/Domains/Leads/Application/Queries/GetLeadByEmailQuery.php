<?php

namespace App\Domains\Leads\Application\Queries;

class GetLeadByEmailQuery
{
    public function __construct(
        public readonly string $email,
        public readonly bool $includeActivities = false
    ) {
    }

    public function toArray(): array
    {
        return [
            'email' => $this->email,
            'include_activities' => $this->includeActivities
        ];
    }
}
