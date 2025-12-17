<?php

namespace App\Application\Core\Commands;

class CreateNotificationCommand
{
    public int $userId;

    public string $message;

    public string $type;

    public ?string $link;

    public function __construct(int $userId, string $message, string $type = 'info', ?string $link = null)
    {
        $this->userId = $userId;
        $this->message = $message;
        $this->type = $type;
        $this->link = $link;
    }
}
