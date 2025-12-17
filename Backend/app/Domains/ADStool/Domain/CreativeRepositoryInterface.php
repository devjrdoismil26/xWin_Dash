<?php

namespace App\Domains\ADStool\Domain;

use Illuminate\Database\Eloquent\Collection;
use App\Domains\ADStool\Models\Creative;

interface CreativeRepositoryInterface
{
    public function find(string $id): ?Creative;

    /**
     * @return Collection<int, Creative>
     */
    public function findByCampaignId(string $campaignId): Collection;

    /**
     * @param array<string, mixed> $data
     */
    public function create(array $data): Creative;

    /**
     * @param array<string, mixed> $data
     */
    public function update(string $id, array $data): Creative;

    public function delete(string $id): bool;
}
