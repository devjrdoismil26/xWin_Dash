<?php

namespace App\Domains\ADStool\Services;

use App\Domains\ADStool\Domain\Account;
use App\Domains\ADStool\Domain\AccountRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

/**
 * Serviço para gerenciar a lógica de negócio relacionada a contas de anúncio.
 */
class AccountService
{
    /**
     * @var AccountRepositoryInterface
     */
    protected AccountRepositoryInterface $accountRepository;

    /**
     * @param AccountRepositoryInterface $accountRepository
     */
    public function __construct(AccountRepositoryInterface $accountRepository)
    {
        $this->accountRepository = $accountRepository;
    }

    /**
     * Cria uma nova conta de anúncios.
     *
     * @param array<string, mixed> $data
     *
     * @return Account
     */
    public function createAccount(array $data): Account
    {
        $data['user_id'] = Auth::id();
        return $this->accountRepository->create($data);
    }

    /**
     * Atualiza uma conta de anúncios existente.
     *
     * @param int   $accountId
     * @param array<string, mixed> $data
     *
     * @return Account
     */
    /**
     * @param string $accountId
     * @param array<string, mixed> $data
     */
    public function updateAccount(string $accountId, array $data): bool
    {
        return $this->accountRepository->update($accountId, $data);
    }

    /**
     * Deleta uma conta de anúncios.
     *
     * @param string $accountId
     *
     * @return bool
     */
    public function deleteAccount(string $accountId): bool
    {
        return $this->accountRepository->delete($accountId);
    }

    /**
     * Encontra uma conta pelo seu ID.
     *
     * @param string $accountId
     *
     * @return Account|null
     */
    public function findAccountById(string $accountId): ?Account
    {
        return $this->accountRepository->find($accountId);
    }

    /**
     * Retorna todas as contas de um usuário.
     *
     * @param string $userId
     *
     * @return Collection<int, Account>
     */
    public function getAccountsForUser(string $userId): Collection
    {
        return $this->accountRepository->findByUserId($userId);
    }
}
