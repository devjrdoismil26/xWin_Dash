<?php

namespace App\Domains\Products\Application\Queries;

class GetProductBySkuQuery
{
    public function __construct(
        public readonly string $sku,
        public readonly bool $includeVariants = false
    ) {
    }

    public function toArray(): array
    {
        return [
            'sku' => $this->sku,
            'include_variants' => $this->includeVariants
        ];
    }
}
