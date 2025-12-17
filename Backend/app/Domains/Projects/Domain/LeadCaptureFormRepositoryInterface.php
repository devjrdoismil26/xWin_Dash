<?php

namespace App\Domains\Projects\Domain;

use Illuminate\Support\Collection;

interface LeadCaptureFormRepositoryInterface
{
    public function find(string $id): ?LeadCaptureForm;

    /**
     * @return Collection<int, LeadCaptureForm>
     */
    public function findByProjectId(string $projectId): Collection;

    /**
     * @param array<string, mixed> $data
     */
    public function create(array $data): LeadCaptureForm;

    /**
     * @param array<string, mixed> $data
     */
    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
