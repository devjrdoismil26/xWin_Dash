<?php

namespace App\Domains\Media\Domain\ValueObjects;

use InvalidArgumentException;

class FolderType
{
    public const FOLDER = 'folder';
    public const COLLECTION = 'collection';
    public const GALLERY = 'gallery';

    private string $value;

    public function __construct(string $type)
    {
        $this->validate($type);
        $this->value = $type;
    }

    public static function folder(): self
    {
        return new self(self::FOLDER);
    }

    public static function collection(): self
    {
        return new self(self::COLLECTION);
    }

    public static function gallery(): self
    {
        return new self(self::GALLERY);
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function isFolder(): bool
    {
        return $this->value === self::FOLDER;
    }

    public function isCollection(): bool
    {
        return $this->value === self::COLLECTION;
    }

    public function isGallery(): bool
    {
        return $this->value === self::GALLERY;
    }

    public function supportsNesting(): bool
    {
        return in_array($this->value, [self::FOLDER, self::COLLECTION]);
    }

    public function supportsMedia(): bool
    {
        return true; // All folder types support media
    }

    public function supportsSubfolders(): bool
    {
        return in_array($this->value, [self::FOLDER, self::COLLECTION]);
    }

    public function supportsPublicAccess(): bool
    {
        return $this->value === self::GALLERY;
    }

    public function supportsSharing(): bool
    {
        return in_array($this->value, [self::COLLECTION, self::GALLERY]);
    }

    public function getMaxDepth(): int
    {
        return match ($this->value) {
            self::FOLDER => 10, // Regular folders can have deep nesting
            self::COLLECTION => 5, // Collections have moderate nesting
            self::GALLERY => 3, // Galleries have shallow nesting
            default => 3
        };
    }

    public function getMaxItems(): int
    {
        return match ($this->value) {
            self::FOLDER => 1000, // Regular folders can have many items
            self::COLLECTION => 500, // Collections have moderate items
            self::GALLERY => 100, // Galleries have limited items
            default => 100
        };
    }

    public function getDisplayName(): string
    {
        return match ($this->value) {
            self::FOLDER => 'Pasta',
            self::COLLECTION => 'Coleção',
            self::GALLERY => 'Galeria',
            default => 'Desconhecido'
        };
    }

    public function getIcon(): string
    {
        return match ($this->value) {
            self::FOLDER => 'folder',
            self::COLLECTION => 'folder-plus',
            self::GALLERY => 'images',
            default => 'folder'
        };
    }

    public function getColor(): string
    {
        return match ($this->value) {
            self::FOLDER => 'blue',
            self::COLLECTION => 'purple',
            self::GALLERY => 'green',
            default => 'gray'
        };
    }

    public function getDescription(): string
    {
        return match ($this->value) {
            self::FOLDER => 'Pasta regular para organização de arquivos',
            self::COLLECTION => 'Coleção temática de mídia',
            self::GALLERY => 'Galeria pública para exibição de mídia',
            default => 'Tipo de pasta desconhecido'
        };
    }

    public function getFeatures(): array
    {
        return match ($this->value) {
            self::FOLDER => [
                'nesting',
                'media_storage',
                'subfolders',
                'private_access'
            ],
            self::COLLECTION => [
                'nesting',
                'media_storage',
                'subfolders',
                'sharing',
                'thematic_organization'
            ],
            self::GALLERY => [
                'media_storage',
                'public_access',
                'sharing',
                'visual_display'
            ],
            default => []
        };
    }

    public function equals(FolderType $other): bool
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
            self::FOLDER,
            self::COLLECTION,
            self::GALLERY
        ];

        if (!in_array($type, $validTypes)) {
            throw new InvalidArgumentException("Invalid folder type: {$type}");
        }
    }
}
