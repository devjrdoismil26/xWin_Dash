<?php

namespace App\Domains\SocialBuffer\Application\Queries;

class GetSocialAccountQuery
{
    public function __construct(
        public readonly int $accountId,
        public readonly int $userId,
        public readonly bool $includePosts = false,
        public readonly bool $includeAnalytics = false,
        public readonly bool $includeSettings = false
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            accountId: $data['account_id'],
            userId: $data['user_id'],
            includePosts: $data['include_posts'] ?? false,
            includeAnalytics: $data['include_analytics'] ?? false,
            includeSettings: $data['include_settings'] ?? false
        );
    }

    public function toArray(): array
    {
        return [
            'account_id' => $this->accountId,
            'user_id' => $this->userId,
            'include_posts' => $this->includePosts,
            'include_analytics' => $this->includeAnalytics,
            'include_settings' => $this->includeSettings
        ];
    }

    public function isValid(): bool
    {
        return $this->accountId > 0 && $this->userId > 0;
    }

    public function getValidationErrors(): array
    {
        $errors = [];

        if ($this->accountId <= 0) {
            $errors[] = 'ID da conta é obrigatório';
        }

        if ($this->userId <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        return $errors;
    }
}
