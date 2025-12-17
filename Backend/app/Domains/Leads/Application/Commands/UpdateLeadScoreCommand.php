<?php

namespace App\Domains\Leads\Application\Commands;

class UpdateLeadScoreCommand
{
    public function __construct(
        public readonly int $leadId,
        public readonly int $score,
        public readonly ?string $reason = null
    ) {
    }

    public function toArray(): array
    {
        return [
            'lead_id' => $this->leadId,
            'score' => $this->score,
            'reason' => $this->reason
        ];
    }
}
