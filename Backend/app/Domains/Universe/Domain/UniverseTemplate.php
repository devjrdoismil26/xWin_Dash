<?php

namespace App\Domains\Universe\Domain;

use DateTime;
use InvalidArgumentException;

class UniverseTemplate
{
    // Category constants
    public const CATEGORY_BUSINESS = 'business';
    public const CATEGORY_EDUCATION = 'education';
    public const CATEGORY_ENTERTAINMENT = 'entertainment';
    public const CATEGORY_HEALTH = 'health';
    public const CATEGORY_TECHNOLOGY = 'technology';
    public const CATEGORY_MARKETING = 'marketing';
    public const CATEGORY_PRODUCTIVITY = 'productivity';
    public const CATEGORY_OTHER = 'other';

    // Difficulty constants
    public const DIFFICULTY_BEGINNER = 'beginner';
    public const DIFFICULTY_INTERMEDIATE = 'intermediate';
    public const DIFFICULTY_ADVANCED = 'advanced';
    public const DIFFICULTY_EXPERT = 'expert';

    public ?int $id;
    public string $name;
    public ?string $description;
    public ?string $category;
    public ?string $difficulty;
    public ?string $icon;
    public ?string $author;
    public bool $isPublic;
    public bool $isSystem;
    public ?array $tags;
    public ?array $modulesConfig;
    public ?array $connectionsConfig;
    public ?array $aiCommands;
    public ?array $themeConfig;
    public ?array $layoutConfig;
    public int $usageCount;
    public float $rating;
    public int $userId;
    public ?array $metadata;
    public ?DateTime $createdAt;
    public ?DateTime $updatedAt;
    public ?DateTime $deletedAt;

    public function __construct(
        string $name,
        int $userId,
        ?string $description = null,
        ?string $category = null,
        ?string $difficulty = null,
        ?string $icon = null,
        ?string $author = null,
        bool $isPublic = false,
        bool $isSystem = false,
        ?array $tags = null,
        ?array $modulesConfig = null,
        ?array $connectionsConfig = null,
        ?array $aiCommands = null,
        ?array $themeConfig = null,
        ?array $layoutConfig = null,
        int $usageCount = 0,
        float $rating = 0.0,
        ?array $metadata = null,
        ?int $id = null,
        ?DateTime $createdAt = null,
        ?DateTime $updatedAt = null,
        ?DateTime $deletedAt = null,
    ) {
        $this->validateName($name);
        $this->validateUserId($userId);
        $this->validateDescription($description);
        $this->validateCategory($category);
        $this->validateDifficulty($difficulty);
        $this->validateIcon($icon);
        $this->validateAuthor($author);
        $this->validateTags($tags);
        $this->validateModulesConfig($modulesConfig);
        $this->validateConnectionsConfig($connectionsConfig);
        $this->validateAiCommands($aiCommands);
        $this->validateThemeConfig($themeConfig);
        $this->validateLayoutConfig($layoutConfig);
        $this->validateUsageCount($usageCount);
        $this->validateRating($rating);
        $this->validateMetadata($metadata);

        $this->id = $id;
        $this->name = $name;
        $this->description = $description;
        $this->category = $category;
        $this->difficulty = $difficulty;
        $this->icon = $icon;
        $this->author = $author;
        $this->isPublic = $isPublic;
        $this->isSystem = $isSystem;
        $this->tags = $tags;
        $this->modulesConfig = $modulesConfig;
        $this->connectionsConfig = $connectionsConfig;
        $this->aiCommands = $aiCommands;
        $this->themeConfig = $themeConfig;
        $this->layoutConfig = $layoutConfig;
        $this->usageCount = $usageCount;
        $this->rating = $rating;
        $this->userId = $userId;
        $this->metadata = $metadata;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
        $this->deletedAt = $deletedAt;
    }

    // Validation methods
    private function validateName(string $name): void
    {
        if (empty(trim($name))) {
            throw new InvalidArgumentException('Template name cannot be empty');
        }
        if (strlen($name) > 255) {
            throw new InvalidArgumentException('Template name cannot exceed 255 characters');
        }
    }

    private function validateUserId(int $userId): void
    {
        if ($userId <= 0) {
            throw new InvalidArgumentException('User ID must be a positive integer');
        }
    }

    private function validateDescription(?string $description): void
    {
        if ($description !== null && strlen($description) > 1000) {
            throw new InvalidArgumentException('Description cannot exceed 1000 characters');
        }
    }

    private function validateCategory(?string $category): void
    {
        if ($category !== null && !in_array($category, [self::CATEGORY_BUSINESS, self::CATEGORY_EDUCATION, self::CATEGORY_ENTERTAINMENT, self::CATEGORY_HEALTH, self::CATEGORY_TECHNOLOGY, self::CATEGORY_MARKETING, self::CATEGORY_PRODUCTIVITY, self::CATEGORY_OTHER])) {
            throw new InvalidArgumentException('Invalid template category');
        }
    }

    private function validateDifficulty(?string $difficulty): void
    {
        if ($difficulty !== null && !in_array($difficulty, [self::DIFFICULTY_BEGINNER, self::DIFFICULTY_INTERMEDIATE, self::DIFFICULTY_ADVANCED, self::DIFFICULTY_EXPERT])) {
            throw new InvalidArgumentException('Invalid template difficulty');
        }
    }

    private function validateIcon(?string $icon): void
    {
        if ($icon !== null && strlen($icon) > 255) {
            throw new InvalidArgumentException('Icon cannot exceed 255 characters');
        }
    }

    private function validateAuthor(?string $author): void
    {
        if ($author !== null && strlen($author) > 255) {
            throw new InvalidArgumentException('Author cannot exceed 255 characters');
        }
    }

    private function validateTags(?array $tags): void
    {
        if ($tags !== null && !is_array($tags)) {
            throw new InvalidArgumentException('Tags must be an array');
        }
    }

    private function validateModulesConfig(?array $modulesConfig): void
    {
        if ($modulesConfig !== null && !is_array($modulesConfig)) {
            throw new InvalidArgumentException('Modules config must be an array');
        }
    }

    private function validateConnectionsConfig(?array $connectionsConfig): void
    {
        if ($connectionsConfig !== null && !is_array($connectionsConfig)) {
            throw new InvalidArgumentException('Connections config must be an array');
        }
    }

    private function validateAiCommands(?array $aiCommands): void
    {
        if ($aiCommands !== null && !is_array($aiCommands)) {
            throw new InvalidArgumentException('AI commands must be an array');
        }
    }

    private function validateThemeConfig(?array $themeConfig): void
    {
        if ($themeConfig !== null && !is_array($themeConfig)) {
            throw new InvalidArgumentException('Theme config must be an array');
        }
    }

    private function validateLayoutConfig(?array $layoutConfig): void
    {
        if ($layoutConfig !== null && !is_array($layoutConfig)) {
            throw new InvalidArgumentException('Layout config must be an array');
        }
    }

    private function validateUsageCount(int $usageCount): void
    {
        if ($usageCount < 0) {
            throw new InvalidArgumentException('Usage count cannot be negative');
        }
    }

    private function validateRating(float $rating): void
    {
        if ($rating < 0 || $rating > 5) {
            throw new InvalidArgumentException('Rating must be between 0 and 5');
        }
    }

    private function validateMetadata(?array $metadata): void
    {
        if ($metadata !== null && !is_array($metadata)) {
            throw new InvalidArgumentException('Metadata must be an array');
        }
    }

    /**
     * Cria uma instância da entidade a partir de um array de dados (ex: vindo do repositório).
     *
     * @param array $data
     *
     * @return self
     */
    public static function fromArray(array $data): self
    {
        return new self(
            $data['name'],
            $data['user_id'],
            $data['description'] ?? null,
            $data['category'] ?? null,
            $data['difficulty'] ?? null,
            $data['icon'] ?? null,
            $data['author'] ?? null,
            $data['is_public'] ?? false,
            $data['is_system'] ?? false,
            $data['tags'] ?? null,
            $data['modules_config'] ?? null,
            $data['connections_config'] ?? null,
            $data['ai_commands'] ?? null,
            $data['theme_config'] ?? null,
            $data['layout_config'] ?? null,
            $data['usage_count'] ?? 0,
            $data['rating'] ?? 0.0,
            $data['metadata'] ?? null,
            $data['id'] ?? null,
            isset($data['created_at']) ? new DateTime($data['created_at']) : null,
            isset($data['updated_at']) ? new DateTime($data['updated_at']) : null,
            isset($data['deleted_at']) ? new DateTime($data['deleted_at']) : null,
        );
    }

    /**
     * Converte a entidade para um array.
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'category' => $this->category,
            'difficulty' => $this->difficulty,
            'icon' => $this->icon,
            'author' => $this->author,
            'is_public' => $this->isPublic,
            'is_system' => $this->isSystem,
            'tags' => $this->tags,
            'modules_config' => $this->modulesConfig,
            'connections_config' => $this->connectionsConfig,
            'ai_commands' => $this->aiCommands,
            'theme_config' => $this->themeConfig,
            'layout_config' => $this->layoutConfig,
            'usage_count' => $this->usageCount,
            'rating' => $this->rating,
            'user_id' => $this->userId,
            'metadata' => $this->metadata,
            'created_at' => $this->createdAt ? $this->createdAt->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updatedAt ? $this->updatedAt->format('Y-m-d H:i:s') : null,
            'deleted_at' => $this->deletedAt ? $this->deletedAt->format('Y-m-d H:i:s') : null,
        ];
    }

    // Domain logic methods
    public function makePublic(): void
    {
        $this->isPublic = true;
        $this->updatedAt = new DateTime();
    }

    public function makePrivate(): void
    {
        $this->isPublic = false;
        $this->updatedAt = new DateTime();
    }

    public function updateName(string $name): void
    {
        $this->validateName($name);
        $this->name = $name;
        $this->updatedAt = new DateTime();
    }

    public function updateDescription(?string $description): void
    {
        $this->validateDescription($description);
        $this->description = $description;
        $this->updatedAt = new DateTime();
    }

    public function updateCategory(?string $category): void
    {
        $this->validateCategory($category);
        $this->category = $category;
        $this->updatedAt = new DateTime();
    }

    public function updateDifficulty(?string $difficulty): void
    {
        $this->validateDifficulty($difficulty);
        $this->difficulty = $difficulty;
        $this->updatedAt = new DateTime();
    }

    public function updateIcon(?string $icon): void
    {
        $this->validateIcon($icon);
        $this->icon = $icon;
        $this->updatedAt = new DateTime();
    }

    public function updateAuthor(?string $author): void
    {
        $this->validateAuthor($author);
        $this->author = $author;
        $this->updatedAt = new DateTime();
    }

    public function addTag(string $tag): void
    {
        if ($this->tags === null) {
            $this->tags = [];
        }
        if (!in_array($tag, $this->tags)) {
            $this->tags[] = $tag;
            $this->updatedAt = new DateTime();
        }
    }

    public function removeTag(string $tag): void
    {
        if ($this->tags !== null) {
            $this->tags = array_values(array_filter($this->tags, fn($t) => $t !== $tag));
            $this->updatedAt = new DateTime();
        }
    }

    public function updateModulesConfig(array $modulesConfig): void
    {
        $this->validateModulesConfig($modulesConfig);
        $this->modulesConfig = $modulesConfig;
        $this->updatedAt = new DateTime();
    }

    public function updateConnectionsConfig(array $connectionsConfig): void
    {
        $this->validateConnectionsConfig($connectionsConfig);
        $this->connectionsConfig = $connectionsConfig;
        $this->updatedAt = new DateTime();
    }

    public function updateAiCommands(array $aiCommands): void
    {
        $this->validateAiCommands($aiCommands);
        $this->aiCommands = $aiCommands;
        $this->updatedAt = new DateTime();
    }

    public function updateThemeConfig(array $themeConfig): void
    {
        $this->validateThemeConfig($themeConfig);
        $this->themeConfig = $themeConfig;
        $this->updatedAt = new DateTime();
    }

    public function updateLayoutConfig(array $layoutConfig): void
    {
        $this->validateLayoutConfig($layoutConfig);
        $this->layoutConfig = $layoutConfig;
        $this->updatedAt = new DateTime();
    }

    public function incrementUsage(): void
    {
        $this->usageCount++;
        $this->updatedAt = new DateTime();
    }

    public function updateRating(float $rating): void
    {
        $this->validateRating($rating);
        $this->rating = $rating;
        $this->updatedAt = new DateTime();
    }

    public function updateMetadata(array $metadata): void
    {
        $this->validateMetadata($metadata);
        $this->metadata = $metadata;
        $this->updatedAt = new DateTime();
    }

    public function softDelete(): void
    {
        $this->deletedAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    public function restore(): void
    {
        $this->deletedAt = null;
        $this->updatedAt = new DateTime();
    }

    // Query methods
    public function isPublic(): bool
    {
        return $this->isPublic;
    }

    public function isSystem(): bool
    {
        return $this->isSystem;
    }

    public function isDeleted(): bool
    {
        return $this->deletedAt !== null;
    }

    public function hasCategory(): bool
    {
        return $this->category !== null;
    }

    public function hasDifficulty(): bool
    {
        return $this->difficulty !== null;
    }

    public function hasIcon(): bool
    {
        return $this->icon !== null;
    }

    public function hasAuthor(): bool
    {
        return $this->author !== null;
    }

    public function hasTags(): bool
    {
        return $this->tags !== null && !empty($this->tags);
    }

    public function hasModulesConfig(): bool
    {
        return $this->modulesConfig !== null && !empty($this->modulesConfig);
    }

    public function hasConnectionsConfig(): bool
    {
        return $this->connectionsConfig !== null && !empty($this->connectionsConfig);
    }

    public function hasAiCommands(): bool
    {
        return $this->aiCommands !== null && !empty($this->aiCommands);
    }

    public function hasThemeConfig(): bool
    {
        return $this->themeConfig !== null && !empty($this->themeConfig);
    }

    public function hasLayoutConfig(): bool
    {
        return $this->layoutConfig !== null && !empty($this->layoutConfig);
    }

    public function hasMetadata(): bool
    {
        return $this->metadata !== null && !empty($this->metadata);
    }

    public function hasTag(string $tag): bool
    {
        return $this->tags !== null && in_array($tag, $this->tags);
    }

    public function isBusiness(): bool
    {
        return $this->category === self::CATEGORY_BUSINESS;
    }

    public function isEducation(): bool
    {
        return $this->category === self::CATEGORY_EDUCATION;
    }

    public function isEntertainment(): bool
    {
        return $this->category === self::CATEGORY_ENTERTAINMENT;
    }

    public function isHealth(): bool
    {
        return $this->category === self::CATEGORY_HEALTH;
    }

    public function isTechnology(): bool
    {
        return $this->category === self::CATEGORY_TECHNOLOGY;
    }

    public function isMarketing(): bool
    {
        return $this->category === self::CATEGORY_MARKETING;
    }

    public function isProductivity(): bool
    {
        return $this->category === self::CATEGORY_PRODUCTIVITY;
    }

    public function isBeginner(): bool
    {
        return $this->difficulty === self::DIFFICULTY_BEGINNER;
    }

    public function isIntermediate(): bool
    {
        return $this->difficulty === self::DIFFICULTY_INTERMEDIATE;
    }

    public function isAdvanced(): bool
    {
        return $this->difficulty === self::DIFFICULTY_ADVANCED;
    }

    public function isExpert(): bool
    {
        return $this->difficulty === self::DIFFICULTY_EXPERT;
    }

    public function canBeDeleted(): bool
    {
        return !$this->isSystem() && !$this->isDeleted();
    }

    public function canBeRestored(): bool
    {
        return $this->isDeleted();
    }

    public function canBeMadePublic(): bool
    {
        return !$this->isPublic() && !$this->isDeleted();
    }

    public function canBeMadePrivate(): bool
    {
        return $this->isPublic() && !$this->isDeleted();
    }

    public function getTagCount(): int
    {
        return $this->tags !== null ? count($this->tags) : 0;
    }

    public function getDaysSinceCreated(): ?int
    {
        if ($this->createdAt === null) {
            return null;
        }
        return $this->createdAt->diff(new DateTime())->days;
    }

    public function getDaysSinceUpdated(): ?int
    {
        if ($this->updatedAt === null) {
            return null;
        }
        return $this->updatedAt->diff(new DateTime())->days;
    }

    public function getRatingStars(): string
    {
        $stars = '';
        $fullStars = floor($this->rating);
        $hasHalfStar = ($this->rating - $fullStars) >= 0.5;

        for ($i = 0; $i < $fullStars; $i++) {
            $stars .= '★';
        }

        if ($hasHalfStar) {
            $stars .= '☆';
        }

        $emptyStars = 5 - $fullStars - ($hasHalfStar ? 1 : 0);
        for ($i = 0; $i < $emptyStars; $i++) {
            $stars .= '☆';
        }

        return $stars;
    }

    // Static factory methods
    public static function createBusiness(string $name, int $userId, ?string $description = null): self
    {
        return new self($name, $userId, $description, self::CATEGORY_BUSINESS, self::DIFFICULTY_BEGINNER);
    }

    public static function createEducation(string $name, int $userId, ?string $description = null): self
    {
        return new self($name, $userId, $description, self::CATEGORY_EDUCATION, self::DIFFICULTY_BEGINNER);
    }

    public static function createTechnology(string $name, int $userId, ?string $description = null): self
    {
        return new self($name, $userId, $description, self::CATEGORY_TECHNOLOGY, self::DIFFICULTY_INTERMEDIATE);
    }

    public static function createMarketing(string $name, int $userId, ?string $description = null): self
    {
        return new self($name, $userId, $description, self::CATEGORY_MARKETING, self::DIFFICULTY_BEGINNER);
    }

    public static function createSystem(string $name, int $userId, ?string $description = null): self
    {
        return new self($name, $userId, $description, self::CATEGORY_OTHER, self::DIFFICULTY_BEGINNER, null, null, true, true);
    }
}
