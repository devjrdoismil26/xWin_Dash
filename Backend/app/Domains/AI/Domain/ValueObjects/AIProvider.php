<?php

namespace App\Domains\AI\Domain\ValueObjects;

use InvalidArgumentException;

class AIProvider
{
    public const OPENAI = 'openai';
    public const ANTHROPIC = 'anthropic';
    public const GOOGLE = 'google';
    public const META = 'meta';

    private string $value;

    public function __construct(string $provider)
    {
        $this->validate($provider);
        $this->value = $provider;
    }

    public static function openai(): self
    {
        return new self(self::OPENAI);
    }

    public static function anthropic(): self
    {
        return new self(self::ANTHROPIC);
    }

    public static function google(): self
    {
        return new self(self::GOOGLE);
    }

    public static function meta(): self
    {
        return new self(self::META);
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function isOpenAI(): bool
    {
        return $this->value === self::OPENAI;
    }

    public function isAnthropic(): bool
    {
        return $this->value === self::ANTHROPIC;
    }

    public function isGoogle(): bool
    {
        return $this->value === self::GOOGLE;
    }

    public function isMeta(): bool
    {
        return $this->value === self::META;
    }

    public function getDisplayName(): string
    {
        return match ($this->value) {
            self::OPENAI => 'OpenAI',
            self::ANTHROPIC => 'Anthropic',
            self::GOOGLE => 'Google',
            self::META => 'Meta',
            default => 'Unknown'
        };
    }

    public function getIcon(): string
    {
        return match ($this->value) {
            self::OPENAI => 'openai',
            self::ANTHROPIC => 'anthropic',
            self::GOOGLE => 'google',
            self::META => 'meta',
            default => 'question'
        };
    }

    public function getColor(): string
    {
        return match ($this->value) {
            self::OPENAI => 'green',
            self::ANTHROPIC => 'orange',
            self::GOOGLE => 'blue',
            self::META => 'purple',
            default => 'gray'
        };
    }

    public function getDescription(): string
    {
        return match ($this->value) {
            self::OPENAI => 'OpenAI GPT models',
            self::ANTHROPIC => 'Anthropic Claude models',
            self::GOOGLE => 'Google Gemini models',
            self::META => 'Meta AI models',
            default => 'Unknown provider'
        };
    }

    public function getSupportedModels(): array
    {
        return match ($this->value) {
            self::OPENAI => ['gpt-4', 'gpt-3.5-turbo', 'gpt-4-turbo'],
            self::ANTHROPIC => ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
            self::GOOGLE => ['gemini-pro', 'gemini-pro-vision'],
            self::META => ['llama-2', 'llama-3'],
            default => []
        };
    }

    public function getApiEndpoint(): string
    {
        return match ($this->value) {
            self::OPENAI => 'https://api.openai.com/v1',
            self::ANTHROPIC => 'https://api.anthropic.com/v1',
            self::GOOGLE => 'https://generativelanguage.googleapis.com/v1',
            self::META => 'https://api.meta.com/v1',
            default => ''
        };
    }

    public function getRateLimit(): int
    {
        return match ($this->value) {
            self::OPENAI => 60,
            self::ANTHROPIC => 30,
            self::GOOGLE => 60,
            self::META => 20,
            default => 10
        };
    }

    public function getMaxTokens(): int
    {
        return match ($this->value) {
            self::OPENAI => 4096,
            self::ANTHROPIC => 200000,
            self::GOOGLE => 30720,
            self::META => 2048,
            default => 1024
        };
    }

    public function supportsFunctionCalling(): bool
    {
        return in_array($this->value, [self::OPENAI, self::ANTHROPIC, self::GOOGLE]);
    }

    public function supportsVision(): bool
    {
        return in_array($this->value, [self::OPENAI, self::ANTHROPIC, self::GOOGLE]);
    }

    public function supportsStreaming(): bool
    {
        return in_array($this->value, [self::OPENAI, self::ANTHROPIC, self::GOOGLE]);
    }

    public function equals(AIProvider $other): bool
    {
        return $this->value === $other->value;
    }

    public function __toString(): string
    {
        return $this->value;
    }

    private function validate(string $provider): void
    {
        $validProviders = [
            self::OPENAI,
            self::ANTHROPIC,
            self::GOOGLE,
            self::META
        ];

        if (!in_array($provider, $validProviders)) {
            throw new InvalidArgumentException("Invalid AI provider: {$provider}");
        }
    }
}
