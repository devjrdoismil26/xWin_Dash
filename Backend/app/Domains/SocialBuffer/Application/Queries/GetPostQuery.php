<?php

namespace App\Domains\SocialBuffer\Application\Queries;

class GetPostQuery
{
    public function __construct(
        public readonly int $postId,
        public readonly int $userId,
        public readonly bool $includeSocialAccounts = false,
        public readonly bool $includeMedia = false,
        public readonly bool $includeAnalytics = false
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            postId: $data['post_id'],
            userId: $data['user_id'],
            includeSocialAccounts: $data['include_social_accounts'] ?? false,
            includeMedia: $data['include_media'] ?? false,
            includeAnalytics: $data['include_analytics'] ?? false
        );
    }

    public function toArray(): array
    {
        return [
            'post_id' => $this->postId,
            'user_id' => $this->userId,
            'include_social_accounts' => $this->includeSocialAccounts,
            'include_media' => $this->includeMedia,
            'include_analytics' => $this->includeAnalytics
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

        return $errors;
    }
}
