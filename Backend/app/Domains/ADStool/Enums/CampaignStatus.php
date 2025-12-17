<?php

namespace App\Domains\ADStool\Enums;

enum CampaignStatus: string
{
    case Active = 'active';
    case Paused = 'paused';
    case Completed = 'completed';
    case Pending = 'pending';
    case Failed = 'failed';
}
