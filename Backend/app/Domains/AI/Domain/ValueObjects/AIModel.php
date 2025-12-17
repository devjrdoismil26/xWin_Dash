<?php

namespace App\Domains\AI\Domain\ValueObjects;

use InvalidArgumentException;

class AIModel
{
    public const GPT_4 = 'gpt-4';
    public const GPT_3_5_TURBO = 'gpt-3.5-turbo';
    public const GPT_4_TURBO = 'gpt-4-turbo';
    public const CLAUDE_3_OPUS = 'claude-3-opus';
    public const CLAUDE_3_SONNET = 'claude-3-sonnet';
    public const CLAUDE_3_HAIKU = 'claude-3-haiku';
    public const GEMINI_PRO = 'gemini-pro';
    public const GEMINI_PRO_VISION = 'gemini-pro-vision';
    public const LLAMA_2 = 'llama-2';
    public const LLAMA_3 = 'llama-3';

    private string $value;

    public function __construct(string $model)
    {
        $this->validate($model);
        $this->value = $model;
    }

    public static function gpt4(): self
    {
        return new self(self::GPT_4);
    }

    public static function gpt35Turbo(): self
    {
        return new self(self::GPT_3_5_TURBO);
    }

    public static function gpt4Turbo(): self
    {
        return new self(self::GPT_4_TURBO);
    }

    public static function claude3Opus(): self
    {
        return new self(self::CLAUDE_3_OPUS);
    }

    public static function claude3Sonnet(): self
    {
        return new self(self::CLAUDE_3_SONNET);
    }

    public static function claude3Haiku(): self
    {
        return new self(self::CLAUDE_3_HAIKU);
    }

    public static function geminiPro(): self
    {
        return new self(self::GEMINI_PRO);
    }

    public static function geminiProVision(): self
    {
        return new self(self::GEMINI_PRO_VISION);
    }

    public static function llama2(): self
    {
        return new self(self::LLAMA_2);
    }

    public static function llama3(): self
    {
        return new self(self::LLAMA_3);
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function isGPT4(): bool
    {
        return $this->value === self::GPT_4;
    }

    public function isGPT35Turbo(): bool
    {
        return $this->value === self::GPT_3_5_TURBO;
    }

    public function isGPT4Turbo(): bool
    {
        return $this->value === self::GPT_4_TURBO;
    }

    public function isClaude3Opus(): bool
    {
        return $this->value === self::CLAUDE_3_OPUS;
    }

    public function isClaude3Sonnet(): bool
    {
        return $this->value === self::CLAUDE_3_SONNET;
    }

    public function isClaude3Haiku(): bool
    {
        return $this->value === self::CLAUDE_3_HAIKU;
    }

    public function isGeminiPro(): bool
    {
        return $this->value === self::GEMINI_PRO;
    }

    public function isGeminiProVision(): bool
    {
        return $this->value === self::GEMINI_PRO_VISION;
    }

    public function isLlama2(): bool
    {
        return $this->value === self::LLAMA_2;
    }

    public function isLlama3(): bool
    {
        return $this->value === self::LLAMA_3;
    }

    public function getProvider(): string
    {
        return match ($this->value) {
            self::GPT_4, self::GPT_3_5_TURBO, self::GPT_4_TURBO => 'openai',
            self::CLAUDE_3_OPUS, self::CLAUDE_3_SONNET, self::CLAUDE_3_HAIKU => 'anthropic',
            self::GEMINI_PRO, self::GEMINI_PRO_VISION => 'google',
            self::LLAMA_2, self::LLAMA_3 => 'meta',
            default => 'unknown'
        };
    }

    public function getDisplayName(): string
    {
        return match ($this->value) {
            self::GPT_4 => 'GPT-4',
            self::GPT_3_5_TURBO => 'GPT-3.5 Turbo',
            self::GPT_4_TURBO => 'GPT-4 Turbo',
            self::CLAUDE_3_OPUS => 'Claude 3 Opus',
            self::CLAUDE_3_SONNET => 'Claude 3 Sonnet',
            self::CLAUDE_3_HAIKU => 'Claude 3 Haiku',
            self::GEMINI_PRO => 'Gemini Pro',
            self::GEMINI_PRO_VISION => 'Gemini Pro Vision',
            self::LLAMA_2 => 'Llama 2',
            self::LLAMA_3 => 'Llama 3',
            default => 'Unknown Model'
        };
    }

    public function getIcon(): string
    {
        return match ($this->value) {
            self::GPT_4, self::GPT_3_5_TURBO, self::GPT_4_TURBO => 'openai',
            self::CLAUDE_3_OPUS, self::CLAUDE_3_SONNET, self::CLAUDE_3_HAIKU => 'anthropic',
            self::GEMINI_PRO, self::GEMINI_PRO_VISION => 'google',
            self::LLAMA_2, self::LLAMA_3 => 'meta',
            default => 'question'
        };
    }

    public function getColor(): string
    {
        return match ($this->value) {
            self::GPT_4, self::GPT_3_5_TURBO, self::GPT_4_TURBO => 'green',
            self::CLAUDE_3_OPUS, self::CLAUDE_3_SONNET, self::CLAUDE_3_HAIKU => 'orange',
            self::GEMINI_PRO, self::GEMINI_PRO_VISION => 'blue',
            self::LLAMA_2, self::LLAMA_3 => 'purple',
            default => 'gray'
        };
    }

    public function getDescription(): string
    {
        return match ($this->value) {
            self::GPT_4 => 'Most capable GPT-4 model',
            self::GPT_3_5_TURBO => 'Fast and efficient GPT-3.5 model',
            self::GPT_4_TURBO => 'Latest GPT-4 model with improved performance',
            self::CLAUDE_3_OPUS => 'Most powerful Claude model',
            self::CLAUDE_3_SONNET => 'Balanced Claude model',
            self::CLAUDE_3_HAIKU => 'Fastest Claude model',
            self::GEMINI_PRO => 'Google\'s most capable model',
            self::GEMINI_PRO_VISION => 'Google\'s multimodal model',
            self::LLAMA_2 => 'Meta\'s open-source model',
            self::LLAMA_3 => 'Meta\'s latest open-source model',
            default => 'Unknown model'
        };
    }

    public function getMaxTokens(): int
    {
        return match ($this->value) {
            self::GPT_4 => 8192,
            self::GPT_3_5_TURBO => 4096,
            self::GPT_4_TURBO => 128000,
            self::CLAUDE_3_OPUS => 200000,
            self::CLAUDE_3_SONNET => 200000,
            self::CLAUDE_3_HAIKU => 200000,
            self::GEMINI_PRO => 30720,
            self::GEMINI_PRO_VISION => 30720,
            self::LLAMA_2 => 2048,
            self::LLAMA_3 => 2048,
            default => 1024
        };
    }

    public function getCostPer1KTokens(): float
    {
        return match ($this->value) {
            self::GPT_4 => 0.03,
            self::GPT_3_5_TURBO => 0.002,
            self::GPT_4_TURBO => 0.01,
            self::CLAUDE_3_OPUS => 0.015,
            self::CLAUDE_3_SONNET => 0.003,
            self::CLAUDE_3_HAIKU => 0.00025,
            self::GEMINI_PRO => 0.0005,
            self::GEMINI_PRO_VISION => 0.0005,
            self::LLAMA_2 => 0.0, // Open source
            self::LLAMA_3 => 0.0, // Open source
            default => 0.0
        };
    }

    public function supportsFunctionCalling(): bool
    {
        return in_array($this->value, [
            self::GPT_4, self::GPT_3_5_TURBO, self::GPT_4_TURBO,
            self::CLAUDE_3_OPUS, self::CLAUDE_3_SONNET, self::CLAUDE_3_HAIKU,
            self::GEMINI_PRO
        ]);
    }

    public function supportsVision(): bool
    {
        return in_array($this->value, [
            self::GPT_4, self::GPT_4_TURBO,
            self::CLAUDE_3_OPUS, self::CLAUDE_3_SONNET, self::CLAUDE_3_HAIKU,
            self::GEMINI_PRO_VISION
        ]);
    }

    public function supportsStreaming(): bool
    {
        return in_array($this->value, [
            self::GPT_4, self::GPT_3_5_TURBO, self::GPT_4_TURBO,
            self::CLAUDE_3_OPUS, self::CLAUDE_3_SONNET, self::CLAUDE_3_HAIKU,
            self::GEMINI_PRO, self::GEMINI_PRO_VISION
        ]);
    }

    public function getPerformanceLevel(): string
    {
        return match ($this->value) {
            self::GPT_4, self::CLAUDE_3_OPUS, self::GEMINI_PRO => 'high',
            self::GPT_4_TURBO, self::CLAUDE_3_SONNET, self::GEMINI_PRO_VISION => 'medium-high',
            self::GPT_3_5_TURBO, self::CLAUDE_3_HAIKU => 'medium',
            self::LLAMA_2, self::LLAMA_3 => 'low-medium',
            default => 'unknown'
        };
    }

    public function equals(AIModel $other): bool
    {
        return $this->value === $other->value;
    }

    public function __toString(): string
    {
        return $this->value;
    }

    private function validate(string $model): void
    {
        $validModels = [
            self::GPT_4, self::GPT_3_5_TURBO, self::GPT_4_TURBO,
            self::CLAUDE_3_OPUS, self::CLAUDE_3_SONNET, self::CLAUDE_3_HAIKU,
            self::GEMINI_PRO, self::GEMINI_PRO_VISION,
            self::LLAMA_2, self::LLAMA_3
        ];

        if (!in_array($model, $validModels)) {
            throw new InvalidArgumentException("Invalid AI model: {$model}");
        }
    }
}
