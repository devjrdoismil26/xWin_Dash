<?php

namespace App\Domains\Products\Application\Commands;

class DeleteProductCommand
{
    public function __construct(
        public readonly int $productId,
        public readonly bool $forceDelete = false
    ) {
    }

    public function toArray(): array
    {
        return [
            'product_id' => $this->productId,
            'force_delete' => $this->forceDelete
        ];
    }
}
