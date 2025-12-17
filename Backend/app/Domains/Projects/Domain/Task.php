<?php

namespace App\Domains\Projects\Domain;

use DateTime;
use InvalidArgumentException;

class Task
{
    // Status constants
    public const STATUS_PENDING = 'pending';
    public const STATUS_IN_PROGRESS = 'in_progress';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_CANCELLED = 'cancelled';

    // Priority constants
    public const PRIORITY_LOW = 'low';
    public const PRIORITY_MEDIUM = 'medium';
    public const PRIORITY_HIGH = 'high';
    public const PRIORITY_URGENT = 'urgent';

    // Type constants
    public const TYPE_TASK = 'task';
    public const TYPE_BUG = 'bug';
    public const TYPE_FEATURE = 'feature';
    public const TYPE_IMPROVEMENT = 'improvement';

    public ?string $id;
    public string $title;
    public ?string $description;
    public string $status;
    public string $priority;
    public string $type;
    public string $projectId;
    public ?string $assignedTo;
    public string $createdBy;
    public ?string $parentTaskId;
    public ?array $tags;
    public ?array $attachments;
    public ?array $customFields;
    public ?int $estimatedHours;
    public ?int $actualHours;
    public float $progress;
    public ?DateTime $dueDate;
    public ?DateTime $startedAt;
    public ?DateTime $completedAt;
    public int $sortOrder;
    public bool $isArchived;
    public ?DateTime $createdAt;
    public ?DateTime $updatedAt;
    public ?DateTime $deletedAt;

    public function __construct(
        string $title,
        string $projectId,
        string $createdBy,
        ?string $description = null,
        string $status = self::STATUS_PENDING,
        string $priority = self::PRIORITY_MEDIUM,
        string $type = self::TYPE_TASK,
        ?string $assignedTo = null,
        ?string $parentTaskId = null,
        ?array $tags = null,
        ?array $attachments = null,
        ?array $customFields = null,
        ?int $estimatedHours = null,
        ?int $actualHours = null,
        float $progress = 0.0,
        ?DateTime $dueDate = null,
        ?DateTime $startedAt = null,
        ?DateTime $completedAt = null,
        int $sortOrder = 0,
        bool $isArchived = false,
        ?string $id = null,
        ?DateTime $createdAt = null,
        ?DateTime $updatedAt = null,
        ?DateTime $deletedAt = null,
    ) {
        $this->validateTitle($title);
        $this->validateProjectId($projectId);
        $this->validateCreatedBy($createdBy);
        $this->validateStatus($status);
        $this->validatePriority($priority);
        $this->validateType($type);
        $this->validateDescription($description);
        $this->validateProgress($progress);
        $this->validateEstimatedHours($estimatedHours);
        $this->validateActualHours($actualHours);
        $this->validateSortOrder($sortOrder);

        $this->id = $id;
        $this->title = $title;
        $this->description = $description;
        $this->status = $status;
        $this->priority = $priority;
        $this->type = $type;
        $this->projectId = $projectId;
        $this->assignedTo = $assignedTo;
        $this->createdBy = $createdBy;
        $this->parentTaskId = $parentTaskId;
        $this->tags = $tags;
        $this->attachments = $attachments;
        $this->customFields = $customFields;
        $this->estimatedHours = $estimatedHours;
        $this->actualHours = $actualHours;
        $this->progress = $progress;
        $this->dueDate = $dueDate;
        $this->startedAt = $startedAt;
        $this->completedAt = $completedAt;
        $this->sortOrder = $sortOrder;
        $this->isArchived = $isArchived;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
        $this->deletedAt = $deletedAt;
    }

    // Validation methods
    private function validateTitle(string $title): void
    {
        if (empty(trim($title))) {
            throw new InvalidArgumentException('Task title cannot be empty');
        }
        if (strlen($title) > 255) {
            throw new InvalidArgumentException('Task title cannot exceed 255 characters');
        }
    }

    private function validateProjectId(string $projectId): void
    {
        if (empty(trim($projectId))) {
            throw new InvalidArgumentException('Project ID cannot be empty');
        }
    }

    private function validateCreatedBy(string $createdBy): void
    {
        if (empty(trim($createdBy))) {
            throw new InvalidArgumentException('Created by cannot be empty');
        }
    }

    private function validateStatus(string $status): void
    {
        if (!in_array($status, [self::STATUS_PENDING, self::STATUS_IN_PROGRESS, self::STATUS_COMPLETED, self::STATUS_CANCELLED])) {
            throw new InvalidArgumentException('Invalid task status');
        }
    }

    private function validatePriority(string $priority): void
    {
        if (!in_array($priority, [self::PRIORITY_LOW, self::PRIORITY_MEDIUM, self::PRIORITY_HIGH, self::PRIORITY_URGENT])) {
            throw new InvalidArgumentException('Invalid task priority');
        }
    }

    private function validateType(string $type): void
    {
        if (!in_array($type, [self::TYPE_TASK, self::TYPE_BUG, self::TYPE_FEATURE, self::TYPE_IMPROVEMENT])) {
            throw new InvalidArgumentException('Invalid task type');
        }
    }

    private function validateDescription(?string $description): void
    {
        if ($description !== null && strlen($description) > 2000) {
            throw new InvalidArgumentException('Description cannot exceed 2000 characters');
        }
    }

    private function validateProgress(float $progress): void
    {
        if ($progress < 0 || $progress > 100) {
            throw new InvalidArgumentException('Progress must be between 0 and 100');
        }
    }

    private function validateEstimatedHours(?int $estimatedHours): void
    {
        if ($estimatedHours !== null && $estimatedHours < 0) {
            throw new InvalidArgumentException('Estimated hours cannot be negative');
        }
    }

    private function validateActualHours(?int $actualHours): void
    {
        if ($actualHours !== null && $actualHours < 0) {
            throw new InvalidArgumentException('Actual hours cannot be negative');
        }
    }

    private function validateSortOrder(int $sortOrder): void
    {
        if ($sortOrder < 0) {
            throw new InvalidArgumentException('Sort order cannot be negative');
        }
    }

    /**
     * Cria uma instância da entidade a partir de um array de dados.
     */
    public static function fromArray(array $data): self
    {
        return new self(
            $data['title'],
            $data['project_id'],
            $data['created_by'],
            $data['description'] ?? null,
            $data['status'] ?? self::STATUS_PENDING,
            $data['priority'] ?? self::PRIORITY_MEDIUM,
            $data['type'] ?? self::TYPE_TASK,
            $data['assigned_to'] ?? null,
            $data['parent_task_id'] ?? null,
            $data['tags'] ?? null,
            $data['attachments'] ?? null,
            $data['custom_fields'] ?? null,
            $data['estimated_hours'] ?? null,
            $data['actual_hours'] ?? null,
            $data['progress'] ?? 0.0,
            isset($data['due_date']) ? new DateTime($data['due_date']) : null,
            isset($data['started_at']) ? new DateTime($data['started_at']) : null,
            isset($data['completed_at']) ? new DateTime($data['completed_at']) : null,
            $data['sort_order'] ?? 0,
            $data['is_archived'] ?? false,
            $data['id'] ?? null,
            isset($data['created_at']) ? new DateTime($data['created_at']) : null,
            isset($data['updated_at']) ? new DateTime($data['updated_at']) : null,
            isset($data['deleted_at']) ? new DateTime($data['deleted_at']) : null,
        );
    }

    /**
     * Converte a entidade para um array.
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'priority' => $this->priority,
            'type' => $this->type,
            'project_id' => $this->projectId,
            'assigned_to' => $this->assignedTo,
            'created_by' => $this->createdBy,
            'parent_task_id' => $this->parentTaskId,
            'tags' => $this->tags,
            'attachments' => $this->attachments,
            'custom_fields' => $this->customFields,
            'estimated_hours' => $this->estimatedHours,
            'actual_hours' => $this->actualHours,
            'progress' => $this->progress,
            'due_date' => $this->dueDate ? $this->dueDate->format('Y-m-d H:i:s') : null,
            'started_at' => $this->startedAt ? $this->startedAt->format('Y-m-d H:i:s') : null,
            'completed_at' => $this->completedAt ? $this->completedAt->format('Y-m-d H:i:s') : null,
            'sort_order' => $this->sortOrder,
            'is_archived' => $this->isArchived,
            'created_at' => $this->createdAt ? $this->createdAt->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updatedAt ? $this->updatedAt->format('Y-m-d H:i:s') : null,
            'deleted_at' => $this->deletedAt ? $this->deletedAt->format('Y-m-d H:i:s') : null,
        ];
    }

    // Domain logic methods
    public function start(): void
    {
        if ($this->status !== self::STATUS_PENDING) {
            throw new InvalidArgumentException('Only pending tasks can be started');
        }
        $this->status = self::STATUS_IN_PROGRESS;
        $this->startedAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    public function complete(): void
    {
        if (!in_array($this->status, [self::STATUS_PENDING, self::STATUS_IN_PROGRESS])) {
            throw new InvalidArgumentException('Only pending or in-progress tasks can be completed');
        }
        $this->status = self::STATUS_COMPLETED;
        $this->progress = 100.0;
        $this->completedAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    public function cancel(): void
    {
        if (in_array($this->status, [self::STATUS_COMPLETED, self::STATUS_CANCELLED])) {
            throw new InvalidArgumentException('Cannot cancel completed or cancelled tasks');
        }
        $this->status = self::STATUS_CANCELLED;
        $this->updatedAt = new DateTime();
    }

    public function archive(): void
    {
        $this->isArchived = true;
        $this->updatedAt = new DateTime();
    }

    public function unarchive(): void
    {
        $this->isArchived = false;
        $this->updatedAt = new DateTime();
    }

    public function updateProgress(float $progress): void
    {
        $this->validateProgress($progress);
        $this->progress = $progress;
        
        if ($progress >= 100 && $this->status !== self::STATUS_COMPLETED) {
            $this->complete();
        } elseif ($progress > 0 && $this->status === self::STATUS_PENDING) {
            $this->start();
        } else {
            $this->updatedAt = new DateTime();
        }
    }

    public function assignTo(string $userId): void
    {
        $this->assignedTo = $userId;
        $this->updatedAt = new DateTime();
    }

    public function unassign(): void
    {
        $this->assignedTo = null;
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

    public function addAttachment(string $name, string $path, int $size): void
    {
        if ($this->attachments === null) {
            $this->attachments = [];
        }
        $this->attachments[] = [
            'name' => $name,
            'path' => $path,
            'size' => $size,
            'uploaded_at' => (new DateTime())->format('Y-m-d H:i:s'),
        ];
        $this->updatedAt = new DateTime();
    }

    public function updateCustomField(string $key, $value): void
    {
        if ($this->customFields === null) {
            $this->customFields = [];
        }
        $this->customFields[$key] = $value;
        $this->updatedAt = new DateTime();
    }

    public function getCustomField(string $key, $default = null)
    {
        return data_get($this->customFields, $key, $default);
    }

    // Query methods
    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isInProgress(): bool
    {
        return $this->status === self::STATUS_IN_PROGRESS;
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
        return $this->isArchived;
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

    public function isTask(): bool
    {
        return $this->type === self::TYPE_TASK;
    }

    public function isBug(): bool
    {
        return $this->type === self::TYPE_BUG;
    }

    public function isFeature(): bool
    {
        return $this->type === self::TYPE_FEATURE;
    }

    public function isImprovement(): bool
    {
        return $this->type === self::TYPE_IMPROVEMENT;
    }

    public function hasTag(string $tag): bool
    {
        return $this->tags !== null && in_array($tag, $this->tags);
    }

    public function isAssignedTo(string $userId): bool
    {
        return $this->assignedTo === $userId;
    }

    public function isCreatedBy(string $userId): bool
    {
        return $this->createdBy === $userId;
    }

    public function isSubtask(): bool
    {
        return $this->parentTaskId !== null;
    }

    public function isOverdue(): bool
    {
        return $this->dueDate && 
               $this->dueDate < new DateTime() && 
               !in_array($this->status, [self::STATUS_COMPLETED, self::STATUS_CANCELLED]);
    }

    public function isDueSoon(int $days = 3): bool
    {
        return $this->dueDate && 
               $this->dueDate <= (new DateTime())->modify("+{$days} days") && 
               $this->dueDate > new DateTime() &&
               !in_array($this->status, [self::STATUS_COMPLETED, self::STATUS_CANCELLED]);
    }

    public function canBeStarted(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function canBeCompleted(): bool
    {
        return in_array($this->status, [self::STATUS_PENDING, self::STATUS_IN_PROGRESS]);
    }

    public function canBeCancelled(): bool
    {
        return !in_array($this->status, [self::STATUS_COMPLETED, self::STATUS_CANCELLED]);
    }

    public function canBeArchived(): bool
    {
        return in_array($this->status, [self::STATUS_COMPLETED, self::STATUS_CANCELLED]);
    }

    public function getDaysUntilDue(): ?int
    {
        if (!$this->dueDate) {
            return null;
        }

        $now = new DateTime();
        if ($this->dueDate < $now) {
            return 0;
        }

        return $now->diff($this->dueDate)->days;
    }

    public function getDurationInDays(): ?int
    {
        if (!$this->startedAt || !$this->completedAt) {
            return null;
        }

        return $this->startedAt->diff($this->completedAt)->days;
    }

    public function getCompletionRate(): float
    {
        if (!$this->estimatedHours || $this->estimatedHours <= 0) {
            return 0.0;
        }

        $actualHours = $this->actualHours ?? 0;
        return min(($actualHours / $this->estimatedHours) * 100, 100);
    }

    public function getFormattedProgress(): string
    {
        return number_format($this->progress, 1) . '%';
    }

    public function getEstimatedHoursFormatted(): ?string
    {
        return $this->estimatedHours ? $this->estimatedHours . 'h' : null;
    }

    public function getActualHoursFormatted(): ?string
    {
        return $this->actualHours ? $this->actualHours . 'h' : null;
    }
}