<?php

namespace App\Domains\Products\Application\DTOs;

readonly class VariationDTO
{
    public function __construct(
        public string $product_id,
        public string $name,
        public string $sku,
        public float $price,
        public int $stock,
        public array $attributes = []
    ) {}
}
