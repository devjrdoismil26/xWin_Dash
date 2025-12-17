<?php

namespace App\Domains\Universe\Application\Commands;

class CreateUniverseInstanceCommand
{
    public function __construct(
        public readonly int $userId,
        public readonly string $name,
        public readonly ?string $description = null,
        public readonly ?string $templateId = null,
        public readonly ?string $parentInstanceId = null,
        public readonly ?array $configuration = null,
        public readonly ?array $blocks = null,
        public readonly ?array $connections = null,
        public readonly ?string $status = 'draft',
        public readonly ?bool $isActive = true,
        public readonly ?array $tags = null,
        public readonly ?array $metadata = null
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            userId: $data['user_id'],
            name: $data['name'],
            description: $data['description'] ?? null,
            templateId: $data['template_id'] ?? null,
            parentInstanceId: $data['parent_instance_id'] ?? null,
            configuration: $data['configuration'] ?? null,
            blocks: $data['blocks'] ?? null,
            connections: $data['connections'] ?? null,
            status: $data['status'] ?? 'draft',
            isActive: $data['is_active'] ?? true,
            tags: $data['tags'] ?? null,
            metadata: $data['metadata'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'user_id' => $this->userId,
            'name' => $this->name,
            'description' => $this->description,
            'template_id' => $this->templateId,
            'parent_instance_id' => $this->parentInstanceId,
            'configuration' => $this->configuration,
            'blocks' => $this->blocks,
            'connections' => $this->connections,
            'status' => $this->status,
            'is_active' => $this->isActive,
            'tags' => $this->tags,
            'metadata' => $this->metadata
        ];
    }

    public function isValid(): bool
    {
        return !empty($this->name) && $this->userId > 0;
    }

    public function getValidationErrors(): array
    {
        $errors = [];

        if (empty($this->name)) {
            $errors[] = 'Nome da instância é obrigatório';
        }

        if ($this->userId <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        if (strlen($this->name) > 255) {
            $errors[] = 'Nome da instância não pode ter mais de 255 caracteres';
        }

        if ($this->description && strlen($this->description) > 1000) {
            $errors[] = 'Descrição não pode ter mais de 1000 caracteres';
        }

        return $errors;
    }
}
