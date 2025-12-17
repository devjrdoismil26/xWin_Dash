<?php

namespace App\Domains\Products\Application\Commands;

class UpdateProductStockCommand
{
    public function __construct(
        public readonly int $productId,
        public readonly int $quantity,
        public readonly string $operation, // 'add', 'subtract', 'set'
        public readonly ?string $reason = null
    ) {
    }

    public function toArray(): array
    {
        return [
            'product_id' => $this->productId,
            'quantity' => $this->quantity,
            'operation' => $this->operation,
            'reason' => $this->reason
        ];
    }
}
