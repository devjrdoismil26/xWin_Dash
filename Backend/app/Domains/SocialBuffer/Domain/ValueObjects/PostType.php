<?php

namespace App\Domains\SocialBuffer\Domain\ValueObjects;

use InvalidArgumentException;

class PostType
{
    public const TEXT = 'text';
    public const IMAGE = 'image';
    public const VIDEO = 'video';
    public const LINK = 'link';
    public const CAROUSEL = 'carousel';
    public const STORY = 'story';
    public const REEL = 'reel';

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

    public static function link(): self
    {
        return new self(self::LINK);
    }

    public static function carousel(): self
    {
        return new self(self::CAROUSEL);
    }

    public static function story(): self
    {
        return new self(self::STORY);
    }

    public static function reel(): self
    {
        return new self(self::REEL);
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

    public function isLink(): bool
    {
        return $this->value === self::LINK;
    }

    public function isCarousel(): bool
    {
        return $this->value === self::CAROUSEL;
    }

    public function isStory(): bool
    {
        return $this->value === self::STORY;
    }

    public function isReel(): bool
    {
        return $this->value === self::REEL;
    }

    public function requiresMedia(): bool
    {
        return in_array($this->value, [self::IMAGE, self::VIDEO, self::CAROUSEL, self::STORY, self::REEL]);
    }

    public function supportsHashtags(): bool
    {
        return in_array($this->value, [self::TEXT, self::IMAGE, self::VIDEO, self::LINK, self::CAROUSEL]);
    }

    public function supportsMentions(): bool
    {
        return in_array($this->value, [self::TEXT, self::IMAGE, self::VIDEO, self::LINK, self::CAROUSEL]);
    }

    public function supportsLocation(): bool
    {
        return in_array($this->value, [self::TEXT, self::IMAGE, self::VIDEO, self::LINK, self::CAROUSEL]);
    }

    public function getMaxContentLength(): int
    {
        return match ($this->value) {
            self::TEXT => 2000,
            self::IMAGE => 2000,
            self::VIDEO => 2000,
            self::LINK => 2000,
            self::CAROUSEL => 2000,
            self::STORY => 1000,
            self::REEL => 2000,
            default => 2000
        };
    }

    public function getMaxMediaCount(): int
    {
        return match ($this->value) {
            self::TEXT => 0,
            self::IMAGE => 1,
            self::VIDEO => 1,
            self::LINK => 0,
            self::CAROUSEL => 10,
            self::STORY => 1,
            self::REEL => 1,
            default => 0
        };
    }

    public function getDisplayName(): string
    {
        return match ($this->value) {
            self::TEXT => 'Texto',
            self::IMAGE => 'Imagem',
            self::VIDEO => 'Vídeo',
            self::LINK => 'Link',
            self::CAROUSEL => 'Carrossel',
            self::STORY => 'Stories',
            self::REEL => 'Reels',
            default => 'Desconhecido'
        };
    }

    public function getIcon(): string
    {
        return match ($this->value) {
            self::TEXT => 'text',
            self::IMAGE => 'image',
            self::VIDEO => 'video',
            self::LINK => 'link',
            self::CAROUSEL => 'images',
            self::STORY => 'story',
            self::REEL => 'video',
            default => 'text'
        };
    }

    public function equals(PostType $other): bool
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
            self::LINK,
            self::CAROUSEL,
            self::STORY,
            self::REEL
        ];

        if (!in_array($type, $validTypes)) {
            throw new InvalidArgumentException("Invalid post type: {$type}");
        }
    }
}
