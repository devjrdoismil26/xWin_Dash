<?php

namespace App\Shared\ValueObjects;

class MediaType
{
    public const IMAGE = 'image';
    public const VIDEO = 'video';
    public const AUDIO = 'audio';
    public const DOCUMENT = 'document';
    public const ARCHIVE = 'archive';
    public const OTHER = 'other';

    private string $value;

    public function __construct(string $value)
    {
        $this->validate($value);
        $this->value = $value;
    }

    private function validate(string $value): void
    {
        $validTypes = [
            self::IMAGE,
            self::VIDEO,
            self::AUDIO,
            self::DOCUMENT,
            self::ARCHIVE,
            self::OTHER,
        ];

        if (!in_array($value, $validTypes)) {
            throw new \InvalidArgumentException(
                sprintf(
                    'Invalid media type: %s. Valid types are: %s',
                    $value,
                    implode(', ', $validTypes),
                ),
            );
        }
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function getLabel(): string
    {
        $labels = [
            self::IMAGE => 'Imagem',
            self::VIDEO => 'Vídeo',
            self::AUDIO => 'Áudio',
            self::DOCUMENT => 'Documento',
            self::ARCHIVE => 'Arquivo',
            self::OTHER => 'Outro',
        ];

        return $labels[$this->value] ?? $this->value;
    }

    public function isImage(): bool
    {
        return $this->value === self::IMAGE;
    }

    public function isVideo(): bool
    {
        return $this->value === self::VIDEO;
    }

    public function isAudio(): bool
    {
        return $this->value === self::AUDIO;
    }

    public function isDocument(): bool
    {
        return $this->value === self::DOCUMENT;
    }

    public function isArchive(): bool
    {
        return $this->value === self::ARCHIVE;
    }

    public function isOther(): bool
    {
        return $this->value === self::OTHER;
    }

    public function equals(MediaType $other): bool
    {
        return $this->value === $other->getValue();
    }

    public static function fromMimeType(string $mimeType): self
    {
        if (str_starts_with($mimeType, 'image/')) {
            return new self(self::IMAGE);
        }

        if (str_starts_with($mimeType, 'video/')) {
            return new self(self::VIDEO);
        }

        if (str_starts_with($mimeType, 'audio/')) {
            return new self(self::AUDIO);
        }

        $documentMimes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'text/plain',
            'text/csv',
        ];

        if (in_array($mimeType, $documentMimes)) {
            return new self(self::DOCUMENT);
        }

        $archiveMimes = [
            'application/zip',
            'application/x-rar-compressed',
            'application/x-tar',
            'application/gzip',
            'application/x-7z-compressed',
        ];

        if (in_array($mimeType, $archiveMimes)) {
            return new self(self::ARCHIVE);
        }

        return new self(self::OTHER);
    }

    public function __toString(): string
    {
        return $this->value;
    }
}
