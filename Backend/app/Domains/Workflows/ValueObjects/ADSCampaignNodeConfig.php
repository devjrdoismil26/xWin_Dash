<?php

namespace App\Domains\Workflows\ValueObjects;

class ADSCampaignNodeConfig
{
    public function __construct(
        public readonly string $platform,
        public readonly string $campaignName,
        public readonly float $budget,
        public readonly string $objective,
        public readonly array $targeting = [],
        public readonly ?string $creativeId = null
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['platform'],
            $data['campaign_name'],
            $data['budget'],
            $data['objective'],
            $data['targeting'] ?? [],
            $data['creative_id'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'platform' => $this->platform,
            'campaign_name' => $this->campaignName,
            'budget' => $this->budget,
            'objective' => $this->objective,
            'targeting' => $this->targeting,
            'creative_id' => $this->creativeId,
        ];
    }
}
