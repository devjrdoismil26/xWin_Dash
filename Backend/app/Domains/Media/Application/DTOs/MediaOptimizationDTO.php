<?php

namespace App\Domains\Media\Application\DTOs;

readonly class MediaOptimizationDTO
{
    public function __construct(
        public string $media_id,
        public int $quality = 85,
        public string $format = 'webp',
        public ?array $resize = null,
        public ?array $watermark = null
    ) {}
}
