<?php

namespace App\Domains\SocialBuffer\Application\Commands;

class CreatePostCommand
{
    public function __construct(
        public readonly int $userId,
        public readonly string $content,
        public readonly array $socialAccountIds,
        public readonly ?string $type = 'text',
        public readonly ?array $mediaIds = null,
        public readonly ?string $scheduledAt = null,
        public readonly ?array $tags = null,
        public readonly ?array $metadata = null
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            userId: $data['user_id'],
            content: $data['content'],
            socialAccountIds: $data['social_account_ids'],
            type: $data['type'] ?? 'text',
            mediaIds: $data['media_ids'] ?? null,
            scheduledAt: $data['scheduled_at'] ?? null,
            tags: $data['tags'] ?? null,
            metadata: $data['metadata'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'user_id' => $this->userId,
            'content' => $this->content,
            'social_account_ids' => $this->socialAccountIds,
            'type' => $this->type,
            'media_ids' => $this->mediaIds,
            'scheduled_at' => $this->scheduledAt,
            'tags' => $this->tags,
            'metadata' => $this->metadata
        ];
    }

    public function isValid(): bool
    {
        return !empty($this->content) && $this->userId > 0 && !empty($this->socialAccountIds);
    }

    public function getValidationErrors(): array
    {
        $errors = [];

        if (empty($this->content)) {
            $errors[] = 'Conteúdo do post é obrigatório';
        }

        if ($this->userId <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        if (empty($this->socialAccountIds)) {
            $errors[] = 'Contas sociais são obrigatórias';
        }

        if (strlen($this->content) > 280) {
            $errors[] = 'Conteúdo não pode ter mais de 280 caracteres';
        }

        if (!in_array($this->type, ['text', 'image', 'video', 'link'])) {
            $errors[] = 'Tipo deve ser text, image, video ou link';
        }

        return $errors;
    }
}
