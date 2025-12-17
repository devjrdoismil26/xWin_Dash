<?php

namespace App\Domains\SocialBuffer\Application\Commands;

class UpdatePostCommand
{
    public function __construct(
        public readonly int $postId,
        public readonly int $userId,
        public readonly ?string $content = null,
        public readonly ?array $socialAccountIds = null,
        public readonly ?string $type = null,
        public readonly ?array $mediaIds = null,
        public readonly ?string $scheduledAt = null,
        public readonly ?array $tags = null,
        public readonly ?array $metadata = null
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            postId: $data['post_id'],
            userId: $data['user_id'],
            content: $data['content'] ?? null,
            socialAccountIds: $data['social_account_ids'] ?? null,
            type: $data['type'] ?? null,
            mediaIds: $data['media_ids'] ?? null,
            scheduledAt: $data['scheduled_at'] ?? null,
            tags: $data['tags'] ?? null,
            metadata: $data['metadata'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'post_id' => $this->postId,
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
        return $this->postId > 0 && $this->userId > 0;
    }

    public function getValidationErrors(): array
    {
        $errors = [];

        if ($this->postId <= 0) {
            $errors[] = 'ID do post é obrigatório';
        }

        if ($this->userId <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        if ($this->content && strlen($this->content) > 280) {
            $errors[] = 'Conteúdo não pode ter mais de 280 caracteres';
        }

        if ($this->type && !in_array($this->type, ['text', 'image', 'video', 'link'])) {
            $errors[] = 'Tipo deve ser text, image, video ou link';
        }

        return $errors;
    }
}
