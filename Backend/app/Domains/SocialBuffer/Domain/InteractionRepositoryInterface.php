<?php

namespace App\Domains\SocialBuffer\Domain;

use Illuminate\Support\Collection;

interface InteractionRepositoryInterface
{
    public function find(string $id): ?Interaction;

    public function findBySocialAccountId(string $socialAccountId): Collection;

    public function create(array $data): Interaction;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
