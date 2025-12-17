<?php

namespace App\Domains\Media\Application\Commands;

class UpdateFolderCommand
{
    public function __construct(
        public readonly int $folderId,
        public readonly int $userId,
        public readonly ?string $name = null,
        public readonly ?string $description = null,
        public readonly ?int $parentFolderId = null,
        public readonly ?array $tags = null,
        public readonly ?array $metadata = null
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            folderId: $data['folder_id'],
            userId: $data['user_id'],
            name: $data['name'] ?? null,
            description: $data['description'] ?? null,
            parentFolderId: $data['parent_folder_id'] ?? null,
            tags: $data['tags'] ?? null,
            metadata: $data['metadata'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'folder_id' => $this->folderId,
            'user_id' => $this->userId,
            'name' => $this->name,
            'description' => $this->description,
            'parent_folder_id' => $this->parentFolderId,
            'tags' => $this->tags,
            'metadata' => $this->metadata
        ];
    }

    public function isValid(): bool
    {
        return $this->folderId > 0 && $this->userId > 0;
    }

    public function getValidationErrors(): array
    {
        $errors = [];

        if ($this->folderId <= 0) {
            $errors[] = 'ID da pasta é obrigatório';
        }

        if ($this->userId <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        if ($this->name && strlen($this->name) > 255) {
            $errors[] = 'Nome da pasta não pode ter mais de 255 caracteres';
        }

        if ($this->description && strlen($this->description) > 1000) {
            $errors[] = 'Descrição não pode ter mais de 1000 caracteres';
        }

        return $errors;
    }
}
