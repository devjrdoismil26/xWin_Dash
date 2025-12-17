<?php

namespace App\Domains\Leads\Application\Commands;

class ConvertLeadCommand
{
    public function __construct(
        public readonly int $leadId,
        public readonly string $conversionType,
        public readonly ?int $convertedToId = null,
        public readonly ?string $notes = null
    ) {
    }

    public function toArray(): array
    {
        return [
            'lead_id' => $this->leadId,
            'conversion_type' => $this->conversionType,
            'converted_to_id' => $this->convertedToId,
            'notes' => $this->notes
        ];
    }
}
