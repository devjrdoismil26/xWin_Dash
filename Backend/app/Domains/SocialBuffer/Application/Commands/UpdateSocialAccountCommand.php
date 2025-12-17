<?php

namespace App\Domains\SocialBuffer\Application\Commands;

class UpdateSocialAccountCommand
{
    public function __construct(
        public readonly int $accountId,
        public readonly int $userId,
        public readonly ?string $accountName = null,
        public readonly ?string $accessToken = null,
        public readonly ?string $refreshToken = null,
        public readonly ?array $settings = null,
        public readonly ?array $metadata = null
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            accountId: $data['account_id'],
            userId: $data['user_id'],
            accountName: $data['account_name'] ?? null,
            accessToken: $data['access_token'] ?? null,
            refreshToken: $data['refresh_token'] ?? null,
            settings: $data['settings'] ?? null,
            metadata: $data['metadata'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'account_id' => $this->accountId,
            'user_id' => $this->userId,
            'account_name' => $this->accountName,
            'access_token' => $this->accessToken,
            'refresh_token' => $this->refreshToken,
            'settings' => $this->settings,
            'metadata' => $this->metadata
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

        if ($this->accountName && strlen($this->accountName) > 255) {
            $errors[] = 'Nome da conta não pode ter mais de 255 caracteres';
        }

        return $errors;
    }
}
