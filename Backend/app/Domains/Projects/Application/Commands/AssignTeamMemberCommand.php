<?php

namespace App\Domains\Projects\Application\Commands;

class AssignTeamMemberCommand
{
    public function __construct(
        public readonly int $projectId,
        public readonly int $userId,
        public readonly int $assignedBy,
        public readonly string $role,
        public readonly ?array $permissions = null,
        public readonly ?string $notes = null
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            projectId: $data['project_id'],
            userId: $data['user_id'],
            assignedBy: $data['assigned_by'],
            role: $data['role'],
            permissions: $data['permissions'] ?? null,
            notes: $data['notes'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'project_id' => $this->projectId,
            'user_id' => $this->userId,
            'assigned_by' => $this->assignedBy,
            'role' => $this->role,
            'permissions' => $this->permissions,
            'notes' => $this->notes
        ];
    }

    public function isValid(): bool
    {
        return $this->projectId > 0 && $this->userId > 0 && $this->assignedBy > 0 && !empty($this->role);
    }

    public function getValidationErrors(): array
    {
        $errors = [];

        if ($this->projectId <= 0) {
            $errors[] = 'ID do projeto é obrigatório';
        }

        if ($this->userId <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        if ($this->assignedBy <= 0) {
            $errors[] = 'ID do usuário que está atribuindo é obrigatório';
        }

        if (empty($this->role)) {
            $errors[] = 'Função é obrigatória';
        }

        if (strlen($this->role) > 100) {
            $errors[] = 'Função não pode ter mais de 100 caracteres';
        }

        if ($this->notes && strlen($this->notes) > 500) {
            $errors[] = 'Notas não podem ter mais de 500 caracteres';
        }

        return $errors;
    }
}
