<?php

namespace App\Domains\EmailMarketing\Domain;

use Illuminate\Support\Collection;

interface EmailBounceRepositoryInterface
{
    public function find(string $id): ?EmailBounce;

    public function findByLeadId(string $leadId): Collection;

    public function create(array $data): EmailBounce;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
