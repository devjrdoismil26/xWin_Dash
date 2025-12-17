<?php

namespace App\Domains\Products\Application\Commands;

class CreateProductCommand
{
    public function __construct(
        public readonly string $name,
        public readonly string $description,
        public readonly ?string $sku = null,
        public readonly ?float $price = null,
        public readonly ?float $cost = null,
        public readonly ?int $stock = null,
        public readonly ?string $category = null,
        public readonly ?array $images = null,
        public readonly ?array $specifications = null,
        public readonly ?array $tags = null,
        public readonly ?bool $isActive = true,
        public readonly ?bool $isDigital = false,
        public readonly ?array $variants = null
    ) {
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'description' => $this->description,
            'sku' => $this->sku,
            'price' => $this->price,
            'cost' => $this->cost,
            'stock' => $this->stock,
            'category' => $this->category,
            'images' => $this->images,
            'specifications' => $this->specifications,
            'tags' => $this->tags,
            'is_active' => $this->isActive,
            'is_digital' => $this->isDigital,
            'variants' => $this->variants
        ];
    }
}
