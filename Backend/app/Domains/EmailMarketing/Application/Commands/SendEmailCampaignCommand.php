<?php

namespace App\Domains\EmailMarketing\Application\Commands;

class SendEmailCampaignCommand
{
    public function __construct(
        public readonly int $campaignId,
        public readonly int $userId,
        public readonly array $emailListIds,
        public readonly ?string $scheduledAt = null,
        public readonly ?array $settings = null,
        public readonly ?string $sendMode = 'immediate'
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            campaignId: $data['campaign_id'],
            userId: $data['user_id'],
            emailListIds: $data['email_list_ids'],
            scheduledAt: $data['scheduled_at'] ?? null,
            settings: $data['settings'] ?? null,
            sendMode: $data['send_mode'] ?? 'immediate'
        );
    }

    public function toArray(): array
    {
        return [
            'campaign_id' => $this->campaignId,
            'user_id' => $this->userId,
            'email_list_ids' => $this->emailListIds,
            'scheduled_at' => $this->scheduledAt,
            'settings' => $this->settings,
            'send_mode' => $this->sendMode
        ];
    }

    public function isValid(): bool
    {
        return $this->campaignId > 0 && $this->userId > 0 && !empty($this->emailListIds);
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

        if (empty($this->emailListIds)) {
            $errors[] = 'Listas de email são obrigatórias';
        }

        if (!in_array($this->sendMode, ['immediate', 'scheduled'])) {
            $errors[] = 'Modo de envio deve ser immediate ou scheduled';
        }

        return $errors;
    }
}
