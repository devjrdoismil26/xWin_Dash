<?php

namespace App\Domains\AI\Enums;

enum AIGenerationStatus: string
{
    case PENDING = 'pending';
    case PROCESSING = 'processing';
    case COMPLETED = 'completed';
    case FAILED = 'failed';
    // ... outros status
}
