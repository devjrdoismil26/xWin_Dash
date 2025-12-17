<?php

namespace App\Shared\Events;

class LeadCreatedEvent extends BaseDomainEvent
{
    public function __construct(
        int $leadId,
        string $leadName,
        string $leadEmail,
        int $userId,
        ?int $projectId = null,
        ?string $leadSource = null,
        ?array $metadata = null
    ) {
        parent::__construct(
            [
                'lead_id' => $leadId,
                'lead_name' => $leadName,
                'lead_email' => $leadEmail,
                'lead_source' => $leadSource,
            ],
            $userId,
            $projectId,
            $metadata
        );
    }

    public static function getEventType(): string
    {
        return 'lead.created';
    }

    public function getLeadId(): int
    {
        return $this->payload['lead_id'];
    }

    public function getLeadName(): string
    {
        return $this->payload['lead_name'];
    }

    public function getLeadEmail(): string
    {
        return $this->payload['lead_email'];
    }

    public function getLeadSource(): ?string
    {
        return $this->payload['lead_source'];
    }
}