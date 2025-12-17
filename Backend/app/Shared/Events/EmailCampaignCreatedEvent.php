<?php

namespace App\Shared\Events;

class EmailCampaignCreatedEvent extends BaseDomainEvent
{
    public function __construct(
        int $campaignId,
        string $campaignName,
        int $userId,
        ?int $projectId = null,
        ?string $campaignType = null,
        ?array $metadata = null
    ) {
        parent::__construct(
            [
                'campaign_id' => $campaignId,
                'campaign_name' => $campaignName,
                'campaign_type' => $campaignType,
            ],
            $userId,
            $projectId,
            $metadata
        );
    }

    public static function getEventType(): string
    {
        return 'email_campaign.created';
    }

    public function getCampaignId(): int
    {
        return $this->payload['campaign_id'];
    }

    public function getCampaignName(): string
    {
        return $this->payload['campaign_name'];
    }

    public function getCampaignType(): ?string
    {
        return $this->payload['campaign_type'];
    }
}