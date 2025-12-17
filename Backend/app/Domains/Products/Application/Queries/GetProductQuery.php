<?php

namespace App\Domains\Products\Application\Queries;

class GetProductQuery
{
    public function __construct(
        public readonly int $productId,
        public readonly bool $includeVariants = false,
        public readonly bool $includeReviews = false,
        public readonly bool $includeAnalytics = false
    ) {
    }

    public function toArray(): array
    {
        return [
            'product_id' => $this->productId,
            'include_variants' => $this->includeVariants,
            'include_reviews' => $this->includeReviews,
            'include_analytics' => $this->includeAnalytics
        ];
    }
}
