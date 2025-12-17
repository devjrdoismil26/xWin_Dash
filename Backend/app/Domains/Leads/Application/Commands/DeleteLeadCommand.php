<?php

namespace App\Domains\Leads\Application\Commands;

class DeleteLeadCommand
{
    public function __construct(
        public readonly int $leadId,
        public readonly bool $forceDelete = false
    ) {
    }

    public function toArray(): array
    {
        return [
            'lead_id' => $this->leadId,
            'force_delete' => $this->forceDelete
        ];
    }
}
