<?php

namespace App\Domains\Media\Application\Commands;

class UpdateMediaCommand
{
    public function __construct(
        public readonly int $mediaId,
        public readonly int $userId,
        public readonly ?string $name = null,
        public readonly ?string $description = null,
        public readonly ?int $folderId = null,
        public readonly ?array $tags = null,
        public readonly ?array $metadata = null,
        public readonly ?string $altText = null
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            mediaId: $data['media_id'],
            userId: $data['user_id'],
            name: $data['name'] ?? null,
            description: $data['description'] ?? null,
            folderId: $data['folder_id'] ?? null,
            tags: $data['tags'] ?? null,
            metadata: $data['metadata'] ?? null,
            altText: $data['alt_text'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'media_id' => $this->mediaId,
            'user_id' => $this->userId,
            'name' => $this->name,
            'description' => $this->description,
            'folder_id' => $this->folderId,
            'tags' => $this->tags,
            'metadata' => $this->metadata,
            'alt_text' => $this->altText
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

        if ($this->name && strlen($this->name) > 255) {
            $errors[] = 'Nome não pode ter mais de 255 caracteres';
        }

        if ($this->description && strlen($this->description) > 1000) {
            $errors[] = 'Descrição não pode ter mais de 1000 caracteres';
        }

        if ($this->altText && strlen($this->altText) > 255) {
            $errors[] = 'Texto alternativo não pode ter mais de 255 caracteres';
        }

        return $errors;
    }
}
