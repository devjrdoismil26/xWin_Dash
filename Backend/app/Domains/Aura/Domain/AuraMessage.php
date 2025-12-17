<?php

namespace App\Domains\Aura\Domain;

use DateTime;
use InvalidArgumentException;

class AuraMessage
{
    // Message type constants
    public const TYPE_TEXT = 'text';
    public const TYPE_IMAGE = 'image';
    public const TYPE_VIDEO = 'video';
    public const TYPE_AUDIO = 'audio';
    public const TYPE_DOCUMENT = 'document';
    public const TYPE_LOCATION = 'location';
    public const TYPE_CONTACT = 'contact';
    public const TYPE_STICKER = 'sticker';
    public const TYPE_TEMPLATE = 'template';
    public const TYPE_INTERACTIVE = 'interactive';

    // Direction constants
    public const DIRECTION_INBOUND = 'inbound';
    public const DIRECTION_OUTBOUND = 'outbound';

    // Status constants
    public const STATUS_PENDING = 'pending';
    public const STATUS_SENT = 'sent';
    public const STATUS_DELIVERED = 'delivered';
    public const STATUS_READ = 'read';
    public const STATUS_FAILED = 'failed';
    public const STATUS_CANCELLED = 'cancelled';

    public string $id;
    public string $chatId;
    public string $messageId;
    public string $type;
    public string $direction;
    public array $content;
    public array $metadata;
    public string $status;
    public ?string $senderId;
    public ?string $senderName;
    public ?string $recipientId;
    public ?string $recipientName;
    public ?DateTime $sentAt;
    public ?DateTime $deliveredAt;
    public ?DateTime $readAt;
    public ?string $errorMessage;
    public ?int $retryCount;
    public ?DateTime $createdAt;
    public ?DateTime $updatedAt;

    public function __construct(
        string $id,
        string $chatId,
        string $messageId,
        string $type,
        string $direction,
        array $content = [],
        array $metadata = [],
        string $status = self::STATUS_PENDING,
        ?string $senderId = null,
        ?string $senderName = null,
        ?string $recipientId = null,
        ?string $recipientName = null,
        ?DateTime $sentAt = null,
        ?DateTime $deliveredAt = null,
        ?DateTime $readAt = null,
        ?string $errorMessage = null,
        ?int $retryCount = null,
        ?DateTime $createdAt = null,
        ?DateTime $updatedAt = null
    ) {
        $this->validateId($id);
        $this->validateChatId($chatId);
        $this->validateMessageId($messageId);
        $this->validateType($type);
        $this->validateDirection($direction);
        $this->validateStatus($status);

        $this->id = $id;
        $this->chatId = $chatId;
        $this->messageId = $messageId;
        $this->type = $type;
        $this->direction = $direction;
        $this->content = $content;
        $this->metadata = $metadata;
        $this->status = $status;
        $this->senderId = $senderId;
        $this->senderName = $senderName;
        $this->recipientId = $recipientId;
        $this->recipientName = $recipientName;
        $this->sentAt = $sentAt;
        $this->deliveredAt = $deliveredAt;
        $this->readAt = $readAt;
        $this->errorMessage = $errorMessage;
        $this->retryCount = $retryCount ?? 0;
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
            chatId: $data['chat_id'],
            messageId: $data['message_id'],
            type: $data['type'],
            direction: $data['direction'],
            content: $data['content'] ?? [],
            metadata: $data['metadata'] ?? [],
            status: $data['status'] ?? self::STATUS_PENDING,
            senderId: $data['sender_id'] ?? null,
            senderName: $data['sender_name'] ?? null,
            recipientId: $data['recipient_id'] ?? null,
            recipientName: $data['recipient_name'] ?? null,
            sentAt: isset($data['sent_at']) ? new DateTime($data['sent_at']) : null,
            deliveredAt: isset($data['delivered_at']) ? new DateTime($data['delivered_at']) : null,
            readAt: isset($data['read_at']) ? new DateTime($data['read_at']) : null,
            errorMessage: $data['error_message'] ?? null,
            retryCount: $data['retry_count'] ?? null,
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
            'chat_id' => $this->chatId,
            'message_id' => $this->messageId,
            'type' => $this->type,
            'direction' => $this->direction,
            'content' => $this->content,
            'metadata' => $this->metadata,
            'status' => $this->status,
            'sender_id' => $this->senderId,
            'sender_name' => $this->senderName,
            'recipient_id' => $this->recipientId,
            'recipient_name' => $this->recipientName,
            'sent_at' => $this->sentAt?->format('Y-m-d H:i:s'),
            'delivered_at' => $this->deliveredAt?->format('Y-m-d H:i:s'),
            'read_at' => $this->readAt?->format('Y-m-d H:i:s'),
            'error_message' => $this->errorMessage,
            'retry_count' => $this->retryCount,
            'created_at' => $this->createdAt?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updatedAt?->format('Y-m-d H:i:s'),
        ];
    }

    // ===== VALIDATION METHODS =====

    private function validateId(string $id): void
    {
        if (empty(trim($id))) {
            throw new InvalidArgumentException('Message ID cannot be empty');
        }
    }

    private function validateChatId(string $chatId): void
    {
        if (empty(trim($chatId))) {
            throw new InvalidArgumentException('Chat ID cannot be empty');
        }
    }

    private function validateMessageId(string $messageId): void
    {
        if (empty(trim($messageId))) {
            throw new InvalidArgumentException('Message ID cannot be empty');
        }
    }

    private function validateType(string $type): void
    {
        $validTypes = [
            self::TYPE_TEXT,
            self::TYPE_IMAGE,
            self::TYPE_VIDEO,
            self::TYPE_AUDIO,
            self::TYPE_DOCUMENT,
            self::TYPE_LOCATION,
            self::TYPE_CONTACT,
            self::TYPE_STICKER,
            self::TYPE_TEMPLATE,
            self::TYPE_INTERACTIVE,
        ];

        if (!in_array($type, $validTypes)) {
            throw new InvalidArgumentException("Invalid message type: {$type}");
        }
    }

    private function validateDirection(string $direction): void
    {
        $validDirections = [
            self::DIRECTION_INBOUND,
            self::DIRECTION_OUTBOUND,
        ];

        if (!in_array($direction, $validDirections)) {
            throw new InvalidArgumentException("Invalid message direction: {$direction}");
        }
    }

    private function validateStatus(string $status): void
    {
        $validStatuses = [
            self::STATUS_PENDING,
            self::STATUS_SENT,
            self::STATUS_DELIVERED,
            self::STATUS_READ,
            self::STATUS_FAILED,
            self::STATUS_CANCELLED,
        ];

        if (!in_array($status, $validStatuses)) {
            throw new InvalidArgumentException("Invalid message status: {$status}");
        }
    }

    // ===== DOMAIN LOGIC METHODS =====

    public function markAsSent(): void
    {
        if ($this->status !== self::STATUS_PENDING) {
            throw new InvalidArgumentException('Can only mark pending messages as sent');
        }

        $this->status = self::STATUS_SENT;
        $this->sentAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    public function markAsDelivered(): void
    {
        if (!in_array($this->status, [self::STATUS_SENT, self::STATUS_PENDING])) {
            throw new InvalidArgumentException('Can only mark sent or pending messages as delivered');
        }

        $this->status = self::STATUS_DELIVERED;
        $this->deliveredAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    public function markAsRead(): void
    {
        if (!in_array($this->status, [self::STATUS_DELIVERED, self::STATUS_SENT])) {
            throw new InvalidArgumentException('Can only mark delivered or sent messages as read');
        }

        $this->status = self::STATUS_READ;
        $this->readAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    public function markAsFailed(string $errorMessage): void
    {
        if (empty(trim($errorMessage))) {
            throw new InvalidArgumentException('Error message cannot be empty');
        }

        $this->status = self::STATUS_FAILED;
        $this->errorMessage = $errorMessage;
        $this->updatedAt = new DateTime();
    }

    public function cancel(): void
    {
        if (!in_array($this->status, [self::STATUS_PENDING, self::STATUS_SENT])) {
            throw new InvalidArgumentException('Can only cancel pending or sent messages');
        }

        $this->status = self::STATUS_CANCELLED;
        $this->updatedAt = new DateTime();
    }

    public function retry(): void
    {
        if ($this->status !== self::STATUS_FAILED) {
            throw new InvalidArgumentException('Can only retry failed messages');
        }

        $this->status = self::STATUS_PENDING;
        $this->retryCount++;
        $this->errorMessage = null;
        $this->updatedAt = new DateTime();
    }

    public function updateContent(array $content): void
    {
        if ($this->status !== self::STATUS_PENDING) {
            throw new InvalidArgumentException('Can only update content of pending messages');
        }

        $this->content = $content;
        $this->updatedAt = new DateTime();
    }

    public function updateMetadata(array $metadata): void
    {
        $this->metadata = $metadata;
        $this->updatedAt = new DateTime();
    }

    public function setSender(string $senderId, string $senderName): void
    {
        if (empty(trim($senderId))) {
            throw new InvalidArgumentException('Sender ID cannot be empty');
        }

        if (empty(trim($senderName))) {
            throw new InvalidArgumentException('Sender name cannot be empty');
        }

        $this->senderId = $senderId;
        $this->senderName = $senderName;
        $this->updatedAt = new DateTime();
    }

    public function setRecipient(string $recipientId, string $recipientName): void
    {
        if (empty(trim($recipientId))) {
            throw new InvalidArgumentException('Recipient ID cannot be empty');
        }

        if (empty(trim($recipientName))) {
            throw new InvalidArgumentException('Recipient name cannot be empty');
        }

        $this->recipientId = $recipientId;
        $this->recipientName = $recipientName;
        $this->updatedAt = new DateTime();
    }

    // ===== QUERY METHODS =====

    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isSent(): bool
    {
        return $this->status === self::STATUS_SENT;
    }

    public function isDelivered(): bool
    {
        return $this->status === self::STATUS_DELIVERED;
    }

    public function isRead(): bool
    {
        return $this->status === self::STATUS_READ;
    }

    public function isFailed(): bool
    {
        return $this->status === self::STATUS_FAILED;
    }

    public function isCancelled(): bool
    {
        return $this->status === self::STATUS_CANCELLED;
    }

    public function isInbound(): bool
    {
        return $this->direction === self::DIRECTION_INBOUND;
    }

    public function isOutbound(): bool
    {
        return $this->direction === self::DIRECTION_OUTBOUND;
    }

    public function isText(): bool
    {
        return $this->type === self::TYPE_TEXT;
    }

    public function isMedia(): bool
    {
        return in_array($this->type, [
            self::TYPE_IMAGE,
            self::TYPE_VIDEO,
            self::TYPE_AUDIO,
            self::TYPE_DOCUMENT,
        ]);
    }

    public function isInteractive(): bool
    {
        return in_array($this->type, [
            self::TYPE_TEMPLATE,
            self::TYPE_INTERACTIVE,
        ]);
    }

    public function canBeRetried(): bool
    {
        return $this->status === self::STATUS_FAILED && $this->retryCount < 3;
    }

    public function canBeCancelled(): bool
    {
        return in_array($this->status, [self::STATUS_PENDING, self::STATUS_SENT]);
    }

    public function hasContent(): bool
    {
        return !empty($this->content);
    }

    public function hasError(): bool
    {
        return !empty($this->errorMessage);
    }

    public function getTextContent(): ?string
    {
        if ($this->type !== self::TYPE_TEXT) {
            return null;
        }

        return $this->content['text'] ?? null;
    }

    public function getMediaUrl(): ?string
    {
        if (!$this->isMedia()) {
            return null;
        }

        return $this->content['url'] ?? null;
    }

    public function getMinutesSinceSent(): ?int
    {
        if (!$this->sentAt) {
            return null;
        }

        $now = new DateTime();
        $diff = $now->diff($this->sentAt);
        return ($diff->days * 24 * 60) + ($diff->h * 60) + $diff->i;
    }

    public function getMinutesSinceDelivered(): ?int
    {
        if (!$this->deliveredAt) {
            return null;
        }

        $now = new DateTime();
        $diff = $now->diff($this->deliveredAt);
        return ($diff->days * 24 * 60) + ($diff->h * 60) + $diff->i;
    }

    public function getMinutesSinceRead(): ?int
    {
        if (!$this->readAt) {
            return null;
        }

        $now = new DateTime();
        $diff = $now->diff($this->readAt);
        return ($diff->days * 24 * 60) + ($diff->h * 60) + $diff->i;
    }

    public function getDeliveryTime(): ?int
    {
        if (!$this->sentAt || !$this->deliveredAt) {
            return null;
        }

        $diff = $this->deliveredAt->diff($this->sentAt);
        return ($diff->days * 24 * 60) + ($diff->h * 60) + $diff->i;
    }

    public function getReadTime(): ?int
    {
        if (!$this->deliveredAt || !$this->readAt) {
            return null;
        }

        $diff = $this->readAt->diff($this->deliveredAt);
        return ($diff->days * 24 * 60) + ($diff->h * 60) + $diff->i;
    }

    // ===== STATIC METHODS =====

    public static function getValidTypes(): array
    {
        return [
            self::TYPE_TEXT,
            self::TYPE_IMAGE,
            self::TYPE_VIDEO,
            self::TYPE_AUDIO,
            self::TYPE_DOCUMENT,
            self::TYPE_LOCATION,
            self::TYPE_CONTACT,
            self::TYPE_STICKER,
            self::TYPE_TEMPLATE,
            self::TYPE_INTERACTIVE,
        ];
    }

    public static function getValidDirections(): array
    {
        return [
            self::DIRECTION_INBOUND,
            self::DIRECTION_OUTBOUND,
        ];
    }

    public static function getValidStatuses(): array
    {
        return [
            self::STATUS_PENDING,
            self::STATUS_SENT,
            self::STATUS_DELIVERED,
            self::STATUS_READ,
            self::STATUS_FAILED,
            self::STATUS_CANCELLED,
        ];
    }

    public static function getMediaTypes(): array
    {
        return [
            self::TYPE_IMAGE,
            self::TYPE_VIDEO,
            self::TYPE_AUDIO,
            self::TYPE_DOCUMENT,
        ];
    }

    public static function getInteractiveTypes(): array
    {
        return [
            self::TYPE_TEMPLATE,
            self::TYPE_INTERACTIVE,
        ];
    }
}
