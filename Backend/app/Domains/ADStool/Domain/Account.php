<?php

namespace App\Domains\ADStool\Domain;

use DateTime;
use InvalidArgumentException;

/**
 * Entidade de domínio Account
 */
class Account
{
    // Platform constants
    public const PLATFORM_FACEBOOK = 'facebook';
    public const PLATFORM_GOOGLE = 'google';
    public const PLATFORM_INSTAGRAM = 'instagram';
    public const PLATFORM_TWITTER = 'twitter';
    public const PLATFORM_LINKEDIN = 'linkedin';

    // Status constants
    public const STATUS_ACTIVE = 'active';
    public const STATUS_INACTIVE = 'inactive';
    public const STATUS_EXPIRED = 'expired';
    public const STATUS_REVOKED = 'revoked';

    public string $id;
    public string $userId;
    public string $projectId;
    public string $platform;
    public ?string $accessToken;
    public ?string $refreshToken;
    public ?DateTime $expiresAt;
    public ?string $accountIdOnPlatform;
    public ?string $accountNameOnPlatform;
    public bool $isActive;
    public ?DateTime $lastSyncedAt;
    public ?DateTime $createdAt;
    public ?DateTime $updatedAt;

    public function __construct(
        string $id,
        string $userId,
        string $projectId,
        string $platform,
        ?string $accessToken = null,
        ?string $refreshToken = null,
        ?DateTime $expiresAt = null,
        ?string $accountIdOnPlatform = null,
        ?string $accountNameOnPlatform = null,
        bool $isActive = true,
        ?DateTime $lastSyncedAt = null,
        ?DateTime $createdAt = null,
        ?DateTime $updatedAt = null,
    ) {
        $this->validateId($id);
        $this->validateUserId($userId);
        $this->validateProjectId($projectId);
        $this->validatePlatform($platform);
        $this->validateTokens($accessToken, $refreshToken);

        $this->id = $id;
        $this->userId = $userId;
        $this->projectId = $projectId;
        $this->platform = $platform;
        $this->accessToken = $accessToken;
        $this->refreshToken = $refreshToken;
        $this->expiresAt = $expiresAt;
        $this->accountIdOnPlatform = $accountIdOnPlatform;
        $this->accountNameOnPlatform = $accountNameOnPlatform;
        $this->isActive = $isActive;
        $this->lastSyncedAt = $lastSyncedAt;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    /**
     * @param array<string, mixed> $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            id: $data['id'],
            userId: $data['user_id'],
            projectId: $data['project_id'] ?? '',
            platform: $data['platform'],
            accessToken: $data['access_token'] ?? null,
            refreshToken: $data['refresh_token'] ?? null,
            expiresAt: isset($data['expires_at']) ? new \DateTime($data['expires_at']) : null,
            accountIdOnPlatform: $data['account_id_on_platform'] ?? null,
            accountNameOnPlatform: $data['account_name_on_platform'] ?? null,
            isActive: (bool) ($data['is_active'] ?? true),
            lastSyncedAt: isset($data['last_synced_at']) ? new \DateTime($data['last_synced_at']) : null,
            createdAt: isset($data['created_at']) ? new \DateTime($data['created_at']) : null,
            updatedAt: isset($data['updated_at']) ? new \DateTime($data['updated_at']) : null,
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
            'project_id' => $this->projectId,
            'platform' => $this->platform,
            'access_token' => $this->accessToken,
            'refresh_token' => $this->refreshToken,
            'expires_at' => $this->expiresAt?->format('Y-m-d H:i:s'),
            'account_id_on_platform' => $this->accountIdOnPlatform,
            'account_name_on_platform' => $this->accountNameOnPlatform,
            'is_active' => $this->isActive,
            'last_synced_at' => $this->lastSyncedAt?->format('Y-m-d H:i:s'),
            'created_at' => $this->createdAt?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updatedAt?->format('Y-m-d H:i:s'),
        ];
    }

    // ===== VALIDATION METHODS =====

    private function validateId(string $id): void
    {
        if (empty(trim($id))) {
            throw new InvalidArgumentException('Account ID cannot be empty');
        }
    }

    private function validateUserId(string $userId): void
    {
        if (empty(trim($userId))) {
            throw new InvalidArgumentException('User ID cannot be empty');
        }
    }

    private function validateProjectId(string $projectId): void
    {
        if (empty(trim($projectId))) {
            throw new InvalidArgumentException('Project ID cannot be empty');
        }
    }

    private function validatePlatform(string $platform): void
    {
        $validPlatforms = [
            self::PLATFORM_FACEBOOK,
            self::PLATFORM_GOOGLE,
            self::PLATFORM_INSTAGRAM,
            self::PLATFORM_TWITTER,
            self::PLATFORM_LINKEDIN,
        ];

        if (!in_array($platform, $validPlatforms)) {
            throw new InvalidArgumentException("Invalid platform: {$platform}");
        }
    }

    private function validateTokens(?string $accessToken, ?string $refreshToken): void
    {
        if ($accessToken && empty(trim($accessToken))) {
            throw new InvalidArgumentException('Access token cannot be empty');
        }

        if ($refreshToken && empty(trim($refreshToken))) {
            throw new InvalidArgumentException('Refresh token cannot be empty');
        }
    }

    // ===== DOMAIN LOGIC METHODS =====

    public function activate(): void
    {
        if (!$this->hasValidTokens()) {
            throw new InvalidArgumentException('Cannot activate account without valid tokens');
        }

        $this->isActive = true;
        $this->updatedAt = new DateTime();
    }

    public function deactivate(): void
    {
        $this->isActive = false;
        $this->updatedAt = new DateTime();
    }

    public function updateTokens(string $accessToken, ?string $refreshToken = null, ?DateTime $expiresAt = null): void
    {
        $this->validateTokens($accessToken, $refreshToken);

        $this->accessToken = $accessToken;
        $this->refreshToken = $refreshToken;
        $this->expiresAt = $expiresAt;
        $this->updatedAt = new DateTime();
    }

    public function revokeTokens(): void
    {
        $this->accessToken = null;
        $this->refreshToken = null;
        $this->expiresAt = null;
        $this->isActive = false;
        $this->updatedAt = new DateTime();
    }

    public function updatePlatformInfo(string $accountIdOnPlatform, string $accountNameOnPlatform): void
    {
        if (empty(trim($accountIdOnPlatform))) {
            throw new InvalidArgumentException('Platform account ID cannot be empty');
        }

        if (empty(trim($accountNameOnPlatform))) {
            throw new InvalidArgumentException('Platform account name cannot be empty');
        }

        $this->accountIdOnPlatform = $accountIdOnPlatform;
        $this->accountNameOnPlatform = $accountNameOnPlatform;
        $this->updatedAt = new DateTime();
    }

    public function markAsSynced(): void
    {
        $this->lastSyncedAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    // ===== QUERY METHODS =====

    public function isActive(): bool
    {
        return $this->isActive && $this->hasValidTokens();
    }

    public function hasValidTokens(): bool
    {
        if (empty($this->accessToken)) {
            return false;
        }

        if ($this->expiresAt && $this->expiresAt < new DateTime()) {
            return false;
        }

        return true;
    }

    public function isExpired(): bool
    {
        return $this->expiresAt && $this->expiresAt < new DateTime();
    }

    public function hasRefreshToken(): bool
    {
        return !empty($this->refreshToken);
    }

    public function needsRefresh(): bool
    {
        if (!$this->expiresAt) {
            return false;
        }

        // Refresh if token expires within 1 hour
        $refreshThreshold = new DateTime('+1 hour');
        return $this->expiresAt < $refreshThreshold;
    }

    public function getTimeUntilExpiry(): ?int
    {
        if (!$this->expiresAt) {
            return null;
        }

        $now = new DateTime();
        if ($this->expiresAt <= $now) {
            return 0;
        }

        return $this->expiresAt->getTimestamp() - $now->getTimestamp();
    }

    public function getDaysSinceLastSync(): ?int
    {
        if (!$this->lastSyncedAt) {
            return null;
        }

        $now = new DateTime();
        return $now->diff($this->lastSyncedAt)->days;
    }

    public function canBeUsed(): bool
    {
        return $this->isActive() && !$this->isExpired();
    }

    // ===== STATIC METHODS =====

    public static function getValidPlatforms(): array
    {
        return [
            self::PLATFORM_FACEBOOK,
            self::PLATFORM_GOOGLE,
            self::PLATFORM_INSTAGRAM,
            self::PLATFORM_TWITTER,
            self::PLATFORM_LINKEDIN,
        ];
    }

    public static function getValidStatuses(): array
    {
        return [
            self::STATUS_ACTIVE,
            self::STATUS_INACTIVE,
            self::STATUS_EXPIRED,
            self::STATUS_REVOKED,
        ];
    }
}
