<?php

namespace App\Domains\Universe\Application\Commands;

class ShareUniverseInstanceCommand
{
    public function __construct(
        public readonly int $instanceId,
        public readonly int $userId,
        public readonly array $shareWith,
        public readonly string $permission,
        public readonly ?string $message = null,
        public readonly ?bool $notifyUsers = true
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            instanceId: $data['instance_id'],
            userId: $data['user_id'],
            shareWith: $data['share_with'],
            permission: $data['permission'],
            message: $data['message'] ?? null,
            notifyUsers: $data['notify_users'] ?? true
        );
    }

    public function toArray(): array
    {
        return [
            'instance_id' => $this->instanceId,
            'user_id' => $this->userId,
            'share_with' => $this->shareWith,
            'permission' => $this->permission,
            'message' => $this->message,
            'notify_users' => $this->notifyUsers
        ];
    }

    public function isValid(): bool
    {
        return $this->instanceId > 0 && $this->userId > 0 && !empty($this->shareWith) && !empty($this->permission);
    }

    public function getValidationErrors(): array
    {
        $errors = [];

        if ($this->instanceId <= 0) {
            $errors[] = 'ID da instância é obrigatório';
        }

        if ($this->userId <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        if (empty($this->shareWith)) {
            $errors[] = 'Usuários para compartilhar são obrigatórios';
        }

        if (empty($this->permission)) {
            $errors[] = 'Permissão é obrigatória';
        }

        if (!in_array($this->permission, ['read', 'write', 'admin'])) {
            $errors[] = 'Permissão deve ser read, write ou admin';
        }

        return $errors;
    }
}
