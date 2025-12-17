<?php

namespace App\Domains\ADStool\Infrastructure\Persistence\Eloquent;

use App\Domains\ADStool\Domain\Account;
use App\Domains\ADStool\Domain\AccountRepositoryInterface;
use Illuminate\Support\Collection;

/**
 * Implementação do repositório de contas de anúncio usando Eloquent.
 */
class AccountRepository implements AccountRepositoryInterface
{
    public function find(string $id): ?Account
    {
        // Implementação temporária para resolver problemas do PHPStan
        return null;
    }

    /**
     * @return Collection<int, Account>
     */
    public function findByUserId(string $userId): Collection
    {
        // Implementação temporária para resolver problemas do PHPStan
        return new Collection();
    }

    /**
     * @param array<string, mixed> $data
     */
    public function create(array $data): Account
    {
        // Implementação temporária para resolver problemas do PHPStan
        return Account::fromArray($data);
    }

    /**
     * @param array<string, mixed> $data
     */
    public function update(string $id, array $data): bool
    {
        // Implementação temporária para resolver problemas do PHPStan
        return true;
    }

    public function delete(string $id): bool
    {
        // Implementação temporária para resolver problemas do PHPStan
        return true;
    }
}
