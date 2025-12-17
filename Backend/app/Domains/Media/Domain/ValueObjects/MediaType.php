<?php

namespace App\Domains\Media\Domain\ValueObjects;

use InvalidArgumentException;

class MediaType
{
    public const IMAGE = 'image';
    public const VIDEO = 'video';
    public const AUDIO = 'audio';
    public const DOCUMENT = 'document';
    public const ARCHIVE = 'archive';
    public const OTHER = 'other';

    private string $value;

    public function __construct(string $type)
    {
        $this->validate($type);
        $this->value = $type;
    }

    public static function image(): self
    {
        return new self(self::IMAGE);
    }

    public static function video(): self
    {
        return new self(self::VIDEO);
    }

    public static function audio(): self
    {
        return new self(self::AUDIO);
    }

    public static function document(): self
    {
        return new self(self::DOCUMENT);
    }

    public static function archive(): self
    {
        return new self(self::ARCHIVE);
    }

    public static function other(): self
    {
        return new self(self::OTHER);
    }

    public function getValue(): string
    {
        return $this->value;
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

    public function isVisual(): bool
    {
        return in_array($this->value, [self::IMAGE, self::VIDEO]);
    }

    public function isAudioVisual(): bool
    {
        return in_array($this->value, [self::VIDEO, self::AUDIO]);
    }

    public function supportsThumbnail(): bool
    {
        return in_array($this->value, [self::IMAGE, self::VIDEO]);
    }

    public function supportsDimensions(): bool
    {
        return in_array($this->value, [self::IMAGE, self::VIDEO]);
    }

    public function supportsDuration(): bool
    {
        return in_array($this->value, [self::VIDEO, self::AUDIO]);
    }

    public function getMaxFileSize(): int
    {
        return match ($this->value) {
            self::IMAGE => 50 * 1024 * 1024, // 50MB
            self::VIDEO => 500 * 1024 * 1024, // 500MB
            self::AUDIO => 100 * 1024 * 1024, // 100MB
            self::DOCUMENT => 25 * 1024 * 1024, // 25MB
            self::ARCHIVE => 200 * 1024 * 1024, // 200MB
            self::OTHER => 10 * 1024 * 1024, // 10MB
            default => 10 * 1024 * 1024
        };
    }

    public function getAllowedMimeTypes(): array
    {
        return match ($this->value) {
            self::IMAGE => [
                'image/jpeg',
                'image/png',
                'image/gif',
                'image/webp',
                'image/svg+xml',
                'image/bmp',
                'image/tiff'
            ],
            self::VIDEO => [
                'video/mp4',
                'video/avi',
                'video/mov',
                'video/wmv',
                'video/flv',
                'video/webm',
                'video/mkv'
            ],
            self::AUDIO => [
                'audio/mp3',
                'audio/wav',
                'audio/ogg',
                'audio/aac',
                'audio/flac',
                'audio/m4a'
            ],
            self::DOCUMENT => [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'text/plain',
                'text/csv'
            ],
            self::ARCHIVE => [
                'application/zip',
                'application/x-rar-compressed',
                'application/x-7z-compressed',
                'application/gzip',
                'application/x-tar'
            ],
            self::OTHER => [],
            default => []
        };
    }

    public function getDisplayName(): string
    {
        return match ($this->value) {
            self::IMAGE => 'Imagem',
            self::VIDEO => 'Vídeo',
            self::AUDIO => 'Áudio',
            self::DOCUMENT => 'Documento',
            self::ARCHIVE => 'Arquivo',
            self::OTHER => 'Outro',
            default => 'Desconhecido'
        };
    }

    public function getIcon(): string
    {
        return match ($this->value) {
            self::IMAGE => 'image',
            self::VIDEO => 'video',
            self::AUDIO => 'music',
            self::DOCUMENT => 'file-text',
            self::ARCHIVE => 'archive',
            self::OTHER => 'file',
            default => 'file'
        };
    }

    public function getColor(): string
    {
        return match ($this->value) {
            self::IMAGE => 'green',
            self::VIDEO => 'purple',
            self::AUDIO => 'blue',
            self::DOCUMENT => 'orange',
            self::ARCHIVE => 'gray',
            self::OTHER => 'gray',
            default => 'gray'
        };
    }

    public function equals(MediaType $other): bool
    {
        return $this->value === $other->value;
    }

    public function __toString(): string
    {
        return $this->value;
    }

    private function validate(string $type): void
    {
        $validTypes = [
            self::IMAGE,
            self::VIDEO,
            self::AUDIO,
            self::DOCUMENT,
            self::ARCHIVE,
            self::OTHER
        ];

        if (!in_array($type, $validTypes)) {
            throw new InvalidArgumentException("Invalid media type: {$type}");
        }
    }
}
