<?php

namespace App\Domains\SocialBuffer\Enums;

enum PostTypeEnum: string
{
    case TEXT = 'text';
    case IMAGE = 'image';
    case VIDEO = 'video';
    case CAROUSEL = 'carousel';

    public static function getValues(): array
    {
        return array_column(self::cases(), 'value');
    }
}
