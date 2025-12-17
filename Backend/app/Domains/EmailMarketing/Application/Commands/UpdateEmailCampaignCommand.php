<?php

namespace App\Domains\EmailMarketing\Application\Commands;

class UpdateEmailCampaignCommand
{
    public function __construct(
        public readonly int $campaignId,
        public readonly int $userId,
        public readonly ?string $name = null,
        public readonly ?string $subject = null,
        public readonly ?string $content = null,
        public readonly ?string $status = null,
        public readonly ?array $emailListIds = null,
        public readonly ?string $scheduledAt = null,
        public readonly ?array $settings = null,
        public readonly ?array $tags = null,
        public readonly ?array $metadata = null
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            campaignId: $data['campaign_id'],
            userId: $data['user_id'],
            name: $data['name'] ?? null,
            subject: $data['subject'] ?? null,
            content: $data['content'] ?? null,
            status: $data['status'] ?? null,
            emailListIds: $data['email_list_ids'] ?? null,
            scheduledAt: $data['scheduled_at'] ?? null,
            settings: $data['settings'] ?? null,
            tags: $data['tags'] ?? null,
            metadata: $data['metadata'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'campaign_id' => $this->campaignId,
            'user_id' => $this->userId,
            'name' => $this->name,
            'subject' => $this->subject,
            'content' => $this->content,
            'status' => $this->status,
            'email_list_ids' => $this->emailListIds,
            'scheduled_at' => $this->scheduledAt,
            'settings' => $this->settings,
            'tags' => $this->tags,
            'metadata' => $this->metadata
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

        if ($this->name && strlen($this->name) > 255) {
            $errors[] = 'Nome da campanha não pode ter mais de 255 caracteres';
        }

        if ($this->subject && strlen($this->subject) > 255) {
            $errors[] = 'Assunto não pode ter mais de 255 caracteres';
        }

        return $errors;
    }
}
