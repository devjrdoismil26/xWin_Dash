<?php

namespace App\Domains\Projects\Domain;

use DateTime;
use InvalidArgumentException;

class Project
{
    // Status constants
    public const STATUS_PLANNING = 'planning';
    public const STATUS_ACTIVE = 'active';
    public const STATUS_ON_HOLD = 'on_hold';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_CANCELLED = 'cancelled';
    public const STATUS_ARCHIVED = 'archived';

    // Priority constants
    public const PRIORITY_LOW = 'low';
    public const PRIORITY_MEDIUM = 'medium';
    public const PRIORITY_HIGH = 'high';
    public const PRIORITY_URGENT = 'urgent';

    // Type constants
    public const TYPE_WEB_DEVELOPMENT = 'web_development';
    public const TYPE_MOBILE_APP = 'mobile_app';
    public const TYPE_MARKETING = 'marketing';
    public const TYPE_DESIGN = 'design';
    public const TYPE_RESEARCH = 'research';
    public const TYPE_OTHER = 'other';

    public ?string $id;
    public string $name;
    public ?string $description;
    public string $status;
    public string $priority;
    public string $type;
    public string $userId;
    public ?string $slug;
    public ?array $tags;
    public ?array $metadata;
    public ?DateTime $startDate;
    public ?DateTime $endDate;
    public ?DateTime $deadline;
    public ?float $budget;
    public ?string $budgetCurrency;
    public ?int $progress;
    public ?array $teamMembers;
    public ?array $stakeholders;
    public ?string $clientName;
    public ?string $clientEmail;
    public ?string $clientPhone;
    public ?array $attachments;
    public ?array $customFields;
    public ?DateTime $lastActivityAt;
    public ?DateTime $createdAt;
    public ?DateTime $updatedAt;

    public function __construct(
        string $name,
        string $userId,
        ?string $description = null,
        string $status = self::STATUS_PLANNING,
        string $priority = self::PRIORITY_MEDIUM,
        string $type = self::TYPE_OTHER,
        ?string $slug = null,
        ?array $tags = null,
        ?array $metadata = null,
        ?DateTime $startDate = null,
        ?DateTime $endDate = null,
        ?DateTime $deadline = null,
        ?float $budget = null,
        ?string $budgetCurrency = null,
        ?int $progress = null,
        ?array $teamMembers = null,
        ?array $stakeholders = null,
        ?string $clientName = null,
        ?string $clientEmail = null,
        ?string $clientPhone = null,
        ?array $attachments = null,
        ?array $customFields = null,
        ?DateTime $lastActivityAt = null,
        ?string $id = null,
        ?DateTime $createdAt = null,
        ?DateTime $updatedAt = null,
    ) {
        $this->validateName($name);
        $this->validateUserId($userId);
        $this->validateStatus($status);
        $this->validatePriority($priority);
        $this->validateType($type);
        $this->validateDescription($description);
        $this->validateSlug($slug);
        $this->validateTags($tags);
        $this->validateMetadata($metadata);
        $this->validateDates($startDate, $endDate, $deadline);
        $this->validateBudget($budget);
        $this->validateBudgetCurrency($budgetCurrency);
        $this->validateProgress($progress);
        $this->validateTeamMembers($teamMembers);
        $this->validateStakeholders($stakeholders);
        $this->validateClientEmail($clientEmail);
        $this->validateClientPhone($clientPhone);
        $this->validateAttachments($attachments);
        $this->validateCustomFields($customFields);
        $this->validateLastActivityAt($lastActivityAt);

        $this->id = $id;
        $this->name = $name;
        $this->description = $description;
        $this->status = $status;
        $this->priority = $priority;
        $this->type = $type;
        $this->userId = $userId;
        $this->slug = $slug;
        $this->tags = $tags;
        $this->metadata = $metadata;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->deadline = $deadline;
        $this->budget = $budget;
        $this->budgetCurrency = $budgetCurrency;
        $this->progress = $progress;
        $this->teamMembers = $teamMembers;
        $this->stakeholders = $stakeholders;
        $this->clientName = $clientName;
        $this->clientEmail = $clientEmail;
        $this->clientPhone = $clientPhone;
        $this->attachments = $attachments;
        $this->customFields = $customFields;
        $this->lastActivityAt = $lastActivityAt;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    // Validation methods
    private function validateName(string $name): void
    {
        if (empty(trim($name))) {
            throw new InvalidArgumentException('Project name cannot be empty');
        }
        if (strlen($name) > 255) {
            throw new InvalidArgumentException('Project name cannot exceed 255 characters');
        }
    }

    private function validateUserId(string $userId): void
    {
        if (empty(trim($userId))) {
            throw new InvalidArgumentException('User ID cannot be empty');
        }
    }

    private function validateStatus(string $status): void
    {
        if (!in_array($status, [self::STATUS_PLANNING, self::STATUS_ACTIVE, self::STATUS_ON_HOLD, self::STATUS_COMPLETED, self::STATUS_CANCELLED, self::STATUS_ARCHIVED])) {
            throw new InvalidArgumentException('Invalid project status');
        }
    }

    private function validatePriority(string $priority): void
    {
        if (!in_array($priority, [self::PRIORITY_LOW, self::PRIORITY_MEDIUM, self::PRIORITY_HIGH, self::PRIORITY_URGENT])) {
            throw new InvalidArgumentException('Invalid project priority');
        }
    }

    private function validateType(string $type): void
    {
        if (!in_array($type, [self::TYPE_WEB_DEVELOPMENT, self::TYPE_MOBILE_APP, self::TYPE_MARKETING, self::TYPE_DESIGN, self::TYPE_RESEARCH, self::TYPE_OTHER])) {
            throw new InvalidArgumentException('Invalid project type');
        }
    }

    private function validateDescription(?string $description): void
    {
        if ($description !== null && strlen($description) > 2000) {
            throw new InvalidArgumentException('Description cannot exceed 2000 characters');
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

    private function validateDates(?DateTime $startDate, ?DateTime $endDate, ?DateTime $deadline): void
    {
        if ($startDate !== null && $startDate > new DateTime()) {
            throw new InvalidArgumentException('Start date cannot be in the future');
        }
        if ($endDate !== null && $endDate > new DateTime()) {
            throw new InvalidArgumentException('End date cannot be in the future');
        }
        if ($startDate !== null && $endDate !== null && $startDate > $endDate) {
            throw new InvalidArgumentException('Start date cannot be after end date');
        }
        if ($deadline !== null && $deadline > new DateTime()) {
            throw new InvalidArgumentException('Deadline cannot be in the future');
        }
    }

    private function validateBudget(?float $budget): void
    {
        if ($budget !== null && $budget < 0) {
            throw new InvalidArgumentException('Budget cannot be negative');
        }
    }

    private function validateBudgetCurrency(?string $budgetCurrency): void
    {
        if ($budgetCurrency !== null && !preg_match('/^[A-Z]{3}$/', $budgetCurrency)) {
            throw new InvalidArgumentException('Budget currency must be a valid 3-letter currency code');
        }
    }

    private function validateProgress(?int $progress): void
    {
        if ($progress !== null && ($progress < 0 || $progress > 100)) {
            throw new InvalidArgumentException('Progress must be between 0 and 100');
        }
    }

    private function validateTeamMembers(?array $teamMembers): void
    {
        if ($teamMembers !== null && !is_array($teamMembers)) {
            throw new InvalidArgumentException('Team members must be an array');
        }
    }

    private function validateStakeholders(?array $stakeholders): void
    {
        if ($stakeholders !== null && !is_array($stakeholders)) {
            throw new InvalidArgumentException('Stakeholders must be an array');
        }
    }

    private function validateClientEmail(?string $clientEmail): void
    {
        if ($clientEmail !== null && !filter_var($clientEmail, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException('Invalid client email format');
        }
    }

    private function validateClientPhone(?string $clientPhone): void
    {
        if ($clientPhone !== null && !preg_match('/^[\+]?[1-9][\d]{0,15}$/', $clientPhone)) {
            throw new InvalidArgumentException('Invalid client phone format');
        }
    }

    private function validateAttachments(?array $attachments): void
    {
        if ($attachments !== null && !is_array($attachments)) {
            throw new InvalidArgumentException('Attachments must be an array');
        }
    }

    private function validateCustomFields(?array $customFields): void
    {
        if ($customFields !== null && !is_array($customFields)) {
            throw new InvalidArgumentException('Custom fields must be an array');
        }
    }

    private function validateLastActivityAt(?DateTime $lastActivityAt): void
    {
        if ($lastActivityAt !== null && $lastActivityAt > new DateTime()) {
            throw new InvalidArgumentException('Last activity date cannot be in the future');
        }
    }

    /**
     * Cria uma instância da entidade a partir de um array de dados (ex: vindo do repositório).
     *
     * @param array<string, mixed> $data
     *
     * @return self
     */
    public static function fromArray(array $data): self
    {
        return new self(
            $data['name'],
            $data['user_id'],
            $data['description'] ?? null,
            $data['status'] ?? self::STATUS_PLANNING,
            $data['priority'] ?? self::PRIORITY_MEDIUM,
            $data['type'] ?? self::TYPE_OTHER,
            $data['slug'] ?? null,
            $data['tags'] ?? null,
            $data['metadata'] ?? null,
            isset($data['start_date']) ? new DateTime($data['start_date']) : null,
            isset($data['end_date']) ? new DateTime($data['end_date']) : null,
            isset($data['deadline']) ? new DateTime($data['deadline']) : null,
            $data['budget'] ?? null,
            $data['budget_currency'] ?? null,
            $data['progress'] ?? null,
            $data['team_members'] ?? null,
            $data['stakeholders'] ?? null,
            $data['client_name'] ?? null,
            $data['client_email'] ?? null,
            $data['client_phone'] ?? null,
            $data['attachments'] ?? null,
            $data['custom_fields'] ?? null,
            isset($data['last_activity_at']) ? new DateTime($data['last_activity_at']) : null,
            $data['id'] ?? null,
            isset($data['created_at']) ? new DateTime($data['created_at']) : null,
            isset($data['updated_at']) ? new DateTime($data['updated_at']) : null,
        );
    }

    /**
     * Converte a entidade para um array.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'status' => $this->status,
            'priority' => $this->priority,
            'type' => $this->type,
            'user_id' => $this->userId,
            'slug' => $this->slug,
            'tags' => $this->tags,
            'metadata' => $this->metadata,
            'start_date' => $this->startDate ? $this->startDate->format('Y-m-d H:i:s') : null,
            'end_date' => $this->endDate ? $this->endDate->format('Y-m-d H:i:s') : null,
            'deadline' => $this->deadline ? $this->deadline->format('Y-m-d H:i:s') : null,
            'budget' => $this->budget,
            'budget_currency' => $this->budgetCurrency,
            'progress' => $this->progress,
            'team_members' => $this->teamMembers,
            'stakeholders' => $this->stakeholders,
            'client_name' => $this->clientName,
            'client_email' => $this->clientEmail,
            'client_phone' => $this->clientPhone,
            'attachments' => $this->attachments,
            'custom_fields' => $this->customFields,
            'last_activity_at' => $this->lastActivityAt ? $this->lastActivityAt->format('Y-m-d H:i:s') : null,
            'created_at' => $this->createdAt ? $this->createdAt->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updatedAt ? $this->updatedAt->format('Y-m-d H:i:s') : null,
        ];
    }

    // Domain logic methods
    public function start(): void
    {
        if ($this->status !== self::STATUS_PLANNING) {
            throw new InvalidArgumentException('Only planning projects can be started');
        }
        $this->status = self::STATUS_ACTIVE;
        $this->startDate = new DateTime();
        $this->lastActivityAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    public function putOnHold(): void
    {
        if (!in_array($this->status, [self::STATUS_ACTIVE, self::STATUS_PLANNING])) {
            throw new InvalidArgumentException('Only active or planning projects can be put on hold');
        }
        $this->status = self::STATUS_ON_HOLD;
        $this->lastActivityAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    public function resume(): void
    {
        if ($this->status !== self::STATUS_ON_HOLD) {
            throw new InvalidArgumentException('Only projects on hold can be resumed');
        }
        $this->status = self::STATUS_ACTIVE;
        $this->lastActivityAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    public function complete(): void
    {
        if (!in_array($this->status, [self::STATUS_ACTIVE, self::STATUS_ON_HOLD])) {
            throw new InvalidArgumentException('Only active or on hold projects can be completed');
        }
        $this->status = self::STATUS_COMPLETED;
        $this->endDate = new DateTime();
        $this->progress = 100;
        $this->lastActivityAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    public function cancel(): void
    {
        if (in_array($this->status, [self::STATUS_COMPLETED, self::STATUS_CANCELLED, self::STATUS_ARCHIVED])) {
            throw new InvalidArgumentException('Cannot cancel completed, cancelled, or archived projects');
        }
        $this->status = self::STATUS_CANCELLED;
        $this->endDate = new DateTime();
        $this->lastActivityAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    public function archive(): void
    {
        if (!in_array($this->status, [self::STATUS_COMPLETED, self::STATUS_CANCELLED])) {
            throw new InvalidArgumentException('Only completed or cancelled projects can be archived');
        }
        $this->status = self::STATUS_ARCHIVED;
        $this->lastActivityAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    public function updateName(string $name): void
    {
        $this->validateName($name);
        $this->name = $name;
        $this->lastActivityAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    public function updateDescription(?string $description): void
    {
        $this->validateDescription($description);
        $this->description = $description;
        $this->lastActivityAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    public function updatePriority(string $priority): void
    {
        $this->validatePriority($priority);
        $this->priority = $priority;
        $this->lastActivityAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    public function updateType(string $type): void
    {
        $this->validateType($type);
        $this->type = $type;
        $this->lastActivityAt = new DateTime();
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
            $this->lastActivityAt = new DateTime();
            $this->updatedAt = new DateTime();
        }
    }

    public function removeTag(string $tag): void
    {
        if ($this->tags !== null) {
            $this->tags = array_values(array_filter($this->tags, fn($t) => $t !== $tag));
            $this->lastActivityAt = new DateTime();
            $this->updatedAt = new DateTime();
        }
    }

    public function updateMetadata(array $metadata): void
    {
        $this->validateMetadata($metadata);
        $this->metadata = $metadata;
        $this->lastActivityAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    public function updateDates(?DateTime $startDate, ?DateTime $endDate, ?DateTime $deadline): void
    {
        $this->validateDates($startDate, $endDate, $deadline);
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->deadline = $deadline;
        $this->lastActivityAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    public function updateBudget(?float $budget, ?string $currency = null): void
    {
        $this->validateBudget($budget);
        if ($currency !== null) {
            $this->validateBudgetCurrency($currency);
        }
        $this->budget = $budget;
        if ($currency !== null) {
            $this->budgetCurrency = $currency;
        }
        $this->lastActivityAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    public function updateProgress(int $progress): void
    {
        $this->validateProgress($progress);
        $this->progress = $progress;
        $this->lastActivityAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    public function addTeamMember(string $userId, string $role = 'member'): void
    {
        if ($this->teamMembers === null) {
            $this->teamMembers = [];
        }
        $this->teamMembers[] = ['user_id' => $userId, 'role' => $role, 'joined_at' => (new DateTime())->format('Y-m-d H:i:s')];
        $this->lastActivityAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    public function removeTeamMember(string $userId): void
    {
        if ($this->teamMembers !== null) {
            $this->teamMembers = array_values(array_filter($this->teamMembers, fn($member) => $member['user_id'] !== $userId));
            $this->lastActivityAt = new DateTime();
            $this->updatedAt = new DateTime();
        }
    }

    public function addStakeholder(string $name, ?string $email = null, ?string $phone = null): void
    {
        if ($this->stakeholders === null) {
            $this->stakeholders = [];
        }
        $this->stakeholders[] = ['name' => $name, 'email' => $email, 'phone' => $phone, 'added_at' => (new DateTime())->format('Y-m-d H:i:s')];
        $this->lastActivityAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    public function updateClientInfo(?string $name, ?string $email, ?string $phone): void
    {
        if ($email !== null) {
            $this->validateClientEmail($email);
        }
        if ($phone !== null) {
            $this->validateClientPhone($phone);
        }
        $this->clientName = $name;
        $this->clientEmail = $email;
        $this->clientPhone = $phone;
        $this->lastActivityAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    public function addAttachment(string $name, string $path, int $size): void
    {
        if ($this->attachments === null) {
            $this->attachments = [];
        }
        $this->attachments[] = ['name' => $name, 'path' => $path, 'size' => $size, 'uploaded_at' => (new DateTime())->format('Y-m-d H:i:s')];
        $this->lastActivityAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    public function updateCustomField(string $key, $value): void
    {
        if ($this->customFields === null) {
            $this->customFields = [];
        }
        $this->customFields[$key] = $value;
        $this->lastActivityAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    public function markAsActive(): void
    {
        $this->lastActivityAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    // Query methods
    public function isPlanning(): bool
    {
        return $this->status === self::STATUS_PLANNING;
    }

    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    public function isOnHold(): bool
    {
        return $this->status === self::STATUS_ON_HOLD;
    }

    public function isCompleted(): bool
    {
        return $this->status === self::STATUS_COMPLETED;
    }

    public function isCancelled(): bool
    {
        return $this->status === self::STATUS_CANCELLED;
    }

    public function isArchived(): bool
    {
        return $this->status === self::STATUS_ARCHIVED;
    }

    public function isLowPriority(): bool
    {
        return $this->priority === self::PRIORITY_LOW;
    }

    public function isMediumPriority(): bool
    {
        return $this->priority === self::PRIORITY_MEDIUM;
    }

    public function isHighPriority(): bool
    {
        return $this->priority === self::PRIORITY_HIGH;
    }

    public function isUrgentPriority(): bool
    {
        return $this->priority === self::PRIORITY_URGENT;
    }

    public function isWebDevelopment(): bool
    {
        return $this->type === self::TYPE_WEB_DEVELOPMENT;
    }

    public function isMobileApp(): bool
    {
        return $this->type === self::TYPE_MOBILE_APP;
    }

    public function isMarketing(): bool
    {
        return $this->type === self::TYPE_MARKETING;
    }

    public function isDesign(): bool
    {
        return $this->type === self::TYPE_DESIGN;
    }

    public function isResearch(): bool
    {
        return $this->type === self::TYPE_RESEARCH;
    }

    public function hasTag(string $tag): bool
    {
        return $this->tags !== null && in_array($tag, $this->tags);
    }

    public function hasTeamMember(string $userId): bool
    {
        if ($this->teamMembers === null) {
            return false;
        }
        return in_array($userId, array_column($this->teamMembers, 'user_id'));
    }

    public function hasStakeholder(string $name): bool
    {
        if ($this->stakeholders === null) {
            return false;
        }
        return in_array($name, array_column($this->stakeholders, 'name'));
    }

    public function hasClient(): bool
    {
        return $this->clientName !== null || $this->clientEmail !== null || $this->clientPhone !== null;
    }

    public function hasBudget(): bool
    {
        return $this->budget !== null && $this->budget > 0;
    }

    public function hasDeadline(): bool
    {
        return $this->deadline !== null;
    }

    public function isOverdue(): bool
    {
        return $this->deadline !== null && $this->deadline < new DateTime() && !$this->isCompleted();
    }

    public function getProgress(): int
    {
        return $this->progress ?? 0;
    }

    public function getBudgetFormatted(): ?string
    {
        if ($this->budget === null) {
            return null;
        }
        $currency = $this->budgetCurrency ?? 'USD';
        return $currency . ' ' . number_format($this->budget, 2);
    }

    public function getDurationInDays(): ?int
    {
        if ($this->startDate === null || $this->endDate === null) {
            return null;
        }
        return $this->startDate->diff($this->endDate)->days;
    }

    public function getDaysUntilDeadline(): ?int
    {
        if ($this->deadline === null) {
            return null;
        }
        $now = new DateTime();
        if ($this->deadline < $now) {
            return 0;
        }
        return $now->diff($this->deadline)->days;
    }

    public function getTeamMemberCount(): int
    {
        return $this->teamMembers !== null ? count($this->teamMembers) : 0;
    }

    public function getStakeholderCount(): int
    {
        return $this->stakeholders !== null ? count($this->stakeholders) : 0;
    }

    public function getAttachmentCount(): int
    {
        return $this->attachments !== null ? count($this->attachments) : 0;
    }

    public function canBeStarted(): bool
    {
        return $this->isPlanning();
    }

    public function canBeCompleted(): bool
    {
        return $this->isActive() || $this->isOnHold();
    }

    public function canBeCancelled(): bool
    {
        return !in_array($this->status, [self::STATUS_COMPLETED, self::STATUS_CANCELLED, self::STATUS_ARCHIVED]);
    }

    public function canBeArchived(): bool
    {
        return $this->isCompleted() || $this->isCancelled();
    }

    // Static factory methods
    public static function createWebDevelopment(string $name, string $userId, ?string $description = null): self
    {
        return new self($name, $userId, $description, self::STATUS_PLANNING, self::PRIORITY_MEDIUM, self::TYPE_WEB_DEVELOPMENT);
    }

    public static function createMobileApp(string $name, string $userId, ?string $description = null): self
    {
        return new self($name, $userId, $description, self::STATUS_PLANNING, self::PRIORITY_MEDIUM, self::TYPE_MOBILE_APP);
    }

    public static function createMarketing(string $name, string $userId, ?string $description = null): self
    {
        return new self($name, $userId, $description, self::STATUS_PLANNING, self::PRIORITY_MEDIUM, self::TYPE_MARKETING);
    }

    public static function createDesign(string $name, string $userId, ?string $description = null): self
    {
        return new self($name, $userId, $description, self::STATUS_PLANNING, self::PRIORITY_MEDIUM, self::TYPE_DESIGN);
    }

    public static function createResearch(string $name, string $userId, ?string $description = null): self
    {
        return new self($name, $userId, $description, self::STATUS_PLANNING, self::PRIORITY_MEDIUM, self::TYPE_RESEARCH);
    }
}
