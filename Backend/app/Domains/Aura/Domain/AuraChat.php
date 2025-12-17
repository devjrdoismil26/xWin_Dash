<?php

namespace App\Domains\Aura\Domain;

use DateTime;
use InvalidArgumentException;

class AuraChat
{
    // Status constants
    public const STATUS_OPEN = 'open';
    public const STATUS_CLOSED = 'closed';
    public const STATUS_PENDING = 'pending';
    public const STATUS_ASSIGNED = 'assigned';
    public const STATUS_ESCALATED = 'escalated';

    // Priority constants
    public const PRIORITY_LOW = 'low';
    public const PRIORITY_MEDIUM = 'medium';
    public const PRIORITY_HIGH = 'high';
    public const PRIORITY_URGENT = 'urgent';

    // Type constants
    public const TYPE_CUSTOMER_SUPPORT = 'customer_support';
    public const TYPE_SALES = 'sales';
    public const TYPE_LEAD_GENERATION = 'lead_generation';
    public const TYPE_FAQ = 'faq';
    public const TYPE_COMPLAINT = 'complaint';

    public string $id;
    public string $connectionId;
    public string $phoneNumber;
    public ?string $contactName;
    public string $status;
    public string $priority;
    public string $type;
    public array $metadata;
    public bool $isActive;
    public ?string $assignedAgentId;
    public ?string $assignedAgentName;
    public ?DateTime $assignedAt;
    public ?DateTime $lastMessageAt;
    public ?DateTime $closedAt;
    public ?string $closeReason;
    public ?array $tags;
    public ?array $customFields;
    public ?DateTime $createdAt;
    public ?DateTime $updatedAt;

    public function __construct(
        string $id,
        string $connectionId,
        string $phoneNumber,
        ?string $contactName = null,
        string $status = self::STATUS_OPEN,
        string $priority = self::PRIORITY_MEDIUM,
        string $type = self::TYPE_CUSTOMER_SUPPORT,
        array $metadata = [],
        bool $isActive = true,
        ?string $assignedAgentId = null,
        ?string $assignedAgentName = null,
        ?DateTime $assignedAt = null,
        ?DateTime $lastMessageAt = null,
        ?DateTime $closedAt = null,
        ?string $closeReason = null,
        ?array $tags = null,
        ?array $customFields = null,
        ?DateTime $createdAt = null,
        ?DateTime $updatedAt = null
    ) {
        $this->validateId($id);
        $this->validateConnectionId($connectionId);
        $this->validatePhoneNumber($phoneNumber);
        $this->validateStatus($status);
        $this->validatePriority($priority);
        $this->validateType($type);

        $this->id = $id;
        $this->connectionId = $connectionId;
        $this->phoneNumber = $phoneNumber;
        $this->contactName = $contactName;
        $this->status = $status;
        $this->priority = $priority;
        $this->type = $type;
        $this->metadata = $metadata;
        $this->isActive = $isActive;
        $this->assignedAgentId = $assignedAgentId;
        $this->assignedAgentName = $assignedAgentName;
        $this->assignedAt = $assignedAt;
        $this->lastMessageAt = $lastMessageAt;
        $this->closedAt = $closedAt;
        $this->closeReason = $closeReason;
        $this->tags = $tags;
        $this->customFields = $customFields;
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
            connectionId: $data['connection_id'],
            phoneNumber: $data['phone_number'],
            contactName: $data['contact_name'] ?? null,
            status: $data['status'] ?? self::STATUS_OPEN,
            priority: $data['priority'] ?? self::PRIORITY_MEDIUM,
            type: $data['type'] ?? self::TYPE_CUSTOMER_SUPPORT,
            metadata: $data['metadata'] ?? [],
            isActive: $data['is_active'] ?? true,
            assignedAgentId: $data['assigned_agent_id'] ?? null,
            assignedAgentName: $data['assigned_agent_name'] ?? null,
            assignedAt: isset($data['assigned_at']) ? new DateTime($data['assigned_at']) : null,
            lastMessageAt: isset($data['last_message_at']) ? new DateTime($data['last_message_at']) : null,
            closedAt: isset($data['closed_at']) ? new DateTime($data['closed_at']) : null,
            closeReason: $data['close_reason'] ?? null,
            tags: $data['tags'] ?? null,
            customFields: $data['custom_fields'] ?? null,
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
            'connection_id' => $this->connectionId,
            'phone_number' => $this->phoneNumber,
            'contact_name' => $this->contactName,
            'status' => $this->status,
            'priority' => $this->priority,
            'type' => $this->type,
            'metadata' => $this->metadata,
            'is_active' => $this->isActive,
            'assigned_agent_id' => $this->assignedAgentId,
            'assigned_agent_name' => $this->assignedAgentName,
            'assigned_at' => $this->assignedAt?->format('Y-m-d H:i:s'),
            'last_message_at' => $this->lastMessageAt?->format('Y-m-d H:i:s'),
            'closed_at' => $this->closedAt?->format('Y-m-d H:i:s'),
            'close_reason' => $this->closeReason,
            'tags' => $this->tags,
            'custom_fields' => $this->customFields,
            'created_at' => $this->createdAt?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updatedAt?->format('Y-m-d H:i:s'),
        ];
    }

    // ===== VALIDATION METHODS =====

    private function validateId(string $id): void
    {
        if (empty(trim($id))) {
            throw new InvalidArgumentException('Chat ID cannot be empty');
        }
    }

    private function validateConnectionId(string $connectionId): void
    {
        if (empty(trim($connectionId))) {
            throw new InvalidArgumentException('Connection ID cannot be empty');
        }
    }

    private function validatePhoneNumber(string $phoneNumber): void
    {
        if (empty(trim($phoneNumber))) {
            throw new InvalidArgumentException('Phone number cannot be empty');
        }

        // Basic phone number validation
        if (!preg_match('/^\+?[1-9]\d{1,14}$/', $phoneNumber)) {
            throw new InvalidArgumentException('Invalid phone number format');
        }
    }

    private function validateStatus(string $status): void
    {
        $validStatuses = [
            self::STATUS_OPEN,
            self::STATUS_CLOSED,
            self::STATUS_PENDING,
            self::STATUS_ASSIGNED,
            self::STATUS_ESCALATED,
        ];

        if (!in_array($status, $validStatuses)) {
            throw new InvalidArgumentException("Invalid chat status: {$status}");
        }
    }

    private function validatePriority(string $priority): void
    {
        $validPriorities = [
            self::PRIORITY_LOW,
            self::PRIORITY_MEDIUM,
            self::PRIORITY_HIGH,
            self::PRIORITY_URGENT,
        ];

        if (!in_array($priority, $validPriorities)) {
            throw new InvalidArgumentException("Invalid chat priority: {$priority}");
        }
    }

    private function validateType(string $type): void
    {
        $validTypes = [
            self::TYPE_CUSTOMER_SUPPORT,
            self::TYPE_SALES,
            self::TYPE_LEAD_GENERATION,
            self::TYPE_FAQ,
            self::TYPE_COMPLAINT,
        ];

        if (!in_array($type, $validTypes)) {
            throw new InvalidArgumentException("Invalid chat type: {$type}");
        }
    }

    // ===== DOMAIN LOGIC METHODS =====

    public function assignToAgent(string $agentId, string $agentName): void
    {
        if ($this->status === self::STATUS_CLOSED) {
            throw new InvalidArgumentException('Cannot assign closed chat to agent');
        }

        $this->assignedAgentId = $agentId;
        $this->assignedAgentName = $agentName;
        $this->assignedAt = new DateTime();
        $this->status = self::STATUS_ASSIGNED;
        $this->updatedAt = new DateTime();
    }

    public function unassignFromAgent(): void
    {
        if ($this->status === self::STATUS_CLOSED) {
            throw new InvalidArgumentException('Cannot unassign closed chat from agent');
        }

        $this->assignedAgentId = null;
        $this->assignedAgentName = null;
        $this->assignedAt = null;
        $this->status = self::STATUS_OPEN;
        $this->updatedAt = new DateTime();
    }

    public function close(string $reason = null): void
    {
        if ($this->status === self::STATUS_CLOSED) {
            throw new InvalidArgumentException('Chat is already closed');
        }

        $this->status = self::STATUS_CLOSED;
        $this->closedAt = new DateTime();
        $this->closeReason = $reason;
        $this->updatedAt = new DateTime();
    }

    public function reopen(): void
    {
        if ($this->status !== self::STATUS_CLOSED) {
            throw new InvalidArgumentException('Can only reopen closed chats');
        }

        $this->status = self::STATUS_OPEN;
        $this->closedAt = null;
        $this->closeReason = null;
        $this->updatedAt = new DateTime();
    }

    public function escalate(): void
    {
        if ($this->status === self::STATUS_CLOSED) {
            throw new InvalidArgumentException('Cannot escalate closed chat');
        }

        $this->status = self::STATUS_ESCALATED;
        $this->priority = self::PRIORITY_HIGH;
        $this->updatedAt = new DateTime();
    }

    public function setPriority(string $priority): void
    {
        $this->validatePriority($priority);
        $this->priority = $priority;
        $this->updatedAt = new DateTime();
    }

    public function updateContactName(string $contactName): void
    {
        if (empty(trim($contactName))) {
            throw new InvalidArgumentException('Contact name cannot be empty');
        }

        $this->contactName = $contactName;
        $this->updatedAt = new DateTime();
    }

    public function updateMetadata(array $metadata): void
    {
        $this->metadata = $metadata;
        $this->updatedAt = new DateTime();
    }

    public function addTag(string $tag): void
    {
        if (empty(trim($tag))) {
            throw new InvalidArgumentException('Tag cannot be empty');
        }

        if (!$this->tags) {
            $this->tags = [];
        }

        if (!in_array($tag, $this->tags)) {
            $this->tags[] = $tag;
            $this->updatedAt = new DateTime();
        }
    }

    public function removeTag(string $tag): void
    {
        if ($this->tags) {
            $this->tags = array_filter($this->tags, function ($t) use ($tag) {
                return $t !== $tag;
            });
            $this->updatedAt = new DateTime();
        }
    }

    public function updateCustomField(string $field, mixed $value): void
    {
        if (empty(trim($field))) {
            throw new InvalidArgumentException('Custom field name cannot be empty');
        }

        if (!$this->customFields) {
            $this->customFields = [];
        }

        $this->customFields[$field] = $value;
        $this->updatedAt = new DateTime();
    }

    public function markMessageReceived(): void
    {
        $this->lastMessageAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    public function activate(): void
    {
        $this->isActive = true;
        $this->updatedAt = new DateTime();
    }

    public function deactivate(): void
    {
        $this->isActive = false;
        $this->updatedAt = new DateTime();
    }

    // ===== QUERY METHODS =====

    public function isOpen(): bool
    {
        return $this->status === self::STATUS_OPEN;
    }

    public function isClosed(): bool
    {
        return $this->status === self::STATUS_CLOSED;
    }

    public function isAssigned(): bool
    {
        return $this->status === self::STATUS_ASSIGNED;
    }

    public function isEscalated(): bool
    {
        return $this->status === self::STATUS_ESCALATED;
    }

    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isActive(): bool
    {
        return $this->isActive;
    }

    public function hasAgent(): bool
    {
        return !empty($this->assignedAgentId);
    }

    public function isHighPriority(): bool
    {
        return in_array($this->priority, [self::PRIORITY_HIGH, self::PRIORITY_URGENT]);
    }

    public function isUrgent(): bool
    {
        return $this->priority === self::PRIORITY_URGENT;
    }

    public function canBeAssigned(): bool
    {
        return in_array($this->status, [self::STATUS_OPEN, self::STATUS_PENDING]);
    }

    public function canBeClosed(): bool
    {
        return $this->status !== self::STATUS_CLOSED;
    }

    public function canBeEscalated(): bool
    {
        return in_array($this->status, [self::STATUS_OPEN, self::STATUS_ASSIGNED, self::STATUS_PENDING]);
    }

    public function hasTag(string $tag): bool
    {
        return $this->tags && in_array($tag, $this->tags);
    }

    public function getCustomField(string $field): mixed
    {
        return $this->customFields[$field] ?? null;
    }

    public function getMinutesSinceLastMessage(): ?int
    {
        if (!$this->lastMessageAt) {
            return null;
        }

        $now = new DateTime();
        $diff = $now->diff($this->lastMessageAt);
        return ($diff->days * 24 * 60) + ($diff->h * 60) + $diff->i;
    }

    public function getMinutesSinceCreated(): int
    {
        $now = new DateTime();
        $diff = $now->diff($this->createdAt);
        return ($diff->days * 24 * 60) + ($diff->h * 60) + $diff->i;
    }

    public function getDuration(): ?int
    {
        if (!$this->closedAt) {
            return null;
        }

        $diff = $this->closedAt->diff($this->createdAt);
        return ($diff->days * 24 * 60) + ($diff->h * 60) + $diff->i;
    }

    public function isStale(int $minutesThreshold = 30): bool
    {
        $minutesSinceLastMessage = $this->getMinutesSinceLastMessage();
        return $minutesSinceLastMessage !== null && $minutesSinceLastMessage > $minutesThreshold;
    }

    // ===== STATIC METHODS =====

    public static function getValidStatuses(): array
    {
        return [
            self::STATUS_OPEN,
            self::STATUS_CLOSED,
            self::STATUS_PENDING,
            self::STATUS_ASSIGNED,
            self::STATUS_ESCALATED,
        ];
    }

    public static function getValidPriorities(): array
    {
        return [
            self::PRIORITY_LOW,
            self::PRIORITY_MEDIUM,
            self::PRIORITY_HIGH,
            self::PRIORITY_URGENT,
        ];
    }

    public static function getValidTypes(): array
    {
        return [
            self::TYPE_CUSTOMER_SUPPORT,
            self::TYPE_SALES,
            self::TYPE_LEAD_GENERATION,
            self::TYPE_FAQ,
            self::TYPE_COMPLAINT,
        ];
    }
}
