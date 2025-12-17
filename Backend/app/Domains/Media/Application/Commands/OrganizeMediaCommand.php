<?php

namespace App\Domains\Media\Application\Commands;

class OrganizeMediaCommand
{
    public function __construct(
        public readonly int $userId,
        public readonly array $mediaIds,
        public readonly string $operation,
        public readonly ?int $targetFolderId = null,
        public readonly ?array $tags = null,
        public readonly ?array $metadata = null
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            userId: $data['user_id'],
            mediaIds: $data['media_ids'],
            operation: $data['operation'],
            targetFolderId: $data['target_folder_id'] ?? null,
            tags: $data['tags'] ?? null,
            metadata: $data['metadata'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'user_id' => $this->userId,
            'media_ids' => $this->mediaIds,
            'operation' => $this->operation,
            'target_folder_id' => $this->targetFolderId,
            'tags' => $this->tags,
            'metadata' => $this->metadata
        ];
    }

    public function isValid(): bool
    {
        return $this->userId > 0 && !empty($this->mediaIds) && !empty($this->operation);
    }

    public function getValidationErrors(): array
    {
        $errors = [];

        if ($this->userId <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        if (empty($this->mediaIds)) {
            $errors[] = 'IDs da mídia são obrigatórios';
        }

        if (empty($this->operation)) {
            $errors[] = 'Operação é obrigatória';
        }

        if (!in_array($this->operation, ['move', 'copy', 'remove_from_folder'])) {
            $errors[] = 'Operação deve ser move, copy ou remove_from_folder';
        }

        if (in_array($this->operation, ['move', 'copy']) && $this->targetFolderId === null) {
            $errors[] = 'Pasta de destino é obrigatória para operações move e copy';
        }

        return $errors;
    }
}
