<?php

namespace App\Domains\Products\Domain;

use Illuminate\Support\Collection;

interface LeadCaptureFormRepositoryInterface
{
    public function getAll(int $perPage = 15);

    public function find(string $id): ?LeadCaptureForm;

    public function findByProjectId(string $projectId): Collection;

    public function create(array $data): LeadCaptureForm;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
