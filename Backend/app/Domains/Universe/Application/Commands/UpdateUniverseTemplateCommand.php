<?php

namespace App\Domains\Universe\Application\Commands;

class UpdateUniverseTemplateCommand
{
    public function __construct(
        public readonly int $templateId,
        public readonly int $userId,
        public readonly ?string $name = null,
        public readonly ?string $description = null,
        public readonly ?array $templateData = null,
        public readonly ?string $category = null,
        public readonly ?string $status = null,
        public readonly ?bool $isPublic = null,
        public readonly ?array $tags = null,
        public readonly ?array $metadata = null
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            templateId: $data['template_id'],
            userId: $data['user_id'],
            name: $data['name'] ?? null,
            description: $data['description'] ?? null,
            templateData: $data['template_data'] ?? null,
            category: $data['category'] ?? null,
            status: $data['status'] ?? null,
            isPublic: $data['is_public'] ?? null,
            tags: $data['tags'] ?? null,
            metadata: $data['metadata'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'template_id' => $this->templateId,
            'user_id' => $this->userId,
            'name' => $this->name,
            'description' => $this->description,
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

        if ($this->name && strlen($this->name) > 255) {
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
