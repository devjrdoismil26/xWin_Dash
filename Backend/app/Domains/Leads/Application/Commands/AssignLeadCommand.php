<?php

namespace App\Domains\Leads\Application\Commands;

class AssignLeadCommand
{
    public function __construct(
        public readonly int $leadId,
        public readonly int $assignedTo,
        public readonly ?string $notes = null
    ) {
    }

    public function toArray(): array
    {
        return [
            'lead_id' => $this->leadId,
            'assigned_to' => $this->assignedTo,
            'notes' => $this->notes
        ];
    }
}
