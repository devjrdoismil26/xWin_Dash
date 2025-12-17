<?php

namespace App\Shared\Events;

class UserCreatedEvent extends BaseDomainEvent
{
    public function __construct(
        int $userId,
        string $userName,
        string $userEmail,
        ?int $projectId = null,
        ?array $metadata = null
    ) {
        parent::__construct(
            [
                'user_id' => $userId,
                'user_name' => $userName,
                'user_email' => $userEmail,
            ],
            $userId,
            $projectId,
            $metadata
        );
    }

    public static function getEventType(): string
    {
        return 'user.created';
    }

    public function getUserId(): int
    {
        return $this->payload['user_id'];
    }

    public function getUserName(): string
    {
        return $this->payload['user_name'];
    }

    public function getUserEmail(): string
    {
        return $this->payload['user_email'];
    }
}