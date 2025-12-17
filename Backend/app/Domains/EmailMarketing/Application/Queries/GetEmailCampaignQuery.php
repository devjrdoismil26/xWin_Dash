<?php

namespace App\Domains\EmailMarketing\Application\Queries;

class GetEmailCampaignQuery
{
    public function __construct(
        public readonly int $campaignId,
        public readonly int $userId,
        public readonly bool $includeEmailLists = false,
        public readonly bool $includeSubscribers = false,
        public readonly bool $includeAnalytics = false,
        public readonly bool $includeSettings = false
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            campaignId: $data['campaign_id'],
            userId: $data['user_id'],
            includeEmailLists: $data['include_email_lists'] ?? false,
            includeSubscribers: $data['include_subscribers'] ?? false,
            includeAnalytics: $data['include_analytics'] ?? false,
            includeSettings: $data['include_settings'] ?? false
        );
    }

    public function toArray(): array
    {
        return [
            'campaign_id' => $this->campaignId,
            'user_id' => $this->userId,
            'include_email_lists' => $this->includeEmailLists,
            'include_subscribers' => $this->includeSubscribers,
            'include_analytics' => $this->includeAnalytics,
            'include_settings' => $this->includeSettings
        ];
    }

    public function isValid(): bool
    {
        return $this->campaignId > 0 && $this->userId > 0;
    }

    public function getValidationErrors(): array
    {
        $errors = [];

        if ($this->campaignId <= 0) {
            $errors[] = 'ID da campanha é obrigatório';
        }

        if ($this->userId <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        return $errors;
    }
}
