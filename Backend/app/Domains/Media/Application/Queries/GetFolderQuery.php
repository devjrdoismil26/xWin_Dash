<?php

namespace App\Domains\Media\Application\Queries;

class GetFolderQuery
{
    public function __construct(
        public readonly int $folderId,
        public readonly int $userId,
        public readonly bool $includeMedia = false,
        public readonly bool $includeSubfolders = false,
        public readonly bool $includeAnalytics = false
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            folderId: $data['folder_id'],
            userId: $data['user_id'],
            includeMedia: $data['include_media'] ?? false,
            includeSubfolders: $data['include_subfolders'] ?? false,
            includeAnalytics: $data['include_analytics'] ?? false
        );
    }

    public function toArray(): array
    {
        return [
            'folder_id' => $this->folderId,
            'user_id' => $this->userId,
            'include_media' => $this->includeMedia,
            'include_subfolders' => $this->includeSubfolders,
            'include_analytics' => $this->includeAnalytics
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

        return $errors;
    }
}
