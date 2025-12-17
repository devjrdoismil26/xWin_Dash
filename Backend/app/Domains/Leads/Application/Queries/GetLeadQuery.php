<?php

namespace App\Domains\Leads\Application\Queries;

class GetLeadQuery
{
    public function __construct(
        public readonly int $leadId,
        public readonly bool $includeActivities = false,
        public readonly bool $includeConversations = false,
        public readonly bool $includeScoreHistory = false
    ) {
    }

    public function toArray(): array
    {
        return [
            'lead_id' => $this->leadId,
            'include_activities' => $this->includeActivities,
            'include_conversations' => $this->includeConversations,
            'include_score_history' => $this->includeScoreHistory
        ];
    }
}
