<?php

namespace App\Domains\ADStool\Domain\ValueObjects;

use InvalidArgumentException;

class ADSPlatform
{
    public const FACEBOOK = 'facebook';
    public const GOOGLE = 'google';
    public const INSTAGRAM = 'instagram';
    public const TWITTER = 'twitter';
    public const LINKEDIN = 'linkedin';

    private string $value;

    public function __construct(string $platform)
    {
        $this->validate($platform);
        $this->value = $platform;
    }

    public static function facebook(): self
    {
        return new self(self::FACEBOOK);
    }

    public static function google(): self
    {
        return new self(self::GOOGLE);
    }

    public static function instagram(): self
    {
        return new self(self::INSTAGRAM);
    }

    public static function twitter(): self
    {
        return new self(self::TWITTER);
    }

    public static function linkedin(): self
    {
        return new self(self::LINKEDIN);
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function isFacebook(): bool
    {
        return $this->value === self::FACEBOOK;
    }

    public function isGoogle(): bool
    {
        return $this->value === self::GOOGLE;
    }

    public function isInstagram(): bool
    {
        return $this->value === self::INSTAGRAM;
    }

    public function isTwitter(): bool
    {
        return $this->value === self::TWITTER;
    }

    public function isLinkedIn(): bool
    {
        return $this->value === self::LINKEDIN;
    }

    public function supportsVideoAds(): bool
    {
        return in_array($this->value, [self::FACEBOOK, self::GOOGLE, self::INSTAGRAM, self::TWITTER]);
    }

    public function supportsImageAds(): bool
    {
        return true; // All platforms support image ads
    }

    public function supportsCarouselAds(): bool
    {
        return in_array($this->value, [self::FACEBOOK, self::GOOGLE, self::INSTAGRAM]);
    }

    public function supportsStoryAds(): bool
    {
        return in_array($this->value, [self::FACEBOOK, self::INSTAGRAM]);
    }

    public function supportsReelAds(): bool
    {
        return in_array($this->value, [self::FACEBOOK, self::INSTAGRAM]);
    }

    public function getMaxBudget(): float
    {
        return match ($this->value) {
            self::FACEBOOK => 10000.0,
            self::GOOGLE => 10000.0,
            self::INSTAGRAM => 10000.0,
            self::TWITTER => 5000.0,
            self::LINKEDIN => 5000.0,
            default => 1000.0
        };
    }

    public function getMinBudget(): float
    {
        return match ($this->value) {
            self::FACEBOOK => 1.0,
            self::GOOGLE => 1.0,
            self::INSTAGRAM => 1.0,
            self::TWITTER => 1.0,
            self::LINKEDIN => 1.0,
            default => 1.0
        };
    }

    public function getSupportedObjectives(): array
    {
        return match ($this->value) {
            self::FACEBOOK => [
                'awareness', 'traffic', 'engagement', 'leads', 'sales', 'app_installs'
            ],
            self::GOOGLE => [
                'awareness', 'traffic', 'leads', 'sales', 'app_installs'
            ],
            self::INSTAGRAM => [
                'awareness', 'traffic', 'engagement', 'leads', 'sales', 'app_installs'
            ],
            self::TWITTER => [
                'awareness', 'traffic', 'engagement', 'leads', 'sales', 'app_installs'
            ],
            self::LINKEDIN => [
                'awareness', 'traffic', 'engagement', 'leads', 'sales'
            ],
            default => []
        };
    }

    public function getDisplayName(): string
    {
        return match ($this->value) {
            self::FACEBOOK => 'Facebook',
            self::GOOGLE => 'Google',
            self::INSTAGRAM => 'Instagram',
            self::TWITTER => 'Twitter',
            self::LINKEDIN => 'LinkedIn',
            default => 'Desconhecido'
        };
    }

    public function getIcon(): string
    {
        return match ($this->value) {
            self::FACEBOOK => 'facebook',
            self::GOOGLE => 'google',
            self::INSTAGRAM => 'instagram',
            self::TWITTER => 'twitter',
            self::LINKEDIN => 'linkedin',
            default => 'globe'
        };
    }

    public function getColor(): string
    {
        return match ($this->value) {
            self::FACEBOOK => 'blue',
            self::GOOGLE => 'red',
            self::INSTAGRAM => 'pink',
            self::TWITTER => 'blue',
            self::LINKEDIN => 'blue',
            default => 'gray'
        };
    }

    public function getDescription(): string
    {
        return match ($this->value) {
            self::FACEBOOK => 'Plataforma de anúncios do Facebook',
            self::GOOGLE => 'Plataforma de anúncios do Google',
            self::INSTAGRAM => 'Plataforma de anúncios do Instagram',
            self::TWITTER => 'Plataforma de anúncios do Twitter',
            self::LINKEDIN => 'Plataforma de anúncios do LinkedIn',
            default => 'Plataforma desconhecida'
        };
    }

    public function getApiVersion(): string
    {
        return match ($this->value) {
            self::FACEBOOK => 'v18.0',
            self::GOOGLE => 'v14',
            self::INSTAGRAM => 'v18.0',
            self::TWITTER => 'v2',
            self::LINKEDIN => 'v2',
            default => 'v1'
        };
    }

    public function getRateLimit(): int
    {
        return match ($this->value) {
            self::FACEBOOK => 200,
            self::GOOGLE => 100,
            self::INSTAGRAM => 200,
            self::TWITTER => 300,
            self::LINKEDIN => 100,
            default => 100
        };
    }

    public function equals(ADSPlatform $other): bool
    {
        return $this->value === $other->value;
    }

    public function __toString(): string
    {
        return $this->value;
    }

    private function validate(string $platform): void
    {
        $validPlatforms = [
            self::FACEBOOK,
            self::GOOGLE,
            self::INSTAGRAM,
            self::TWITTER,
            self::LINKEDIN
        ];

        if (!in_array($platform, $validPlatforms)) {
            throw new InvalidArgumentException("Invalid ADS platform: {$platform}");
        }
    }
}
