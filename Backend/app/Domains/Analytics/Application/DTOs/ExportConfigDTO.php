<?php

namespace App\Domains\Analytics\Application\DTOs;

class ExportConfigDTO
{
    public function __construct(
        public readonly string $format,
        public readonly array $data,
        public readonly ?string $filename = null,
        public readonly ?array $options = null
    ) {
    }

    public function toArray(): array
    {
        return array_filter([
            'format' => $this->format,
            'data' => $this->data,
            'filename' => $this->filename,
            'options' => $this->options,
        ], fn ($value) => $value !== null);
    }

    public static function fromArray(array $data): self
    {
        return new self(
            format: $data['format'],
            data: $data['data'],
            filename: $data['filename'] ?? null,
            options: $data['options'] ?? null
        );
    }
}
