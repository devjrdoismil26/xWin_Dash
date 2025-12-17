<?php

namespace App\Domains\Universe\Application\Commands;

class CreateUniverseTemplateCommand
{
    public function __construct(
        public readonly int $userId,
        public readonly string $name,
        public readonly ?string $description = null,
        public readonly ?string $parentTemplateId = null,
        public readonly ?array $templateData = null,
        public readonly ?string $category = null,
        public readonly ?string $status = 'draft',
        public readonly ?bool $isPublic = false,
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
            parentTemplateId: $data['parent_template_id'] ?? null,
            templateData: $data['template_data'] ?? null,
            category: $data['category'] ?? null,
            status: $data['status'] ?? 'draft',
            isPublic: $data['is_public'] ?? false,
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
            'parent_template_id' => $this->parentTemplateId,
            'template_data' => $this->templateData,
            'category' => $this->category,
            'status' => $this->status,
            'is_public' => $this->isPublic,
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
            $errors[] = 'Nome do template é obrigatório';
        }

        if ($this->userId <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        if (strlen($this->name) > 255) {
            $errors[] = 'Nome do template não pode ter mais de 255 caracteres';
        }

        if ($this->description && strlen($this->description) > 1000) {
            $errors[] = 'Descrição não pode ter mais de 1000 caracteres';
        }

        if ($this->category && strlen($this->category) > 100) {
            $errors[] = 'Categoria não pode ter mais de 100 caracteres';
        }

        return $errors;
    }
}
