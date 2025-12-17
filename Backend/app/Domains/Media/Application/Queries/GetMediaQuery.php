<?php

namespace App\Domains\Media\Application\Queries;

class GetMediaQuery
{
    public function __construct(
        public readonly int $mediaId,
        public readonly int $userId,
        public readonly bool $includeFolder = false,
        public readonly bool $includeAnalytics = false,
        public readonly bool $includeMetadata = false
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            mediaId: $data['media_id'],
            userId: $data['user_id'],
            includeFolder: $data['include_folder'] ?? false,
            includeAnalytics: $data['include_analytics'] ?? false,
            includeMetadata: $data['include_metadata'] ?? false
        );
    }

    public function toArray(): array
    {
        return [
            'media_id' => $this->mediaId,
            'user_id' => $this->userId,
            'include_folder' => $this->includeFolder,
            'include_analytics' => $this->includeAnalytics,
            'include_metadata' => $this->includeMetadata
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
