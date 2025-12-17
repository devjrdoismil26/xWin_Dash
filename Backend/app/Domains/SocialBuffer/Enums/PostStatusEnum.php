<?php

namespace App\Domains\SocialBuffer\Enums;

enum PostStatusEnum: string
{
    case DRAFT = 'draft';
    case SCHEDULED = 'scheduled';
    case PUBLISHED = 'published';
    case PARTIALLY_PUBLISHED = 'partially_published';
    case FAILED = 'failed';
    case CANCELLED = 'cancelled';

    public static function getValues(): array
    {
        return array_column(self::cases(), 'value');
    }
}
