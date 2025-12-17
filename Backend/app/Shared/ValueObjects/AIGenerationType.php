<?php

namespace App\Shared\ValueObjects;

class AIGenerationType
{
    public const TEXT = 'text';
    public const IMAGE = 'image';
    public const AUDIO = 'audio';
    public const VIDEO = 'video';
    public const CODE = 'code';
    public const TRANSLATION = 'translation';
    public const SUMMARY = 'summary';
    public const ANALYSIS = 'analysis';

    private string $value;

    public function __construct(string $value)
    {
        $this->validate($value);
        $this->value = $value;
    }

    private function validate(string $value): void
    {
        $validTypes = [
            self::TEXT,
            self::IMAGE,
            self::AUDIO,
            self::VIDEO,
            self::CODE,
            self::TRANSLATION,
            self::SUMMARY,
            self::ANALYSIS,
        ];

        if (!in_array($value, $validTypes)) {
            throw new \InvalidArgumentException(
                sprintf(
                    'Invalid AI generation type: %s. Valid types are: %s',
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
            self::TEXT => 'Texto',
            self::IMAGE => 'Imagem',
            self::AUDIO => 'Áudio',
            self::VIDEO => 'Vídeo',
            self::CODE => 'Código',
            self::TRANSLATION => 'Tradução',
            self::SUMMARY => 'Resumo',
            self::ANALYSIS => 'Análise',
        ];

        return $labels[$this->value] ?? $this->value;
    }

    public function isText(): bool
    {
        return $this->value === self::TEXT;
    }

    public function isImage(): bool
    {
        return $this->value === self::IMAGE;
    }

    public function isAudio(): bool
    {
        return $this->value === self::AUDIO;
    }

    public function isVideo(): bool
    {
        return $this->value === self::VIDEO;
    }

    public function isCode(): bool
    {
        return $this->value === self::CODE;
    }

    public function isTranslation(): bool
    {
        return $this->value === self::TRANSLATION;
    }

    public function isSummary(): bool
    {
        return $this->value === self::SUMMARY;
    }

    public function isAnalysis(): bool
    {
        return $this->value === self::ANALYSIS;
    }

    public function equals(AIGenerationType $other): bool
    {
        return $this->value === $other->getValue();
    }

    public function __toString(): string
    {
        return $this->value;
    }
}
