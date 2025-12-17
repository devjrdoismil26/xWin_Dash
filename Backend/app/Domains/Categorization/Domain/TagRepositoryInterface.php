<?php

namespace App\Domains\Categorization\Domain;

use Illuminate\Support\Collection;

interface TagRepositoryInterface
{
    public function find(string $id): ?Tag;

    public function findByProjectId(string $projectId): Collection;

    public function create(array $data): Tag;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
