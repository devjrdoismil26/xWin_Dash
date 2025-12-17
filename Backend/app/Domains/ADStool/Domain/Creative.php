<?php

namespace App\Domains\ADStool\Domain;

use DateTime;
use InvalidArgumentException;

class Creative
{
    // Status constants
    public const STATUS_DRAFT = 'draft';
    public const STATUS_ACTIVE = 'active';
    public const STATUS_PAUSED = 'paused';
    public const STATUS_ARCHIVED = 'archived';

    // Type constants
    public const TYPE_IMAGE = 'image';
    public const TYPE_VIDEO = 'video';
    public const TYPE_CAROUSEL = 'carousel';
    public const TYPE_SLIDESHOW = 'slideshow';
    public const TYPE_COLLECTION = 'collection';

    // Format constants
    public const FORMAT_SQUARE = 'square';
    public const FORMAT_LANDSCAPE = 'landscape';
    public const FORMAT_PORTRAIT = 'portrait';
    public const FORMAT_STORY = 'story';

    public ?int $id;
    public int $userId;
    public int $campaignId;
    public string $name;
    public string $type;
    public string $format;
    public string $headline;
    public string $description;
    public string $callToAction;
    public array $mediaUrls;
    public array $targetingData;
    public ?string $status;
    public ?string $platformCreativeId;
    public ?string $platformStatus;
    public ?string $errorMessage;
    public ?DateTime $createdAt;
    public ?DateTime $updatedAt;

    public function __construct(
        int $userId,
        int $campaignId,
        string $name,
        string $type,
        string $format,
        string $headline,
        string $description,
        string $callToAction,
        array $mediaUrls = [],
        array $targetingData = [],
        ?string $status = null,
        ?string $platformCreativeId = null,
        ?string $platformStatus = null,
        ?string $errorMessage = null,
        ?int $id = null,
        ?DateTime $createdAt = null,
        ?DateTime $updatedAt = null,
    ) {
        $this->validateUserId($userId);
        $this->validateCampaignId($campaignId);
        $this->validateName($name);
        $this->validateType($type);
        $this->validateFormat($format);
        $this->validateHeadline($headline);
        $this->validateDescription($description);
        $this->validateCallToAction($callToAction);
        $this->validateMediaUrls($mediaUrls);

        $this->id = $id;
        $this->userId = $userId;
        $this->campaignId = $campaignId;
        $this->name = $name;
        $this->type = $type;
        $this->format = $format;
        $this->headline = $headline;
        $this->description = $description;
        $this->callToAction = $callToAction;
        $this->mediaUrls = $mediaUrls;
        $this->targetingData = $targetingData;
        $this->status = $status ?? self::STATUS_DRAFT;
        $this->platformCreativeId = $platformCreativeId;
        $this->platformStatus = $platformStatus;
        $this->errorMessage = $errorMessage;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    /**
     * @param array<string, mixed> $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            userId: (int) $data['user_id'],
            campaignId: (int) $data['campaign_id'],
            name: $data['name'],
            type: $data['type'],
            format: $data['format'],
            headline: $data['headline'],
            description: $data['description'],
            callToAction: $data['call_to_action'],
            mediaUrls: $data['media_urls'] ?? [],
            targetingData: $data['targeting_data'] ?? [],
            status: $data['status'] ?? null,
            platformCreativeId: $data['platform_creative_id'] ?? null,
            platformStatus: $data['platform_status'] ?? null,
            errorMessage: $data['error_message'] ?? null,
            id: isset($data['id']) ? (int) $data['id'] : null,
            createdAt: isset($data['created_at']) ? new DateTime($data['created_at']) : null,
            updatedAt: isset($data['updated_at']) ? new DateTime($data['updated_at']) : null,
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->userId,
            'campaign_id' => $this->campaignId,
            'name' => $this->name,
            'type' => $this->type,
            'format' => $this->format,
            'headline' => $this->headline,
            'description' => $this->description,
            'call_to_action' => $this->callToAction,
            'media_urls' => $this->mediaUrls,
            'targeting_data' => $this->targetingData,
            'status' => $this->status,
            'platform_creative_id' => $this->platformCreativeId,
            'platform_status' => $this->platformStatus,
            'error_message' => $this->errorMessage,
            'created_at' => $this->createdAt?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updatedAt?->format('Y-m-d H:i:s'),
        ];
    }

    // ===== VALIDATION METHODS =====

    private function validateUserId(int $userId): void
    {
        if ($userId <= 0) {
            throw new InvalidArgumentException('User ID must be a positive integer');
        }
    }

    private function validateCampaignId(int $campaignId): void
    {
        if ($campaignId <= 0) {
            throw new InvalidArgumentException('Campaign ID must be a positive integer');
        }
    }

    private function validateName(string $name): void
    {
        if (empty(trim($name))) {
            throw new InvalidArgumentException('Creative name cannot be empty');
        }

        if (strlen($name) > 255) {
            throw new InvalidArgumentException('Creative name cannot exceed 255 characters');
        }
    }

    private function validateType(string $type): void
    {
        $validTypes = [
            self::TYPE_IMAGE,
            self::TYPE_VIDEO,
            self::TYPE_CAROUSEL,
            self::TYPE_SLIDESHOW,
            self::TYPE_COLLECTION,
        ];

        if (!in_array($type, $validTypes)) {
            throw new InvalidArgumentException("Invalid creative type: {$type}");
        }
    }

    private function validateFormat(string $format): void
    {
        $validFormats = [
            self::FORMAT_SQUARE,
            self::FORMAT_LANDSCAPE,
            self::FORMAT_PORTRAIT,
            self::FORMAT_STORY,
        ];

        if (!in_array($format, $validFormats)) {
            throw new InvalidArgumentException("Invalid creative format: {$format}");
        }
    }

    private function validateHeadline(string $headline): void
    {
        if (empty(trim($headline))) {
            throw new InvalidArgumentException('Headline cannot be empty');
        }

        if (strlen($headline) > 100) {
            throw new InvalidArgumentException('Headline cannot exceed 100 characters');
        }
    }

    private function validateDescription(string $description): void
    {
        if (empty(trim($description))) {
            throw new InvalidArgumentException('Description cannot be empty');
        }

        if (strlen($description) > 500) {
            throw new InvalidArgumentException('Description cannot exceed 500 characters');
        }
    }

    private function validateCallToAction(string $callToAction): void
    {
        if (empty(trim($callToAction))) {
            throw new InvalidArgumentException('Call to action cannot be empty');
        }

        if (strlen($callToAction) > 50) {
            throw new InvalidArgumentException('Call to action cannot exceed 50 characters');
        }
    }

    private function validateMediaUrls(array $mediaUrls): void
    {
        if (empty($mediaUrls)) {
            throw new InvalidArgumentException('At least one media URL is required');
        }

        foreach ($mediaUrls as $url) {
            if (!filter_var($url, FILTER_VALIDATE_URL)) {
                throw new InvalidArgumentException("Invalid media URL: {$url}");
            }
        }
    }

    // ===== DOMAIN LOGIC METHODS =====

    public function activate(): void
    {
        if ($this->status === self::STATUS_ARCHIVED) {
            throw new InvalidArgumentException('Cannot activate an archived creative');
        }

        $this->status = self::STATUS_ACTIVE;
        $this->updatedAt = new DateTime();
    }

    public function pause(): void
    {
        if ($this->status !== self::STATUS_ACTIVE) {
            throw new InvalidArgumentException('Can only pause active creatives');
        }

        $this->status = self::STATUS_PAUSED;
        $this->updatedAt = new DateTime();
    }

    public function archive(): void
    {
        if ($this->status === self::STATUS_ACTIVE) {
            throw new InvalidArgumentException('Cannot archive an active creative. Pause it first.');
        }

        $this->status = self::STATUS_ARCHIVED;
        $this->updatedAt = new DateTime();
    }

    public function updateContent(string $headline, string $description, string $callToAction): void
    {
        $this->validateHeadline($headline);
        $this->validateDescription($description);
        $this->validateCallToAction($callToAction);

        $this->headline = $headline;
        $this->description = $description;
        $this->callToAction = $callToAction;
        $this->updatedAt = new DateTime();
    }

    public function updateMediaUrls(array $mediaUrls): void
    {
        $this->validateMediaUrls($mediaUrls);
        $this->mediaUrls = $mediaUrls;
        $this->updatedAt = new DateTime();
    }

    public function updateTargetingData(array $targetingData): void
    {
        $this->targetingData = $targetingData;
        $this->updatedAt = new DateTime();
    }

    public function markAsSynced(string $platformCreativeId, string $platformStatus): void
    {
        $this->platformCreativeId = $platformCreativeId;
        $this->platformStatus = $platformStatus;
        $this->errorMessage = null;
        $this->updatedAt = new DateTime();
    }

    public function markSyncFailed(string $errorMessage): void
    {
        $this->errorMessage = $errorMessage;
        $this->updatedAt = new DateTime();
    }

    // ===== QUERY METHODS =====

    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    public function isPaused(): bool
    {
        return $this->status === self::STATUS_PAUSED;
    }

    public function isArchived(): bool
    {
        return $this->status === self::STATUS_ARCHIVED;
    }

    public function isDraft(): bool
    {
        return $this->status === self::STATUS_DRAFT;
    }

    public function isSynced(): bool
    {
        return !empty($this->platformCreativeId);
    }

    public function canBeActivated(): bool
    {
        return in_array($this->status, [self::STATUS_DRAFT, self::STATUS_PAUSED]);
    }

    public function canBePaused(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    public function canBeArchived(): bool
    {
        return in_array($this->status, [self::STATUS_PAUSED, self::STATUS_DRAFT]);
    }

    public function getMediaCount(): int
    {
        return count($this->mediaUrls);
    }

    public function hasMedia(): bool
    {
        return !empty($this->mediaUrls);
    }

    public function getContentLength(): int
    {
        return strlen($this->headline) + strlen($this->description) + strlen($this->callToAction);
    }

    // ===== STATIC METHODS =====

    public static function getValidStatuses(): array
    {
        return [
            self::STATUS_DRAFT,
            self::STATUS_ACTIVE,
            self::STATUS_PAUSED,
            self::STATUS_ARCHIVED,
        ];
    }

    public static function getValidTypes(): array
    {
        return [
            self::TYPE_IMAGE,
            self::TYPE_VIDEO,
            self::TYPE_CAROUSEL,
            self::TYPE_SLIDESHOW,
            self::TYPE_COLLECTION,
        ];
    }

    public static function getValidFormats(): array
    {
        return [
            self::FORMAT_SQUARE,
            self::FORMAT_LANDSCAPE,
            self::FORMAT_PORTRAIT,
            self::FORMAT_STORY,
        ];
    }
}
