<?php

namespace App\Domains\SocialBuffer\Application\Commands;

class CreateSocialAccountCommand
{
    public function __construct(
        public readonly int $userId,
        public readonly string $platform,
        public readonly string $accountName,
        public readonly string $accessToken,
        public readonly ?string $refreshToken = null,
        public readonly ?string $accountId = null,
        public readonly ?array $settings = null,
        public readonly ?array $metadata = null
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            userId: $data['user_id'],
            platform: $data['platform'],
            accountName: $data['account_name'],
            accessToken: $data['access_token'],
            refreshToken: $data['refresh_token'] ?? null,
            accountId: $data['account_id'] ?? null,
            settings: $data['settings'] ?? null,
            metadata: $data['metadata'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'user_id' => $this->userId,
            'platform' => $this->platform,
            'account_name' => $this->accountName,
            'access_token' => $this->accessToken,
            'refresh_token' => $this->refreshToken,
            'account_id' => $this->accountId,
            'settings' => $this->settings,
            'metadata' => $this->metadata
        ];
    }

    public function isValid(): bool
    {
        return $this->userId > 0 && !empty($this->platform) && !empty($this->accountName) && !empty($this->accessToken);
    }

    public function getValidationErrors(): array
    {
        $errors = [];

        if ($this->userId <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        if (empty($this->platform)) {
            $errors[] = 'Plataforma é obrigatória';
        }

        if (empty($this->accountName)) {
            $errors[] = 'Nome da conta é obrigatório';
        }

        if (empty($this->accessToken)) {
            $errors[] = 'Token de acesso é obrigatório';
        }

        if (!in_array($this->platform, ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok'])) {
            $errors[] = 'Plataforma deve ser facebook, twitter, instagram, linkedin, youtube ou tiktok';
        }

        if (strlen($this->accountName) > 255) {
            $errors[] = 'Nome da conta não pode ter mais de 255 caracteres';
        }

        return $errors;
    }
}
