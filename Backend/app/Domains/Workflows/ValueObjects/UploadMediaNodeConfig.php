<?php

namespace App\Domains\Workflows\ValueObjects;

class UploadMediaNodeConfig
{
    public function __construct(
        public readonly string $source,
        public readonly string $folder,
        public readonly bool $optimize = true,
        public readonly ?array $transformations = null
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['source'],
            $data['folder'],
            $data['optimize'] ?? true,
            $data['transformations'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'source' => $this->source,
            'folder' => $this->folder,
            'optimize' => $this->optimize,
            'transformations' => $this->transformations,
        ];
    }
}
