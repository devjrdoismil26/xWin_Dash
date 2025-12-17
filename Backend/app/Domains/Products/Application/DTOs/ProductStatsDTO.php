<?php

namespace App\Domains\Products\Application\DTOs;

readonly class ProductStatsDTO
{
    public function __construct(
        public int $total_products,
        public int $active_products,
        public int $total_variations,
        public int $low_stock_count,
        public float $revenue_potential
    ) {}
}
