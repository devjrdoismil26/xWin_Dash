<?php

namespace App\Domains\Products\Application\DTOs;

readonly class LandingPageDTO
{
    public function __construct(
        public string $product_id,
        public string $title,
        public string $slug,
        public array $content,
        public array $seo = [],
        public array $settings = []
    ) {}
}
