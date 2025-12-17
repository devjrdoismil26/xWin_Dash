<?php

namespace App\Domains\SocialBuffer\Application\Commands;

class PublishPostCommand
{
    public function __construct(
        public readonly int $postId,
        public readonly int $userId,
        public readonly ?string $publishMode = 'immediate',
        public readonly ?array $settings = null
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            postId: $data['post_id'],
            userId: $data['user_id'],
            publishMode: $data['publish_mode'] ?? 'immediate',
            settings: $data['settings'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'post_id' => $this->postId,
            'user_id' => $this->userId,
            'publish_mode' => $this->publishMode,
            'settings' => $this->settings
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

        if (!in_array($this->publishMode, ['immediate', 'scheduled'])) {
            $errors[] = 'Modo de publicação deve ser immediate ou scheduled';
        }

        return $errors;
    }
}
