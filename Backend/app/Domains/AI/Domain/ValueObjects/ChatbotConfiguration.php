<?php

namespace App\Domains\AI\Domain\ValueObjects;

use InvalidArgumentException;

class ChatbotConfiguration
{
    private int $maxTokens;
    private float $temperature;
    private ?string $welcomeMessage;
    private ?string $fallbackMessage;
    private ?array $escalationRules;
    private ?array $businessHours;
    private ?string $language;
    private ?array $customSettings;

    public function __construct(
        int $maxTokens = 2000,
        float $temperature = 0.7,
        ?string $welcomeMessage = null,
        ?string $fallbackMessage = null,
        ?array $escalationRules = null,
        ?array $businessHours = null,
        ?string $language = 'pt-BR',
        ?array $customSettings = null
    ) {
        $this->validateMaxTokens($maxTokens);
        $this->validateTemperature($temperature);
        $this->validateLanguage($language);

        $this->maxTokens = $maxTokens;
        $this->temperature = $temperature;
        $this->welcomeMessage = $welcomeMessage;
        $this->fallbackMessage = $fallbackMessage;
        $this->escalationRules = $escalationRules;
        $this->businessHours = $businessHours;
        $this->language = $language;
        $this->customSettings = $customSettings;
    }

    public static function default(): self
    {
        return new self();
    }

    public static function fromArray(array $config): self
    {
        return new self(
            $config['max_tokens'] ?? 2000,
            $config['temperature'] ?? 0.7,
            $config['welcome_message'] ?? null,
            $config['fallback_message'] ?? null,
            $config['escalation_rules'] ?? null,
            $config['business_hours'] ?? null,
            $config['language'] ?? 'pt-BR',
            $config['custom_settings'] ?? null
        );
    }

    public function getMaxTokens(): int
    {
        return $this->maxTokens;
    }

    public function getTemperature(): float
    {
        return $this->temperature;
    }

    public function getWelcomeMessage(): ?string
    {
        return $this->welcomeMessage;
    }

    public function getFallbackMessage(): ?string
    {
        return $this->fallbackMessage;
    }

    public function getEscalationRules(): ?array
    {
        return $this->escalationRules;
    }

    public function getBusinessHours(): ?array
    {
        return $this->businessHours;
    }

    public function getLanguage(): ?string
    {
        return $this->language;
    }

    public function getCustomSettings(): ?array
    {
        return $this->customSettings;
    }

    public function setMaxTokens(int $maxTokens): self
    {
        $this->validateMaxTokens($maxTokens);
        return new self(
            $maxTokens,
            $this->temperature,
            $this->welcomeMessage,
            $this->fallbackMessage,
            $this->escalationRules,
            $this->businessHours,
            $this->language,
            $this->customSettings
        );
    }

    public function setTemperature(float $temperature): self
    {
        $this->validateTemperature($temperature);
        return new self(
            $this->maxTokens,
            $temperature,
            $this->welcomeMessage,
            $this->fallbackMessage,
            $this->escalationRules,
            $this->businessHours,
            $this->language,
            $this->customSettings
        );
    }

    public function setWelcomeMessage(?string $welcomeMessage): self
    {
        return new self(
            $this->maxTokens,
            $this->temperature,
            $welcomeMessage,
            $this->fallbackMessage,
            $this->escalationRules,
            $this->businessHours,
            $this->language,
            $this->customSettings
        );
    }

    public function setFallbackMessage(?string $fallbackMessage): self
    {
        return new self(
            $this->maxTokens,
            $this->temperature,
            $this->welcomeMessage,
            $fallbackMessage,
            $this->escalationRules,
            $this->businessHours,
            $this->language,
            $this->customSettings
        );
    }

    public function setLanguage(?string $language): self
    {
        $this->validateLanguage($language);
        return new self(
            $this->maxTokens,
            $this->temperature,
            $this->welcomeMessage,
            $this->fallbackMessage,
            $this->escalationRules,
            $this->businessHours,
            $language,
            $this->customSettings
        );
    }

    public function setCustomSettings(?array $customSettings): self
    {
        return new self(
            $this->maxTokens,
            $this->temperature,
            $this->welcomeMessage,
            $this->fallbackMessage,
            $this->escalationRules,
            $this->businessHours,
            $this->language,
            $customSettings
        );
    }

    public function getFormattedTemperature(): string
    {
        return number_format($this->temperature, 1);
    }

    public function getTemperatureDescription(): string
    {
        if ($this->temperature <= 0.3) {
            return 'Muito conservador';
        } elseif ($this->temperature <= 0.7) {
            return 'Balanceado';
        } elseif ($this->temperature <= 1.0) {
            return 'Criativo';
        } else {
            return 'Muito criativo';
        }
    }

    public function getTemperatureColor(): string
    {
        if ($this->temperature <= 0.3) {
            return 'blue';
        } elseif ($this->temperature <= 0.7) {
            return 'green';
        } elseif ($this->temperature <= 1.0) {
            return 'yellow';
        } else {
            return 'red';
        }
    }

    public function getMaxTokensDescription(): string
    {
        if ($this->maxTokens <= 1000) {
            return 'Respostas curtas';
        } elseif ($this->maxTokens <= 3000) {
            return 'Respostas médias';
        } else {
            return 'Respostas longas';
        }
    }

    public function getMaxTokensColor(): string
    {
        if ($this->maxTokens <= 1000) {
            return 'blue';
        } elseif ($this->maxTokens <= 3000) {
            return 'green';
        } else {
            return 'orange';
        }
    }

    public function isBusinessHours(): bool
    {
        if (!$this->businessHours) {
            return true; // Always available if no business hours set
        }

        $now = new \DateTime();
        $currentDay = strtolower($now->format('l'));
        $currentTime = $now->format('H:i');

        if (!isset($this->businessHours[$currentDay])) {
            return false;
        }

        $hours = $this->businessHours[$currentDay];
        if (!isset($hours['start']) || !isset($hours['end'])) {
            return false;
        }

        return $currentTime >= $hours['start'] && $currentTime <= $hours['end'];
    }

    public function getNextBusinessHours(): ?string
    {
        if (!$this->businessHours) {
            return null;
        }

        $now = new \DateTime();
        $currentDay = strtolower($now->format('l'));
        $currentTime = $now->format('H:i');

        $days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        $currentDayIndex = array_search($currentDay, $days);

        for ($i = 0; $i < 7; $i++) {
            $dayIndex = ($currentDayIndex + $i) % 7;
            $day = $days[$dayIndex];

            if (isset($this->businessHours[$day])) {
                $hours = $this->businessHours[$day];
                if (isset($hours['start']) && isset($hours['end'])) {
                    if ($i === 0 && $currentTime < $hours['start']) {
                        return "Hoje às {$hours['start']}";
                    } elseif ($i > 0) {
                        $dayName = ucfirst($day);
                        return "{$dayName} às {$hours['start']}";
                    }
                }
            }
        }

        return null;
    }

    public function getLanguageDisplayName(): string
    {
        return match ($this->language) {
            'pt-BR' => 'Português (Brasil)',
            'en-US' => 'English (US)',
            'es-ES' => 'Español',
            'fr-FR' => 'Français',
            'de-DE' => 'Deutsch',
            'it-IT' => 'Italiano',
            'ja-JP' => '日本語',
            'ko-KR' => '한국어',
            'zh-CN' => '中文 (简体)',
            'zh-TW' => '中文 (繁體)',
            default => $this->language ?? 'Português (Brasil)'
        };
    }

    public function getLanguageFlag(): string
    {
        return match ($this->language) {
            'pt-BR' => '🇧🇷',
            'en-US' => '🇺🇸',
            'es-ES' => '🇪🇸',
            'fr-FR' => '🇫🇷',
            'de-DE' => '🇩🇪',
            'it-IT' => '🇮🇹',
            'ja-JP' => '🇯🇵',
            'ko-KR' => '🇰🇷',
            'zh-CN' => '🇨🇳',
            'zh-TW' => '🇹🇼',
            default => '🌐'
        };
    }

    public function hasEscalationRules(): bool
    {
        return !empty($this->escalationRules);
    }

    public function hasBusinessHours(): bool
    {
        return !empty($this->businessHours);
    }

    public function hasCustomSettings(): bool
    {
        return !empty($this->customSettings);
    }

    public function getCustomSetting(string $key, $default = null)
    {
        return $this->customSettings[$key] ?? $default;
    }

    public function setCustomSetting(string $key, $value): self
    {
        $customSettings = $this->customSettings ?? [];
        $customSettings[$key] = $value;
        return $this->setCustomSettings($customSettings);
    }

    public function toArray(): array
    {
        return [
            'max_tokens' => $this->maxTokens,
            'temperature' => $this->temperature,
            'welcome_message' => $this->welcomeMessage,
            'fallback_message' => $this->fallbackMessage,
            'escalation_rules' => $this->escalationRules,
            'business_hours' => $this->businessHours,
            'language' => $this->language,
            'custom_settings' => $this->customSettings,
            'temperature_description' => $this->getTemperatureDescription(),
            'temperature_color' => $this->getTemperatureColor(),
            'max_tokens_description' => $this->getMaxTokensDescription(),
            'max_tokens_color' => $this->getMaxTokensColor(),
            'language_display_name' => $this->getLanguageDisplayName(),
            'language_flag' => $this->getLanguageFlag(),
            'is_business_hours' => $this->isBusinessHours(),
            'next_business_hours' => $this->getNextBusinessHours(),
            'has_escalation_rules' => $this->hasEscalationRules(),
            'has_business_hours' => $this->hasBusinessHours(),
            'has_custom_settings' => $this->hasCustomSettings(),
        ];
    }

    public function equals(ChatbotConfiguration $other): bool
    {
        return $this->maxTokens === $other->maxTokens
            && $this->temperature === $other->temperature
            && $this->welcomeMessage === $other->welcomeMessage
            && $this->fallbackMessage === $other->fallbackMessage
            && $this->escalationRules === $other->escalationRules
            && $this->businessHours === $other->businessHours
            && $this->language === $other->language
            && $this->customSettings === $other->customSettings;
    }

    private function validateMaxTokens(int $maxTokens): void
    {
        if ($maxTokens <= 0) {
            throw new InvalidArgumentException('Max tokens must be greater than 0');
        }

        if ($maxTokens > 8000) {
            throw new InvalidArgumentException('Max tokens cannot exceed 8000');
        }
    }

    private function validateTemperature(float $temperature): void
    {
        if ($temperature < 0 || $temperature > 2) {
            throw new InvalidArgumentException('Temperature must be between 0 and 2');
        }
    }

    private function validateLanguage(?string $language): void
    {
        if ($language === null) {
            return;
        }

        $validLanguages = [
            'pt-BR', 'en-US', 'es-ES', 'fr-FR', 'de-DE',
            'it-IT', 'ja-JP', 'ko-KR', 'zh-CN', 'zh-TW'
        ];

        if (!in_array($language, $validLanguages)) {
            throw new InvalidArgumentException("Invalid language: {$language}");
        }
    }
}
