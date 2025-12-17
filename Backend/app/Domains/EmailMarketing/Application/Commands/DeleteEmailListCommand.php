<?php

namespace App\Domains\EmailMarketing\Application\Commands;

class DeleteEmailListCommand
{
    public function __construct(
        public readonly int $listId,
        public readonly int $userId,
        public readonly ?string $reason = null,
        public readonly bool $forceDelete = false
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            listId: $data['list_id'],
            userId: $data['user_id'],
            reason: $data['reason'] ?? null,
            forceDelete: $data['force_delete'] ?? false
        );
    }

    public function toArray(): array
    {
        return [
            'list_id' => $this->listId,
            'user_id' => $this->userId,
            'reason' => $this->reason,
            'force_delete' => $this->forceDelete
        ];
    }

    public function isValid(): bool
    {
        return $this->listId > 0 && $this->userId > 0;
    }

    public function getValidationErrors(): array
    {
        $errors = [];

        if ($this->listId <= 0) {
            $errors[] = 'ID da lista é obrigatório';
        }

        if ($this->userId <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        return $errors;
    }
}
