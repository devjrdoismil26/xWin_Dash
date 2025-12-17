<?php

namespace App\Domains\Universe\Application\Commands;

class DeleteUniverseTemplateCommand
{
    public function __construct(
        public readonly int $templateId,
        public readonly int $userId,
        public readonly ?string $reason = null,
        public readonly bool $forceDelete = false
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            templateId: $data['template_id'],
            userId: $data['user_id'],
            reason: $data['reason'] ?? null,
            forceDelete: $data['force_delete'] ?? false
        );
    }

    public function toArray(): array
    {
        return [
            'template_id' => $this->templateId,
            'user_id' => $this->userId,
            'reason' => $this->reason,
            'force_delete' => $this->forceDelete
        ];
    }

    public function isValid(): bool
    {
        return $this->templateId > 0 && $this->userId > 0;
    }

    public function getValidationErrors(): array
    {
        $errors = [];

        if ($this->templateId <= 0) {
            $errors[] = 'ID do template é obrigatório';
        }

        if ($this->userId <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        return $errors;
    }
}
