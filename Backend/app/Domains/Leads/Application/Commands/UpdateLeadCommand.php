<?php

namespace App\Domains\Leads\Application\Commands;

class UpdateLeadCommand
{
    public function __construct(
        public readonly int $leadId,
        public readonly ?string $name = null,
        public readonly ?string $email = null,
        public readonly ?string $phone = null,
        public readonly ?string $company = null,
        public readonly ?string $position = null,
        public readonly ?string $source = null,
        public readonly ?string $status = null,
        public readonly ?int $score = null,
        public readonly ?array $customFields = null,
        public readonly ?array $tags = null,
        public readonly ?int $assignedTo = null,
        public readonly ?string $notes = null
    ) {
    }

    public function toArray(): array
    {
        return array_filter([
            'lead_id' => $this->leadId,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'company' => $this->company,
            'position' => $this->position,
            'source' => $this->source,
            'status' => $this->status,
            'score' => $this->score,
            'custom_fields' => $this->customFields,
            'tags' => $this->tags,
            'assigned_to' => $this->assignedTo,
            'notes' => $this->notes
        ], function ($value) {
            return $value !== null;
        });
    }
}
