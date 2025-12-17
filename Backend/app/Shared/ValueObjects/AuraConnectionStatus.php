<?php

namespace App\Shared\ValueObjects;

enum AuraConnectionStatus: string
{
    case CONNECTED = 'connected';
    case DISCONNECTED = 'disconnected';
    case PENDING = 'pending';
    case ERROR = 'error';
}
