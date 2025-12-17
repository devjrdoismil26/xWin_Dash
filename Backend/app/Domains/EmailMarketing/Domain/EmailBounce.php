<?php

namespace App\Domains\EmailMarketing\Domain;

use DateTime;
use InvalidArgumentException;

/**
 * Email Bounce Domain Model
 * 
 * Represents an email bounce event in the email marketing domain.
 * Encapsulates bounce information and business rules.
 */
class EmailBounce
{
    public ?int $id;
    public int $emailId;
    public int $subscriberId;
    public string $emailAddress;
    public string $bounceType; // 'hard', 'soft', 'complaint'
    public string $bounceReason;
    public ?string $bounceMessage;
    public DateTime $bouncedAt;
    public ?DateTime $createdAt;
    public ?DateTime $updatedAt;

    public function __construct(
        int $emailId,
        int $subscriberId,
        string $emailAddress,
        string $bounceType,
        string $bounceReason,
        ?string $bounceMessage = null,
        ?DateTime $bouncedAt = null,
        ?int $id = null,
        ?DateTime $createdAt = null,
        ?DateTime $updatedAt = null
    ) {
        $this->validateBounceType($bounceType);
        $this->validateEmailAddress($emailAddress);
        
        $this->id = $id;
        $this->emailId = $emailId;
        $this->subscriberId = $subscriberId;
        $this->emailAddress = $emailAddress;
        $this->bounceType = $bounceType;
        $this->bounceReason = $bounceReason;
        $this->bounceMessage = $bounceMessage;
        $this->bouncedAt = $bouncedAt ?? new DateTime();
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    private function validateBounceType(string $bounceType): void
    {
        $validTypes = ['hard', 'soft', 'complaint'];
        if (!in_array($bounceType, $validTypes)) {
            throw new InvalidArgumentException("Invalid bounce type. Must be one of: " . implode(', ', $validTypes));
        }
    }

    private function validateEmailAddress(string $emailAddress): void
    {
        if (!filter_var($emailAddress, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException("Invalid email address");
        }
    }

    /**
     * Check if this is a hard bounce.
     * 
     * @return bool
     */
    public function isHardBounce(): bool
    {
        return $this->bounceType === 'hard';
    }

    /**
     * Check if this is a soft bounce.
     * 
     * @return bool
     */
    public function isSoftBounce(): bool
    {
        return $this->bounceType === 'soft';
    }

    /**
     * Check if this is a complaint.
     * 
     * @return bool
     */
    public function isComplaint(): bool
    {
        return $this->bounceType === 'complaint';
    }

    /**
     * Get summary of the bounce.
     * 
     * @return array
     */
    public function getSummary(): array
    {
        return [
            'id' => $this->id,
            'email_id' => $this->emailId,
            'subscriber_id' => $this->subscriberId,
            'email_address' => $this->emailAddress,
            'bounce_type' => $this->bounceType,
            'bounce_reason' => $this->bounceReason,
            'bounce_message' => $this->bounceMessage,
            'bounced_at' => $this->bouncedAt->format('Y-m-d H:i:s'),
            'created_at' => $this->createdAt?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updatedAt?->format('Y-m-d H:i:s')
        ];
    }
}
