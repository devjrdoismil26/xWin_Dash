<?php

namespace App\Domains\SocialBuffer\Application\Commands;

class DeleteSocialAccountCommand
{
    public function __construct(
        public readonly int $accountId,
        public readonly int $userId,
        public readonly ?string $reason = null,
        public readonly bool $forceDelete = false
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            accountId: $data['account_id'],
            userId: $data['user_id'],
            reason: $data['reason'] ?? null,
            forceDelete: $data['force_delete'] ?? false
        );
    }

    public function toArray(): array
    {
        return [
            'account_id' => $this->accountId,
            'user_id' => $this->userId,
            'reason' => $this->reason,
            'force_delete' => $this->forceDelete
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
