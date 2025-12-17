<?php

namespace App\Domains\Auth\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserLoggedIn
{
    use Dispatchable;
    use SerializesModels;

    public string $userId;

    public ?string $ipAddress;

    public ?string $userAgent;

    public function __construct(string $userId, ?string $ipAddress = null, ?string $userAgent = null)
    {
        $this->userId = $userId;
        $this->ipAddress = $ipAddress;
        $this->userAgent = $userAgent;
    }
}
