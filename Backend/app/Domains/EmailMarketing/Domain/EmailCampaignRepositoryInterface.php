<?php

namespace App\Domains\EmailMarketing\Domain;

use Illuminate\Support\Collection;

interface EmailCampaignRepositoryInterface
{
    public function find(string $id): ?EmailCampaign;

    public function findByProjectId(string $projectId): Collection;

    public function create(array $data): EmailCampaign;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
