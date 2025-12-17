<?php

namespace App\Domains\Auth\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class FailedLoginAttempt
{
    use Dispatchable, SerializesModels;

    public string $email;
    public string $ip;
    public string $timestamp;

    public function __construct(string $email, string $ip)
    {
        $this->email = $email;
        $this->ip = $ip;
        $this->timestamp = now()->toIso8601String();
    }
}
