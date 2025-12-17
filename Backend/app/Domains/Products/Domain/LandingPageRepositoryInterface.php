<?php

namespace App\Domains\Products\Domain;

use Illuminate\Support\Collection;

interface LandingPageRepositoryInterface
{
    public function getAll(int $perPage = 15);

    public function find(string $id): ?LandingPage;

    public function findByProjectId(string $projectId): Collection;

    public function create(array $data): LandingPage;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
