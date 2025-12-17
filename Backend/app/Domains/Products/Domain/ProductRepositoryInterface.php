<?php

namespace App\Domains\Products\Domain;

use Illuminate\Support\Collection;

interface ProductRepositoryInterface
{
    public function find(string $id): ?Product;

    public function findByProjectId(string $projectId): Collection;

    public function create(array $data): Product;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
