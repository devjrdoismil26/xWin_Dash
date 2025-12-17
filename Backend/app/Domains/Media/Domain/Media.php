<?php

namespace App\Domains\Media\Domain;

use App\Domains\Media\Domain\ValueObjects\MediaStatus;
use App\Domains\Media\Domain\ValueObjects\MediaType;
use App\Domains\Media\Domain\ValueObjects\MediaVisibility;
use DateTime;
use InvalidArgumentException;

class Media
{
    public ?int $id;
    public string $name;
    public string $fileName;
    public string $mimeType;
    public string $path;
    public int $size;
    public MediaStatus $status;
    public MediaType $type;
    public MediaVisibility $visibility;
    public ?string $description;
    public ?array $metadata;
    public ?array $tags;
    public ?string $thumbnailPath;
    public ?int $width;
    public ?int $height;
    public ?int $duration;
    public ?string $hash;
    public MediaMetrics $metrics;
    public ?DateTime $lastAccessedAt;
    public ?int $folderId;
    public int $userId;
    public ?DateTime $createdAt;
    public ?DateTime $updatedAt;

    public function __construct(
        string $name,
        string $fileName,
        string $mimeType,
        string $path,
        int $size,
        int $userId,
        MediaStatus $status = null,
        MediaType $type = null,
        MediaVisibility $visibility = null,
        ?string $description = null,
        ?array $metadata = null,
        ?array $tags = null,
        ?string $thumbnailPath = null,
        ?int $width = null,
        ?int $height = null,
        ?int $duration = null,
        ?string $hash = null,
        MediaMetrics $metrics = null,
        ?DateTime $lastAccessedAt = null,
        ?int $folderId = null,
        ?int $id = null,
        ?DateTime $createdAt = null,
        ?DateTime $updatedAt = null,
    ) {
        $this->validateName($name);
        $this->validateFileName($fileName);
        $this->validateMimeType($mimeType);
        $this->validatePath($path);
        $this->validateSize($size);
        $this->validateUserId($userId);
        $this->validateDescription($description);
        $this->validateMetadata($metadata);
        $this->validateTags($tags);
        $this->validateThumbnailPath($thumbnailPath);
        $this->validateDimensions($width, $height);
        $this->validateDuration($duration);
        $this->validateHash($hash);
        $this->validateLastAccessedAt($lastAccessedAt);

        $this->id = $id;
        $this->name = $name;
        $this->fileName = $fileName;
        $this->mimeType = $mimeType;
        $this->path = $path;
        $this->size = $size;
        $this->status = $status ?? MediaStatus::uploading();
        $this->type = $type ?? MediaType::other();
        $this->visibility = $visibility ?? MediaVisibility::private();
        $this->description = $description;
        $this->metadata = $metadata;
        $this->tags = $tags;
        $this->thumbnailPath = $thumbnailPath;
        $this->width = $width;
        $this->height = $height;
        $this->duration = $duration;
        $this->hash = $hash;
        $this->metrics = $metrics ?? MediaMetrics::empty()->setSize($size)->setDimensions($width, $height)->setDuration($duration);
        $this->lastAccessedAt = $lastAccessedAt;
        $this->folderId = $folderId;
        $this->userId = $userId;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    // Validation methods
    private function validateName(string $name): void
    {
        if (empty(trim($name))) {
            throw new InvalidArgumentException('Media name cannot be empty');
        }
        if (strlen($name) > 255) {
            throw new InvalidArgumentException('Media name cannot exceed 255 characters');
        }
    }

    private function validateFileName(string $fileName): void
    {
        if (empty(trim($fileName))) {
            throw new InvalidArgumentException('File name cannot be empty');
        }
        if (strlen($fileName) > 255) {
            throw new InvalidArgumentException('File name cannot exceed 255 characters');
        }
    }

    private function validateMimeType(string $mimeType): void
    {
        if (empty(trim($mimeType))) {
            throw new InvalidArgumentException('MIME type cannot be empty');
        }
        if (!preg_match('/^[a-zA-Z0-9][a-zA-Z0-9!#$&\-\^_]*\/[a-zA-Z0-9][a-zA-Z0-9!#$&\-\^_.]*$/', $mimeType)) {
            throw new InvalidArgumentException('Invalid MIME type format');
        }
    }

    private function validatePath(string $path): void
    {
        if (empty(trim($path))) {
            throw new InvalidArgumentException('Path cannot be empty');
        }
        if (strlen($path) > 500) {
            throw new InvalidArgumentException('Path cannot exceed 500 characters');
        }
    }

    private function validateSize(int $size): void
    {
        if ($size < 0) {
            throw new InvalidArgumentException('File size cannot be negative');
        }
        if ($size > 10737418240) { // 10GB
            throw new InvalidArgumentException('File size cannot exceed 10GB');
        }
    }

    private function validateUserId(int $userId): void
    {
        if ($userId <= 0) {
            throw new InvalidArgumentException('User ID must be a positive integer');
        }
    }

    private function validateStatus(string $status): void
    {
        if (!in_array($status, [self::STATUS_UPLOADING, self::STATUS_PROCESSING, self::STATUS_READY, self::STATUS_FAILED, self::STATUS_DELETED])) {
            throw new InvalidArgumentException('Invalid media status');
        }
    }

    private function validateType(string $type): void
    {
        if (!in_array($type, [self::TYPE_IMAGE, self::TYPE_VIDEO, self::TYPE_AUDIO, self::TYPE_DOCUMENT, self::TYPE_ARCHIVE, self::TYPE_OTHER])) {
            throw new InvalidArgumentException('Invalid media type');
        }
    }

    private function validateVisibility(string $visibility): void
    {
        if (!in_array($visibility, [self::VISIBILITY_PUBLIC, self::VISIBILITY_PRIVATE, self::VISIBILITY_UNLISTED])) {
            throw new InvalidArgumentException('Invalid media visibility');
        }
    }

    private function validateDescription(?string $description): void
    {
        if ($description !== null && strlen($description) > 1000) {
            throw new InvalidArgumentException('Description cannot exceed 1000 characters');
        }
    }

    private function validateMetadata(?array $metadata): void
    {
        if ($metadata !== null && !is_array($metadata)) {
            throw new InvalidArgumentException('Metadata must be an array');
        }
    }

    private function validateTags(?array $tags): void
    {
        if ($tags !== null && !is_array($tags)) {
            throw new InvalidArgumentException('Tags must be an array');
        }
    }

    private function validateThumbnailPath(?string $thumbnailPath): void
    {
        if ($thumbnailPath !== null && strlen($thumbnailPath) > 500) {
            throw new InvalidArgumentException('Thumbnail path cannot exceed 500 characters');
        }
    }

    private function validateDimensions(?int $width, ?int $height): void
    {
        if ($width !== null && $width < 0) {
            throw new InvalidArgumentException('Width cannot be negative');
        }
        if ($height !== null && $height < 0) {
            throw new InvalidArgumentException('Height cannot be negative');
        }
    }

    private function validateDuration(?int $duration): void
    {
        if ($duration !== null && $duration < 0) {
            throw new InvalidArgumentException('Duration cannot be negative');
        }
    }

    private function validateHash(?string $hash): void
    {
        if ($hash !== null && !preg_match('/^[a-f0-9]{32,64}$/', $hash)) {
            throw new InvalidArgumentException('Invalid hash format');
        }
    }

    private function validateDownloadCount(?int $downloadCount): void
    {
        if ($downloadCount !== null && $downloadCount < 0) {
            throw new InvalidArgumentException('Download count cannot be negative');
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
            $data['file_name'],
            $data['mime_type'],
            $data['path'],
            $data['size'],
            $data['user_id'],
            $data['status'] ?? self::STATUS_UPLOADING,
            $data['type'] ?? self::TYPE_OTHER,
            $data['visibility'] ?? self::VISIBILITY_PRIVATE,
            $data['description'] ?? null,
            $data['metadata'] ?? null,
            $data['tags'] ?? null,
            $data['thumbnail_path'] ?? null,
            $data['width'] ?? null,
            $data['height'] ?? null,
            $data['duration'] ?? null,
            $data['hash'] ?? null,
            $data['download_count'] ?? null,
            isset($data['last_accessed_at']) ? new DateTime($data['last_accessed_at']) : null,
            $data['folder_id'] ?? null,
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
            'file_name' => $this->fileName,
            'mime_type' => $this->mimeType,
            'path' => $this->path,
            'size' => $this->size,
            'status' => $this->status,
            'type' => $this->type,
            'visibility' => $this->visibility,
            'description' => $this->description,
            'metadata' => $this->metadata,
            'tags' => $this->tags,
            'thumbnail_path' => $this->thumbnailPath,
            'width' => $this->width,
            'height' => $this->height,
            'duration' => $this->duration,
            'hash' => $this->hash,
            'metrics' => $this->metrics->toArray(),
            'last_accessed_at' => $this->lastAccessedAt ? $this->lastAccessedAt->format('Y-m-d H:i:s') : null,
            'folder_id' => $this->folderId,
            'user_id' => $this->userId,
            'created_at' => $this->createdAt ? $this->createdAt->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updatedAt ? $this->updatedAt->format('Y-m-d H:i:s') : null,
        ];
    }

    // Domain logic methods
    public function markAsProcessing(): void
    {
        if (!$this->status->canBeProcessed()) {
            throw new InvalidArgumentException('Only uploading media can be marked as processing');
        }
        $this->status = MediaStatus::processing();
        $this->updatedAt = new DateTime();
    }

    public function markAsReady(): void
    {
        if (!$this->status->canBeMarkedAsReady()) {
            throw new InvalidArgumentException('Only processing media can be marked as ready');
        }
        $this->status = MediaStatus::ready();
        $this->updatedAt = new DateTime();
    }

    public function markAsFailed(): void
    {
        if (!$this->status->canBeMarkedAsFailed()) {
            throw new InvalidArgumentException('Only uploading or processing media can be marked as failed');
        }
        $this->status = MediaStatus::failed();
        $this->updatedAt = new DateTime();
    }

    public function markAsDeleted(): void
    {
        $this->status = MediaStatus::deleted();
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

    public function updateVisibility(MediaVisibility $visibility): void
    {
        $this->visibility = $visibility;
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

    public function updateThumbnailPath(?string $thumbnailPath): void
    {
        $this->validateThumbnailPath($thumbnailPath);
        $this->thumbnailPath = $thumbnailPath;
        $this->updatedAt = new DateTime();
    }

    public function updateDimensions(?int $width, ?int $height): void
    {
        $this->validateDimensions($width, $height);
        $this->width = $width;
        $this->height = $height;
        $this->updatedAt = new DateTime();
    }

    public function updateDuration(?int $duration): void
    {
        $this->validateDuration($duration);
        $this->duration = $duration;
        $this->updatedAt = new DateTime();
    }

    public function updateHash(string $hash): void
    {
        $this->validateHash($hash);
        $this->hash = $hash;
        $this->updatedAt = new DateTime();
    }

    public function incrementDownloadCount(): void
    {
        $this->metrics = $this->metrics->incrementDownloadCount();
        $this->lastAccessedAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    public function moveToFolder(?int $folderId): void
    {
        $this->folderId = $folderId;
        $this->updatedAt = new DateTime();
    }

    public function markAsAccessed(): void
    {
        $this->lastAccessedAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    // Query methods
    public function isUploading(): bool
    {
        return $this->status->isUploading();
    }

    public function isProcessing(): bool
    {
        return $this->status->isProcessing();
    }

    public function isReady(): bool
    {
        return $this->status->isReady();
    }

    public function isFailed(): bool
    {
        return $this->status->isFailed();
    }

    public function isDeleted(): bool
    {
        return $this->status->isDeleted();
    }

    public function isImage(): bool
    {
        return $this->type->isImage();
    }

    public function isVideo(): bool
    {
        return $this->type->isVideo();
    }

    public function isAudio(): bool
    {
        return $this->type->isAudio();
    }

    public function isDocument(): bool
    {
        return $this->type->isDocument();
    }

    public function isArchive(): bool
    {
        return $this->type->isArchive();
    }

    public function isPublic(): bool
    {
        return $this->visibility->isPublic();
    }

    public function isPrivate(): bool
    {
        return $this->visibility->isPrivate();
    }

    public function isUnlisted(): bool
    {
        return $this->visibility->isUnlisted();
    }

    public function hasTag(string $tag): bool
    {
        return $this->tags !== null && in_array($tag, $this->tags);
    }

    public function hasThumbnail(): bool
    {
        return $this->thumbnailPath !== null;
    }

    public function hasMetadata(): bool
    {
        return $this->metadata !== null && !empty($this->metadata);
    }

    public function getMetadata(string $key)
    {
        return $this->metadata[$key] ?? null;
    }

    public function getSizeInMB(): float
    {
        return $this->metrics->getSizeInMB();
    }

    public function getSizeInGB(): float
    {
        return $this->metrics->getSizeInGB();
    }

    public function getFormattedSize(): string
    {
        return $this->metrics->getFormattedSize();
    }

    public function getAspectRatio(): ?float
    {
        return $this->metrics->getAspectRatio();
    }

    public function getDurationInSeconds(): ?int
    {
        return $this->metrics->getDurationInSeconds();
    }

    public function getDurationFormatted(): ?string
    {
        return $this->metrics->getDurationFormatted();
    }

    public function getDownloadCount(): int
    {
        return $this->metrics->getDownloadCount();
    }

    public function canBeDownloaded(): bool
    {
        return $this->status->canBeDownloaded();
    }

    public function canBeViewed(): bool
    {
        return $this->status->canBeViewed();
    }

    public function canBeEdited(): bool
    {
        return $this->status->canBeEdited();
    }

    public function canBeDeleted(): bool
    {
        return $this->status->canBeDeleted();
    }

    // Static factory methods
    public static function createImage(string $name, string $fileName, string $mimeType, string $path, int $size, int $userId, ?int $width = null, ?int $height = null, ?int $folderId = null): self
    {
        return new self($name, $fileName, $mimeType, $path, $size, $userId, MediaStatus::uploading(), MediaType::image(), MediaVisibility::private(), null, null, null, null, $width, $height, null, null, null, null, $folderId);
    }

    public static function createVideo(string $name, string $fileName, string $mimeType, string $path, int $size, int $userId, ?int $width = null, ?int $height = null, ?int $duration = null, ?int $folderId = null): self
    {
        return new self($name, $fileName, $mimeType, $path, $size, $userId, MediaStatus::uploading(), MediaType::video(), MediaVisibility::private(), null, null, null, null, $width, $height, $duration, null, null, null, $folderId);
    }

    public static function createAudio(string $name, string $fileName, string $mimeType, string $path, int $size, int $userId, ?int $duration = null, ?int $folderId = null): self
    {
        return new self($name, $fileName, $mimeType, $path, $size, $userId, MediaStatus::uploading(), MediaType::audio(), MediaVisibility::private(), null, null, null, null, null, null, $duration, null, null, null, $folderId);
    }

    public static function createDocument(string $name, string $fileName, string $mimeType, string $path, int $size, int $userId, ?int $folderId = null): self
    {
        return new self($name, $fileName, $mimeType, $path, $size, $userId, MediaStatus::uploading(), MediaType::document(), MediaVisibility::private(), null, null, null, null, null, null, null, null, null, null, $folderId);
    }
}
