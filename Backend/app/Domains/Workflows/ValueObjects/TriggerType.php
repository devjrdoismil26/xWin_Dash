<?php

namespace App\Domains\Workflows\ValueObjects;

enum TriggerType: string
{
    case MANUAL = 'manual';
    case EVENT = 'event';
    case SCHEDULE = 'schedule';
    case WEBHOOK = 'webhook';
    case LEAD_CREATED = 'lead_created';
    case LEAD_UPDATED = 'lead_updated';
    case MESSAGE_RECEIVED = 'message_received';
    case CAMPAIGN_COMPLETED = 'campaign_completed';
    case FORM_SUBMITTED = 'form_submitted';
}
