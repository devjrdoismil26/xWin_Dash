<?php

namespace App\Domains\Media\Domain;

use App\Domains\Media\Domain\ValueObjects\FolderStatus;
use App\Domains\Media\Domain\ValueObjects\FolderType;
use App\Domains\Media\Domain\ValueObjects\FolderMetrics;
use DateTime;
use InvalidArgumentException;

class Folder
{
    public ?int $id;
    public string $name;
    public ?string $description;
    public FolderStatus $status;
    public FolderType $type;
    public ?int $parentId;
    public int $userId;
    public ?string $slug;
    public ?array $tags;
    public ?array $metadata;
    public FolderMetrics $metrics;
    public ?DateTime $lastAccessedAt;
    public ?DateTime $createdAt;
    public ?DateTime $updatedAt;

    public function __construct(
        string $name,
        int $userId,
        ?int $parentId = null,
        FolderStatus $status = null,
        FolderType $type = null,
        ?string $description = null,
        ?string $slug = null,
        ?array $tags = null,
        ?array $metadata = null,
        FolderMetrics $metrics = null,
        ?DateTime $lastAccessedAt = null,
        ?int $id = null,
        ?DateTime $createdAt = null,
        ?DateTime $updatedAt = null,
    ) {
        $this->validateName($name);
        $this->validateUserId($userId);
        $this->validateDescription($description);
        $this->validateSlug($slug);
        $this->validateTags($tags);
        $this->validateMetadata($metadata);
        $this->validateLastAccessedAt($lastAccessedAt);

        $this->id = $id;
        $this->name = $name;
        $this->description = $description;
        $this->status = $status ?? FolderStatus::active();
        $this->type = $type ?? FolderType::folder();
        $this->parentId = $parentId;
        $this->userId = $userId;
        $this->slug = $slug;
        $this->tags = $tags;
        $this->metadata = $metadata;
        $this->metrics = $metrics ?? FolderMetrics::empty();
        $this->lastAccessedAt = $lastAccessedAt;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    // Validation methods
    private function validateName(string $name): void
    {
        if (empty(trim($name))) {
            throw new InvalidArgumentException('Folder name cannot be empty');
        }
        if (strlen($name) > 255) {
            throw new InvalidArgumentException('Folder name cannot exceed 255 characters');
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

    private function validateSlug(?string $slug): void
    {
        if ($slug !== null && !preg_match('/^[a-z0-9-]+$/', $slug)) {
            throw new InvalidArgumentException('Slug must contain only lowercase letters, numbers, and hyphens');
        }
    }

    private function validateTags(?array $tags): void
    {
        if ($tags !== null && !is_array($tags)) {
            throw new InvalidArgumentException('Tags must be an array');
        }
    }

    private function validateMetadata(?array $metadata): void
    {
        if ($metadata !== null && !is_array($metadata)) {
            throw new InvalidArgumentException('Metadata must be an array');
        }
    }


    private function validateLastAccessedAt(?DateTime $lastAccessedAt): void
    {
        if ($lastAccessedAt !== null && $lastAccessedAt > new DateTime()) {
            throw new InvalidArgumentException('Last accessed date cannot be in the future');
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
            $data['parent_id'] ?? null,
            $data['status'] ?? self::STATUS_ACTIVE,
            $data['type'] ?? self::TYPE_FOLDER,
            $data['description'] ?? null,
            $data['slug'] ?? null,
            $data['tags'] ?? null,
            $data['metadata'] ?? null,
            $data['media_count'] ?? null,
            $data['subfolder_count'] ?? null,
            isset($data['last_accessed_at']) ? new DateTime($data['last_accessed_at']) : null,
            $data['id'] ?? null,
            isset($data['created_at']) ? new DateTime($data['created_at']) : null,
            isset($data['updated_at']) ? new DateTime($data['updated_at']) : null,
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
            'status' => $this->status,
            'type' => $this->type,
            'parent_id' => $this->parentId,
            'user_id' => $this->userId,
            'slug' => $this->slug,
            'tags' => $this->tags,
            'metadata' => $this->metadata,
            'metrics' => $this->metrics->toArray(),
            'last_accessed_at' => $this->lastAccessedAt ? $this->lastAccessedAt->format('Y-m-d H:i:s') : null,
            'created_at' => $this->createdAt ? $this->createdAt->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updatedAt ? $this->updatedAt->format('Y-m-d H:i:s') : null,
        ];
    }

    // Domain logic methods
    public function archive(): void
    {
        if (!$this->status->canBeArchived()) {
            throw new InvalidArgumentException('Cannot archive a deleted folder');
        }
        $this->status = FolderStatus::archived();
        $this->updatedAt = new DateTime();
    }

    public function restore(): void
    {
        if (!$this->status->canBeRestored()) {
            throw new InvalidArgumentException('Cannot restore a deleted folder');
        }
        $this->status = FolderStatus::active();
        $this->updatedAt = new DateTime();
    }

    public function markAsDeleted(): void
    {
        $this->status = FolderStatus::deleted();
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

    public function updateSlug(?string $slug): void
    {
        $this->validateSlug($slug);
        $this->slug = $slug;
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

    public function updateMetadata(array $metadata): void
    {
        $this->validateMetadata($metadata);
        $this->metadata = $metadata;
        $this->updatedAt = new DateTime();
    }

    public function updateMediaCount(int $count): void
    {
        $this->metrics = $this->metrics->setMediaCount($count);
        $this->updatedAt = new DateTime();
    }

    public function updateSubfolderCount(int $count): void
    {
        $this->metrics = $this->metrics->setSubfolderCount($count);
        $this->updatedAt = new DateTime();
    }

    public function incrementMediaCount(): void
    {
        $this->metrics = $this->metrics->incrementMediaCount();
        $this->lastAccessedAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    public function decrementMediaCount(): void
    {
        $this->metrics = $this->metrics->decrementMediaCount();
        $this->updatedAt = new DateTime();
    }

    public function incrementSubfolderCount(): void
    {
        $this->metrics = $this->metrics->incrementSubfolderCount();
        $this->updatedAt = new DateTime();
    }

    public function decrementSubfolderCount(): void
    {
        $this->metrics = $this->metrics->decrementSubfolderCount();
        $this->updatedAt = new DateTime();
    }

    public function moveToParent(?int $parentId): void
    {
        $this->parentId = $parentId;
        $this->updatedAt = new DateTime();
    }

    public function markAsAccessed(): void
    {
        $this->lastAccessedAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    // Query methods
    public function isActive(): bool
    {
        return $this->status->isActive();
    }

    public function isArchived(): bool
    {
        return $this->status->isArchived();
    }

    public function isDeleted(): bool
    {
        return $this->status->isDeleted();
    }

    public function isFolder(): bool
    {
        return $this->type->isFolder();
    }

    public function isCollection(): bool
    {
        return $this->type->isCollection();
    }

    public function isGallery(): bool
    {
        return $this->type->isGallery();
    }

    public function isRoot(): bool
    {
        return $this->parentId === null;
    }

    public function hasParent(): bool
    {
        return $this->parentId !== null;
    }

    public function hasTag(string $tag): bool
    {
        return $this->tags !== null && in_array($tag, $this->tags);
    }

    public function hasMetadata(): bool
    {
        return $this->metadata !== null && !empty($this->metadata);
    }

    public function getMetadata(string $key)
    {
        return $this->metadata[$key] ?? null;
    }

    public function getMediaCount(): int
    {
        return $this->metrics->getMediaCount();
    }

    public function getSubfolderCount(): int
    {
        return $this->metrics->getSubfolderCount();
    }

    public function getTotalItems(): int
    {
        return $this->metrics->getTotalItems();
    }

    public function isEmpty(): bool
    {
        return $this->metrics->isEmpty();
    }

    public function canBeDeleted(): bool
    {
        return !$this->isDeleted() && $this->isEmpty();
    }

    public function canBeArchived(): bool
    {
        return $this->isActive();
    }

    public function canBeRestored(): bool
    {
        return $this->isArchived();
    }

    // Static factory methods
    public static function createFolder(string $name, int $userId, ?int $parentId = null): self
    {
        return new self($name, $userId, $parentId, FolderStatus::active(), FolderType::folder());
    }

    public static function createCollection(string $name, int $userId, ?int $parentId = null): self
    {
        return new self($name, $userId, $parentId, FolderStatus::active(), FolderType::collection());
    }

    public static function createGallery(string $name, int $userId, ?int $parentId = null): self
    {
        return new self($name, $userId, $parentId, FolderStatus::active(), FolderType::gallery());
    }
}
