<?php

namespace App\Domains\Media\Application\Commands;

class DeleteMediaCommand
{
    public function __construct(
        public readonly int $mediaId,
        public readonly int $userId,
        public readonly ?string $reason = null,
        public readonly bool $forceDelete = false
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            mediaId: $data['media_id'],
            userId: $data['user_id'],
            reason: $data['reason'] ?? null,
            forceDelete: $data['force_delete'] ?? false
        );
    }

    public function toArray(): array
    {
        return [
            'media_id' => $this->mediaId,
            'user_id' => $this->userId,
            'reason' => $this->reason,
            'force_delete' => $this->forceDelete
        ];
    }

    public function isValid(): bool
    {
        return $this->mediaId > 0 && $this->userId > 0;
    }

    public function getValidationErrors(): array
    {
        $errors = [];

        if ($this->mediaId <= 0) {
            $errors[] = 'ID da mídia é obrigatório';
        }

        if ($this->userId <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        return $errors;
    }
}
