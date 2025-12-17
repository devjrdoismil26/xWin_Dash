<?php

namespace App\Domains\Products\Domain;

use Illuminate\Support\Collection;

interface ProductVariationRepositoryInterface
{
    public function find(string $id): ?ProductVariation;

    public function findByProductId(string $productId): Collection;

    public function create(array $data): ProductVariation;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
