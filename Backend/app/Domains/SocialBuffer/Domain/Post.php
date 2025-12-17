<?php

namespace App\Domains\SocialBuffer\Domain;

use App\Domains\SocialBuffer\Domain\ValueObjects\PostStatus;
use App\Domains\SocialBuffer\Domain\ValueObjects\PostType;
use App\Domains\SocialBuffer\Domain\ValueObjects\PostPriority;
use App\Domains\SocialBuffer\Domain\ValueObjects\PostMetrics;
use DateTime;
use InvalidArgumentException;

class Post
{
    public ?int $id;
    public string $content;
    public PostStatus $status;
    public PostType $type;
    public PostPriority $priority;
    public ?string $title;
    public ?string $description;
    public ?string $linkUrl;
    public ?string $linkTitle;
    public ?string $linkDescription;
    public ?string $linkImage;
    public ?DateTime $scheduledAt;
    public ?DateTime $publishedAt;
    public ?DateTime $failedAt;
    public int $userId;
    public array $socialAccountIds;
    public array $mediaUrls;
    public ?array $hashtags;
    public ?array $mentions;
    public ?array $location;
    public ?array $metadata;
    public PostMetrics $metrics;
    public ?int $retryCount;
    public ?string $errorMessage;
    public ?array $customFields;
    public ?DateTime $createdAt;
    public ?DateTime $updatedAt;

    public function __construct(
        string $content,
        PostStatus $status,
        int $userId,
        PostType $type = null,
        PostPriority $priority = null,
        ?string $title = null,
        ?string $description = null,
        ?string $linkUrl = null,
        ?string $linkTitle = null,
        ?string $linkDescription = null,
        ?string $linkImage = null,
        ?DateTime $scheduledAt = null,
        ?DateTime $publishedAt = null,
        ?DateTime $failedAt = null,
        array $socialAccountIds = [],
        array $mediaUrls = [],
        ?array $hashtags = null,
        ?array $mentions = null,
        ?array $location = null,
        ?array $metadata = null,
        ?PostMetrics $metrics = null,
        ?int $retryCount = null,
        ?string $errorMessage = null,
        ?array $customFields = null,
        ?int $id = null,
        ?DateTime $createdAt = null,
        ?DateTime $updatedAt = null,
    ) {
        $this->validateContent($content);
        $this->validateUserId($userId);
        $this->validateTitle($title);
        $this->validateDescription($description);
        $this->validateLinkUrl($linkUrl);
        $this->validateLinkTitle($linkTitle);
        $this->validateLinkDescription($linkDescription);
        $this->validateLinkImage($linkImage);
        $this->validateScheduledAt($scheduledAt);
        $this->validatePublishedAt($publishedAt);
        $this->validateFailedAt($failedAt);
        $this->validateSocialAccountIds($socialAccountIds);
        $this->validateMediaUrls($mediaUrls);
        $this->validateHashtags($hashtags);
        $this->validateMentions($mentions);
        $this->validateLocation($location);
        $this->validateMetadata($metadata);
        $this->validateRetryCount($retryCount);
        $this->validateErrorMessage($errorMessage);
        $this->validateCustomFields($customFields);

        $this->id = $id;
        $this->content = $content;
        $this->status = $status;
        $this->type = $type ?? PostType::text();
        $this->priority = $priority ?? PostPriority::medium();
        $this->title = $title;
        $this->description = $description;
        $this->linkUrl = $linkUrl;
        $this->linkTitle = $linkTitle;
        $this->linkDescription = $linkDescription;
        $this->linkImage = $linkImage;
        $this->scheduledAt = $scheduledAt;
        $this->publishedAt = $publishedAt;
        $this->failedAt = $failedAt;
        $this->userId = $userId;
        $this->socialAccountIds = $socialAccountIds;
        $this->mediaUrls = $mediaUrls;
        $this->hashtags = $hashtags;
        $this->mentions = $mentions;
        $this->location = $location;
        $this->metadata = $metadata;
        $this->metrics = $metrics ?? PostMetrics::empty();
        $this->retryCount = $retryCount;
        $this->errorMessage = $errorMessage;
        $this->customFields = $customFields;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    // Business logic methods
    public function canBeEdited(): bool
    {
        return $this->status->canBeEdited();
    }

    public function canBePublished(): bool
    {
        return $this->status->canBePublished();
    }

    public function canBeCancelled(): bool
    {
        return $this->status->canBeCancelled();
    }

    public function canBeRetried(): bool
    {
        return $this->status->canBeRetried();
    }

    public function isActive(): bool
    {
        return $this->status->isActive();
    }

    public function isCompleted(): bool
    {
        return $this->status->isCompleted();
    }

    public function requiresMedia(): bool
    {
        return $this->type->requiresMedia();
    }

    public function supportsHashtags(): bool
    {
        return $this->type->supportsHashtags();
    }

    public function supportsMentions(): bool
    {
        return $this->type->supportsMentions();
    }

    public function supportsLocation(): bool
    {
        return $this->type->supportsLocation();
    }

    public function getMaxContentLength(): int
    {
        return $this->type->getMaxContentLength();
    }

    public function getMaxMediaCount(): int
    {
        return $this->type->getMaxMediaCount();
    }

    public function isHighPriority(): bool
    {
        return $this->priority->isHigh() || $this->priority->isUrgent();
    }

    public function isLowPriority(): bool
    {
        return $this->priority->isLow();
    }

    public function getPriorityWeight(): int
    {
        return $this->priority->getWeight();
    }

    public function isScheduled(): bool
    {
        return $this->status->isScheduled() && $this->scheduledAt !== null;
    }

    public function isOverdue(): bool
    {
        return $this->isScheduled() && $this->scheduledAt < new DateTime();
    }

    public function getTimeUntilScheduled(): ?int
    {
        if (!$this->isScheduled()) {
            return null;
        }
        return $this->scheduledAt->getTimestamp() - time();
    }

    public function hasMedia(): bool
    {
        return !empty($this->mediaUrls);
    }

    public function getMediaCount(): int
    {
        return count($this->mediaUrls);
    }

    public function hasHashtags(): bool
    {
        return !empty($this->hashtags);
    }

    public function getHashtagCount(): int
    {
        return $this->hashtags ? count($this->hashtags) : 0;
    }

    public function hasMentions(): bool
    {
        return !empty($this->mentions);
    }

    public function getMentionCount(): int
    {
        return $this->mentions ? count($this->mentions) : 0;
    }

    public function hasLocation(): bool
    {
        return !empty($this->location);
    }

    public function hasCustomFields(): bool
    {
        return !empty($this->customFields);
    }

    public function getCustomField(string $key): mixed
    {
        return $this->customFields[$key] ?? null;
    }

    public function setCustomField(string $key, mixed $value): void
    {
        if ($this->customFields === null) {
            $this->customFields = [];
        }
        $this->customFields[$key] = $value;
    }

    public function removeCustomField(string $key): void
    {
        if ($this->customFields !== null) {
            unset($this->customFields[$key]);
        }
    }

    public function getTotalEngagement(): int
    {
        return $this->metrics->getTotalEngagement();
    }

    public function getEngagementRate(): float
    {
        return $this->metrics->getEngagementRate();
    }

    public function getClickThroughRate(): float
    {
        return $this->metrics->getClickThroughRate();
    }

    public function isHighEngagement(): bool
    {
        return $this->metrics->isHighEngagement();
    }

    public function isViral(): bool
    {
        return $this->metrics->isViral();
    }

    public function getPerformanceScore(): int
    {
        return $this->metrics->getPerformanceScore();
    }

    public function getPerformanceLevel(): string
    {
        return $this->metrics->getPerformanceLevel();
    }

    public function updateMetrics(PostMetrics $metrics): void
    {
        $this->metrics = $metrics;
    }

    public function incrementRetryCount(): void
    {
        $this->retryCount = ($this->retryCount ?? 0) + 1;
    }

    public function resetRetryCount(): void
    {
        $this->retryCount = 0;
    }

    public function setError(string $errorMessage): void
    {
        $this->errorMessage = $errorMessage;
        $this->status = PostStatus::failed();
        $this->failedAt = new DateTime();
    }

    public function clearError(): void
    {
        $this->errorMessage = null;
        $this->failedAt = null;
    }

    public function markAsPublished(): void
    {
        $this->status = PostStatus::published();
        $this->publishedAt = new DateTime();
        $this->clearError();
    }

    public function markAsScheduled(DateTime $scheduledAt): void
    {
        $this->status = PostStatus::scheduled();
        $this->scheduledAt = $scheduledAt;
        $this->clearError();
    }

    public function markAsPublishing(): void
    {
        $this->status = PostStatus::publishing();
    }

    public function markAsCancelled(): void
    {
        $this->status = PostStatus::cancelled();
    }

    public function markAsDraft(): void
    {
        $this->status = PostStatus::draft();
        $this->scheduledAt = null;
        $this->clearError();
    }

    // Validation methods
    private function validateContent(string $content): void
    {
        if (empty(trim($content))) {
            throw new InvalidArgumentException('Post content cannot be empty');
        }
    }

    private function validateUserId(int $userId): void
    {
        if ($userId <= 0) {
            throw new InvalidArgumentException('User ID must be positive');
        }
    }

    private function validateTitle(?string $title): void
    {
        if ($title !== null && empty(trim($title))) {
            throw new InvalidArgumentException('Post title cannot be empty');
        }
    }

    private function validateDescription(?string $description): void
    {
        if ($description !== null && empty(trim($description))) {
            throw new InvalidArgumentException('Post description cannot be empty');
        }
    }

    private function validateLinkUrl(?string $linkUrl): void
    {
        if ($linkUrl !== null && !filter_var($linkUrl, FILTER_VALIDATE_URL)) {
            throw new InvalidArgumentException('Invalid link URL format');
        }
    }

    private function validateLinkTitle(?string $linkTitle): void
    {
        if ($linkTitle !== null && empty(trim($linkTitle))) {
            throw new InvalidArgumentException('Link title cannot be empty');
        }
    }

    private function validateLinkDescription(?string $linkDescription): void
    {
        if ($linkDescription !== null && empty(trim($linkDescription))) {
            throw new InvalidArgumentException('Link description cannot be empty');
        }
    }

    private function validateLinkImage(?string $linkImage): void
    {
        if ($linkImage !== null && !filter_var($linkImage, FILTER_VALIDATE_URL)) {
            throw new InvalidArgumentException('Invalid link image URL format');
        }
    }

    private function validateScheduledAt(?DateTime $scheduledAt): void
    {
        if ($scheduledAt !== null && $scheduledAt < new DateTime()) {
            throw new InvalidArgumentException('Scheduled date cannot be in the past');
        }
    }

    private function validatePublishedAt(?DateTime $publishedAt): void
    {
        if ($publishedAt !== null && $publishedAt > new DateTime()) {
            throw new InvalidArgumentException('Published date cannot be in the future');
        }
    }

    private function validateFailedAt(?DateTime $failedAt): void
    {
        if ($failedAt !== null && $failedAt > new DateTime()) {
            throw new InvalidArgumentException('Failed date cannot be in the future');
        }
    }

    private function validateSocialAccountIds(array $socialAccountIds): void
    {
        foreach ($socialAccountIds as $accountId) {
            if (!is_int($accountId) || $accountId <= 0) {
                throw new InvalidArgumentException('Invalid social account ID');
            }
        }
    }

    private function validateMediaUrls(array $mediaUrls): void
    {
        foreach ($mediaUrls as $url) {
            if (!is_string($url) || !filter_var($url, FILTER_VALIDATE_URL)) {
                throw new InvalidArgumentException('Invalid media URL format');
            }
        }
    }

    private function validateHashtags(?array $hashtags): void
    {
        if ($hashtags !== null) {
            foreach ($hashtags as $hashtag) {
                if (!is_string($hashtag) || empty(trim($hashtag))) {
                    throw new InvalidArgumentException('Invalid hashtag format');
                }
            }
        }
    }

    private function validateMentions(?array $mentions): void
    {
        if ($mentions !== null) {
            foreach ($mentions as $mention) {
                if (!is_string($mention) || empty(trim($mention))) {
                    throw new InvalidArgumentException('Invalid mention format');
                }
            }
        }
    }

    private function validateLocation(?array $location): void
    {
        if ($location !== null) {
            $requiredFields = ['name', 'latitude', 'longitude'];
            foreach ($requiredFields as $field) {
                if (!isset($location[$field])) {
                    throw new InvalidArgumentException("Location must have {$field}");
                }
            }
        }
    }

    private function validateMetadata(?array $metadata): void
    {
        if ($metadata !== null && !is_array($metadata)) {
            throw new InvalidArgumentException('Metadata must be an array');
        }
    }

    private function validateRetryCount(?int $retryCount): void
    {
        if ($retryCount !== null && $retryCount < 0) {
            throw new InvalidArgumentException('Retry count cannot be negative');
        }
    }

    private function validateErrorMessage(?string $errorMessage): void
    {
        if ($errorMessage !== null && empty(trim($errorMessage))) {
            throw new InvalidArgumentException('Error message cannot be empty');
        }
    }

    private function validateCustomFields(?array $customFields): void
    {
        if ($customFields !== null && !is_array($customFields)) {
            throw new InvalidArgumentException('Custom fields must be an array');
        }
    }

    // Static factory methods
    public static function createTextPost(string $content, int $userId, array $socialAccountIds = []): self
    {
        return new self(
            $content,
            PostStatus::draft(),
            $userId,
            PostType::text(),
            PostPriority::medium(),
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            $socialAccountIds
        );
    }

    public static function createImagePost(string $content, int $userId, array $mediaUrls, array $socialAccountIds = []): self
    {
        return new self(
            $content,
            PostStatus::draft(),
            $userId,
            PostType::image(),
            PostPriority::medium(),
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            $socialAccountIds,
            $mediaUrls
        );
    }

    public static function createVideoPost(string $content, int $userId, array $mediaUrls, array $socialAccountIds = []): self
    {
        return new self(
            $content,
            PostStatus::draft(),
            $userId,
            PostType::video(),
            PostPriority::medium(),
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            $socialAccountIds,
            $mediaUrls
        );
    }

    public static function createLinkPost(string $content, int $userId, string $linkUrl, ?string $linkTitle = null, ?string $linkDescription = null, ?string $linkImage = null, array $socialAccountIds = []): self
    {
        return new self(
            $content,
            PostStatus::draft(),
            $userId,
            PostType::link(),
            PostPriority::medium(),
            null,
            null,
            $linkUrl,
            $linkTitle,
            $linkDescription,
            $linkImage,
            null,
            null,
            null,
            $socialAccountIds
        );
    }

    public static function createStoryPost(string $content, int $userId, array $mediaUrls, array $socialAccountIds = []): self
    {
        return new self(
            $content,
            PostStatus::draft(),
            $userId,
            PostType::story(),
            PostPriority::medium(),
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            $socialAccountIds,
            $mediaUrls
        );
    }

    public static function createReelPost(string $content, int $userId, array $mediaUrls, array $socialAccountIds = []): self
    {
        return new self(
            $content,
            PostStatus::draft(),
            $userId,
            PostType::reel(),
            PostPriority::medium(),
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            $socialAccountIds,
            $mediaUrls
        );
    }

    public static function createCarouselPost(string $content, int $userId, array $mediaUrls, array $socialAccountIds = []): self
    {
        return new self(
            $content,
            PostStatus::draft(),
            $userId,
            PostType::carousel(),
            PostPriority::medium(),
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            $socialAccountIds,
            $mediaUrls
        );
    }
}
