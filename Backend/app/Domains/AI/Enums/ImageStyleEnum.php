<?php

namespace App\Domains\AI\Enums;

enum ImageStyleEnum: string
{
    case PHOTOREALISTIC = 'photorealistic';
    case CARTOON = 'cartoon';
    case ABSTRACT = 'abstract';
    case SKETCH = 'sketch';
    case PAINTING = 'painting';
}
