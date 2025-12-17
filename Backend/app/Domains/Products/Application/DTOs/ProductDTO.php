<?php

namespace App\Domains\Products\Application\DTOs;

readonly class ProductDTO
{
    public function __construct(
        public string $name,
        public string $description,
        public float $price,
        public ?string $category_id,
        public bool $is_active = true,
        public array $metadata = []
    ) {}
}
