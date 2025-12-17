<?php

namespace App\Domains\AI\Enums;

enum ImageAspectRatioEnum: string
{
    case SQUARE = 'square';
    case PORTRAIT = 'portrait';
    case LANDSCAPE = 'landscape';
}
