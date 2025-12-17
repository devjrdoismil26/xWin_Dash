<?php

namespace App\Domains\Leads\Application\Commands;

class CreateLeadCommand
{
    public function __construct(
        public readonly string $name,
        public readonly string $email,
        public readonly ?string $phone = null,
        public readonly ?string $company = null,
        public readonly ?string $position = null,
        public readonly ?string $source = null,
        public readonly ?string $status = 'new',
        public readonly ?int $score = 0,
        public readonly ?array $customFields = null,
        public readonly ?array $tags = null,
        public readonly ?int $assignedTo = null,
        public readonly ?string $notes = null
    ) {
    }

    public function toArray(): array
    {
        return [
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
        ];
    }
}
