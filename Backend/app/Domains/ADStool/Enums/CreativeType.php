<?php

namespace App\Domains\ADStool\Enums;

enum CreativeType: string
{
    case Image = 'image';
    case Video = 'video';
    case Carousel = 'carousel';
    case Text = 'text';

    /**
     * @return array<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
