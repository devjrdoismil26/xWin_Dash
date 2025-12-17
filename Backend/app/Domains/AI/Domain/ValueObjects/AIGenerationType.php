<?php

namespace App\Domains\AI\Domain\ValueObjects;

use InvalidArgumentException;

class AIGenerationType
{
    public const TEXT = 'text';
    public const IMAGE = 'image';
    public const VIDEO = 'video';
    public const AUDIO = 'audio';
    public const CODE = 'code';
    public const EMBEDDING = 'embedding';

    private string $value;

    public function __construct(string $type)
    {
        $this->validate($type);
        $this->value = $type;
    }

    public static function text(): self
    {
        return new self(self::TEXT);
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

    public static function code(): self
    {
        return new self(self::CODE);
    }

    public static function embedding(): self
    {
        return new self(self::EMBEDDING);
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function isText(): bool
    {
        return $this->value === self::TEXT;
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

    public function isCode(): bool
    {
        return $this->value === self::CODE;
    }

    public function isEmbedding(): bool
    {
        return $this->value === self::EMBEDDING;
    }

    public function isVisual(): bool
    {
        return in_array($this->value, [self::IMAGE, self::VIDEO]);
    }

    public function isAudioVisual(): bool
    {
        return in_array($this->value, [self::VIDEO, self::AUDIO]);
    }

    public function isTextual(): bool
    {
        return in_array($this->value, [self::TEXT, self::CODE]);
    }

    public function getDisplayName(): string
    {
        return match ($this->value) {
            self::TEXT => 'Texto',
            self::IMAGE => 'Imagem',
            self::VIDEO => 'Vídeo',
            self::AUDIO => 'Áudio',
            self::CODE => 'Código',
            self::EMBEDDING => 'Embedding',
            default => 'Desconhecido'
        };
    }

    public function getIcon(): string
    {
        return match ($this->value) {
            self::TEXT => 'file-text',
            self::IMAGE => 'image',
            self::VIDEO => 'video',
            self::AUDIO => 'music',
            self::CODE => 'code',
            self::EMBEDDING => 'layers',
            default => 'file'
        };
    }

    public function getColor(): string
    {
        return match ($this->value) {
            self::TEXT => 'blue',
            self::IMAGE => 'green',
            self::VIDEO => 'purple',
            self::AUDIO => 'orange',
            self::CODE => 'gray',
            self::EMBEDDING => 'indigo',
            default => 'gray'
        };
    }

    public function getDescription(): string
    {
        return match ($this->value) {
            self::TEXT => 'Geração de texto usando IA',
            self::IMAGE => 'Geração de imagens usando IA',
            self::VIDEO => 'Geração de vídeos usando IA',
            self::AUDIO => 'Geração de áudio usando IA',
            self::CODE => 'Geração de código usando IA',
            self::EMBEDDING => 'Geração de embeddings usando IA',
            default => 'Tipo de geração desconhecido'
        };
    }

    public function getMimeType(): string
    {
        return match ($this->value) {
            self::TEXT => 'text/plain',
            self::IMAGE => 'image/png',
            self::VIDEO => 'video/mp4',
            self::AUDIO => 'audio/mpeg',
            self::CODE => 'text/plain',
            self::EMBEDDING => 'application/json',
            default => 'application/octet-stream'
        };
    }

    public function getFileExtension(): string
    {
        return match ($this->value) {
            self::TEXT => 'txt',
            self::IMAGE => 'png',
            self::VIDEO => 'mp4',
            self::AUDIO => 'mp3',
            self::CODE => 'txt',
            self::EMBEDDING => 'json',
            default => 'bin'
        };
    }

    public function getMaxSize(): int
    {
        return match ($this->value) {
            self::TEXT => 100000, // 100KB
            self::IMAGE => 10485760, // 10MB
            self::VIDEO => 104857600, // 100MB
            self::AUDIO => 25165824, // 25MB
            self::CODE => 100000, // 100KB
            self::EMBEDDING => 1000000, // 1MB
            default => 1024 // 1KB
        };
    }

    public function requiresSpecialHandling(): bool
    {
        return in_array($this->value, [self::IMAGE, self::VIDEO, self::AUDIO]);
    }

    public function supportsStreaming(): bool
    {
        return in_array($this->value, [self::TEXT, self::CODE]);
    }

    public function supportsBatchProcessing(): bool
    {
        return in_array($this->value, [self::TEXT, self::CODE, self::EMBEDDING]);
    }

    public function getProcessingTimeEstimate(): int
    {
        return match ($this->value) {
            self::TEXT => 5, // 5 seconds
            self::IMAGE => 30, // 30 seconds
            self::VIDEO => 300, // 5 minutes
            self::AUDIO => 60, // 1 minute
            self::CODE => 10, // 10 seconds
            self::EMBEDDING => 2, // 2 seconds
            default => 5
        };
    }

    public function getComplexityLevel(): string
    {
        return match ($this->value) {
            self::TEXT => 'low',
            self::CODE => 'low',
            self::EMBEDDING => 'low',
            self::IMAGE => 'medium',
            self::AUDIO => 'medium',
            self::VIDEO => 'high',
            default => 'unknown'
        };
    }

    public function equals(AIGenerationType $other): bool
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
            self::TEXT,
            self::IMAGE,
            self::VIDEO,
            self::AUDIO,
            self::CODE,
            self::EMBEDDING
        ];

        if (!in_array($type, $validTypes)) {
            throw new InvalidArgumentException("Invalid AI generation type: {$type}");
        }
    }
}
