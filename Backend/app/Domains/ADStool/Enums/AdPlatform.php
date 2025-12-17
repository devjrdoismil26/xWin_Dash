<?php

namespace App\Domains\ADStool\Enums;

enum AdPlatform: string
{
    case Google = 'google';
    case Facebook = 'facebook';
    case TikTok = 'tiktok';

    /**
     * @return array<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
