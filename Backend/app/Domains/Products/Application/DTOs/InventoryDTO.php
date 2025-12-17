<?php

namespace App\Domains\Products\Application\DTOs;

readonly class InventoryDTO
{
    public function __construct(
        public string $variation_id,
        public int $quantity,
        public string $operation,
        public string $reason
    ) {}
}
