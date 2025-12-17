<?php

namespace App\Domains\SocialBuffer\Domain;

use Illuminate\Support\Collection;

interface ScheduleRepositoryInterface
{
    public function find(string $id): ?Schedule;

    public function findByPostId(string $postId): Collection;

    public function create(array $data): Schedule;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
