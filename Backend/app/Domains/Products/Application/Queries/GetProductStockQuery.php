<?php

namespace App\Domains\Products\Application\Queries;

class GetProductStockQuery
{
    public function __construct(
        public readonly int $productId,
        public readonly bool $includeHistory = false
    ) {
    }

    public function toArray(): array
    {
        return [
            'product_id' => $this->productId,
            'include_history' => $this->includeHistory
        ];
    }
}
