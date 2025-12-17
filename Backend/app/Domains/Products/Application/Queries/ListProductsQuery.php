<?php

namespace App\Domains\Products\Application\Queries;

class ListProductsQuery
{
    public function __construct(
        public readonly ?string $search = null,
        public readonly ?string $category = null,
        public readonly ?float $minPrice = null,
        public readonly ?float $maxPrice = null,
        public readonly ?bool $isActive = null,
        public readonly ?bool $isDigital = null,
        public readonly ?array $tags = null,
        public readonly ?int $minStock = null,
        public readonly ?int $maxStock = null,
        public readonly ?string $dateFrom = null,
        public readonly ?string $dateTo = null,
        public readonly ?int $page = 1,
        public readonly ?int $perPage = 15,
        public readonly ?string $sortBy = 'created_at',
        public readonly ?string $sortDirection = 'desc',
        public readonly bool $includeVariants = false
    ) {
    }

    public function toArray(): array
    {
        return [
            'search' => $this->search,
            'category' => $this->category,
            'min_price' => $this->minPrice,
            'max_price' => $this->maxPrice,
            'is_active' => $this->isActive,
            'is_digital' => $this->isDigital,
            'tags' => $this->tags,
            'min_stock' => $this->minStock,
            'max_stock' => $this->maxStock,
            'date_from' => $this->dateFrom,
            'date_to' => $this->dateTo,
            'page' => $this->page,
            'per_page' => $this->perPage,
            'sort_by' => $this->sortBy,
            'sort_direction' => $this->sortDirection,
            'include_variants' => $this->includeVariants
        ];
    }
}
