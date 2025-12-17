<?php

namespace App\Domains\ADStool\Domain;

use App\Domains\ADStool\Domain\ValueObjects\ADSCampaignStatus;
use App\Domains\ADStool\Domain\ValueObjects\ADSCampaignSyncStatus;
use App\Domains\ADStool\Domain\ValueObjects\ADSPlatform;
use App\Domains\ADStool\Domain\ValueObjects\ADSCampaignObjective;
use App\Domains\ADStool\Domain\ValueObjects\ADSCampaignBudget;
use DateTime;
use InvalidArgumentException;

class ADSCampaign
{
    public ?int $id;
    public int $userId;
    public ?int $projectId;
    public string $name;
    public ADSCampaignObjective $objective;
    public ADSPlatform $platform;
    public ADSCampaignBudget $budget;
    public ADSCampaignStatus $status;
    public ADSCampaignSyncStatus $syncStatus;
    public ?string $errorMessage;
    public ?string $platformCampaignId;
    public ?string $platformStatus;
    public ?DateTime $startDate;
    public ?DateTime $endDate;
    public ?DateTime $createdAt;
    public ?DateTime $updatedAt;

    public function __construct(
        int $userId,
        ?int $projectId,
        string $name,
        ADSCampaignObjective $objective,
        ADSPlatform $platform,
        ADSCampaignBudget $budget,
        ADSCampaignStatus $status = null,
        ADSCampaignSyncStatus $syncStatus = null,
        ?string $errorMessage = null,
        ?string $platformCampaignId = null,
        ?string $platformStatus = null,
        /** @var array<string, mixed> */ public readonly array $platformSpecificData = [],
        ?int $id = null,
        ?DateTime $createdAt = null,
        ?DateTime $updatedAt = null,
    ) {
        $this->validateUserId($userId);
        $this->validateName($name);

        $this->id = $id;
        $this->userId = $userId;
        $this->projectId = $projectId;
        $this->name = $name;
        $this->objective = $objective;
        $this->platform = $platform;
        $this->budget = $budget;
        $this->status = $status ?? ADSCampaignStatus::draft();
        $this->syncStatus = $syncStatus ?? ADSCampaignSyncStatus::pending();
        $this->errorMessage = $errorMessage;
        $this->platformCampaignId = $platformCampaignId;
        $this->platformStatus = $platformStatus;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    /**
     * @param array<string, mixed> $data
     */
    public static function fromArray(array $data): self
    {
        $budget = ADSCampaignBudget::create(
            dailyBudget: (float) $data['daily_budget'],
            startDate: isset($data['start_date']) ? new DateTime($data['start_date']) : null,
            endDate: isset($data['end_date']) ? new DateTime($data['end_date']) : null
        );

        return new self(
            userId: (int) $data['user_id'],
            projectId: isset($data['project_id']) ? (int) $data['project_id'] : null,
            name: $data['name'],
            objective: new ADSCampaignObjective($data['objective']),
            platform: new ADSPlatform($data['platform']),
            budget: $budget,
            status: isset($data['status']) ? new ADSCampaignStatus($data['status']) : null,
            syncStatus: isset($data['sync_status']) ? new ADSCampaignSyncStatus($data['sync_status']) : null,
            errorMessage: $data['error_message'] ?? null,
            platformCampaignId: $data['platform_campaign_id'] ?? null,
            platformStatus: $data['platform_status'] ?? null,
            platformSpecificData: $data['platform_specific_data'] ?? [],
            id: isset($data['id']) ? (int) $data['id'] : null,
            createdAt: isset($data['created_at']) ? new DateTime((string) $data['created_at']) : null,
            updatedAt: isset($data['updated_at']) ? new DateTime((string) $data['updated_at']) : null,
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
            'name' => $this->name,
            'objective' => $this->objective->getValue(),
            'platform' => $this->platform->getValue(),
            'budget' => $this->budget->toArray(),
            'status' => $this->status->getValue(),
            'sync_status' => $this->syncStatus->getValue(),
            'error_message' => $this->errorMessage,
            'platform_campaign_id' => $this->platformCampaignId,
            'platform_status' => $this->platformStatus,
            'platform_specific_data' => $this->platformSpecificData,
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

    private function validateName(string $name): void
    {
        if (empty(trim($name))) {
            throw new InvalidArgumentException('Campaign name cannot be empty');
        }

        if (strlen($name) > 255) {
            throw new InvalidArgumentException('Campaign name cannot exceed 255 characters');
        }
    }


    // ===== DOMAIN LOGIC METHODS =====

    public function activate(): void
    {
        if (!$this->status->canBeActivated()) {
            throw new InvalidArgumentException('Cannot activate campaign in current status');
        }

        $this->status = ADSCampaignStatus::active();
        $this->updatedAt = new DateTime();
    }

    public function pause(): void
    {
        if (!$this->status->canBePaused()) {
            throw new InvalidArgumentException('Can only pause active campaigns');
        }

        $this->status = ADSCampaignStatus::paused();
        $this->updatedAt = new DateTime();
    }

    public function end(): void
    {
        if (!$this->status->canBeEnded()) {
            throw new InvalidArgumentException('Cannot end campaign in current status');
        }

        $this->status = ADSCampaignStatus::ended();
        $this->budget = $this->budget->setDateRange($this->budget->getStartDate(), new DateTime());
        $this->updatedAt = new DateTime();
    }

    public function archive(): void
    {
        if (!$this->status->canBeArchived()) {
            throw new InvalidArgumentException('Cannot archive campaign in current status');
        }

        $this->status = ADSCampaignStatus::archived();
        $this->updatedAt = new DateTime();
    }

    public function updateBudget(float $newBudget): void
    {
        if ($this->status->isEnded()) {
            throw new InvalidArgumentException('Cannot update budget of an ended campaign');
        }

        $this->budget = $this->budget->setDailyBudget($newBudget);
        $this->updatedAt = new DateTime();
    }

    public function updatePlatformData(array $platformData): void
    {
        if (empty($platformData)) {
            throw new InvalidArgumentException('Platform data cannot be empty');
        }

        $this->platformSpecificData = $platformData;
        $this->updatedAt = new DateTime();
    }

    public function markAsSynced(string $platformCampaignId, string $platformStatus): void
    {
        $this->platformCampaignId = $platformCampaignId;
        $this->platformStatus = $platformStatus;
        $this->syncStatus = ADSCampaignSyncStatus::synced();
        $this->errorMessage = null;
        $this->updatedAt = new DateTime();
    }

    public function markSyncFailed(string $errorMessage): void
    {
        $this->syncStatus = ADSCampaignSyncStatus::failed();
        $this->errorMessage = $errorMessage;
        $this->updatedAt = new DateTime();
    }

    public function markAsSyncing(): void
    {
        $this->syncStatus = ADSCampaignSyncStatus::syncing();
        $this->errorMessage = null;
        $this->updatedAt = new DateTime();
    }

    // ===== QUERY METHODS =====

    public function isActive(): bool
    {
        return $this->status->isActive();
    }

    public function isPaused(): bool
    {
        return $this->status->isPaused();
    }

    public function isEnded(): bool
    {
        return $this->status->isEnded();
    }

    public function isArchived(): bool
    {
        return $this->status->isArchived();
    }

    public function isDraft(): bool
    {
        return $this->status->isDraft();
    }

    public function isSynced(): bool
    {
        return $this->syncStatus->isSynced();
    }

    public function isSyncFailed(): bool
    {
        return $this->syncStatus->isFailed();
    }

    public function isSyncPending(): bool
    {
        return $this->syncStatus->isPending();
    }

    public function isSyncInProgress(): bool
    {
        return $this->syncStatus->isSyncing();
    }

    public function canBeActivated(): bool
    {
        return $this->status->canBeActivated();
    }

    public function canBePaused(): bool
    {
        return $this->status->canBePaused();
    }

    public function canBeEnded(): bool
    {
        return $this->status->canBeEnded();
    }

    public function canBeArchived(): bool
    {
        return $this->status->canBeArchived();
    }

    public function getTotalBudget(): float
    {
        return $this->budget->getTotalBudget();
    }

    public function getRemainingDays(): int
    {
        return $this->budget->getRemainingDays();
    }

    public function getRemainingBudget(): float
    {
        return $this->budget->getRemainingBudget();
    }

    public function getDailyBudget(): float
    {
        return $this->budget->getDailyBudget();
    }

    // ===== STATIC METHODS =====

    public static function getValidStatuses(): array
    {
        return [
            ADSCampaignStatus::DRAFT,
            ADSCampaignStatus::ACTIVE,
            ADSCampaignStatus::PAUSED,
            ADSCampaignStatus::ENDED,
            ADSCampaignStatus::ARCHIVED,
        ];
    }

    public static function getValidSyncStatuses(): array
    {
        return [
            ADSCampaignSyncStatus::PENDING,
            ADSCampaignSyncStatus::SYNCING,
            ADSCampaignSyncStatus::SYNCED,
            ADSCampaignSyncStatus::FAILED,
        ];
    }

    public static function getValidPlatforms(): array
    {
        return [
            ADSPlatform::FACEBOOK,
            ADSPlatform::GOOGLE,
            ADSPlatform::INSTAGRAM,
            ADSPlatform::TWITTER,
            ADSPlatform::LINKEDIN,
        ];
    }

    public static function getValidObjectives(): array
    {
        return [
            ADSCampaignObjective::AWARENESS,
            ADSCampaignObjective::TRAFFIC,
            ADSCampaignObjective::ENGAGEMENT,
            ADSCampaignObjective::LEADS,
            ADSCampaignObjective::SALES,
            ADSCampaignObjective::APP_INSTALLS,
        ];
    }
}
