<?php

namespace App\Domains\SocialBuffer\Services;

use App\Domains\SocialBuffer\Domain\SocialAccount; // Supondo que a entidade de domínio exista
use App\Domains\SocialBuffer\Domain\SocialAccountRepositoryInterface; // Supondo que o repositório exista
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;

class SocialAccountService
{
    protected SocialAccountRepositoryInterface $socialAccountRepository;

    public function __construct(SocialAccountRepositoryInterface $socialAccountRepository)
    {
        $this->socialAccountRepository = $socialAccountRepository;
    }

    /**
     * Cria ou atualiza uma conta social.
     *
     * @param int         $userId         o ID do usuário proprietário da conta
     * @param string      $platform       a plataforma social (ex: 'facebook', 'twitter')
     * @param string      $platformUserId o ID do usuário na plataforma social
     * @param string      $username       o nome de usuário na plataforma social
     * @param string      $accessToken    o token de acesso da API
     * @param string|null $refreshToken   o refresh token (opcional)
     * @param int|null    $expiresIn      tempo de expiração do token em segundos (opcional)
     *
     * @return SocialAccount
     */
    public function createOrUpdateSocialAccount(
        int $userId,
        string $platform,
        string $platformUserId,
        string $username,
        string $accessToken,
        ?string $refreshToken = null,
        ?int $expiresIn = null,
    ): SocialAccount {
        $existingAccount = $this->socialAccountRepository->findByPlatformAndPlatformUserId($platform, $platformUserId);

        $data = [
            'user_id' => $userId,
            'platform' => $platform,
            'platform_user_id' => $platformUserId,
            'username' => $username,
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
            'expires_at' => $expiresIn ? now()->addSeconds($expiresIn) : null,
        ];

        if ($existingAccount) {
            $socialAccount = $this->socialAccountRepository->update($existingAccount->id, $data);
            Log::info("Conta social atualizada: {$platform} - {$username} (ID: {$socialAccount->id}).");
        } else {
            $socialAccount = $this->socialAccountRepository->create($data);
            Log::info("Conta social criada: {$platform} - {$username} (ID: {$socialAccount->id}).");
        }

        return $socialAccount;
    }

    /**
     * Obtém uma conta social pelo seu ID.
     *
     * @param int $id o ID da conta social
     *
     * @return SocialAccount|null
     */
    public function getSocialAccountById(int $id): ?SocialAccount
    {
        return $this->socialAccountRepository->find($id);
    }

    /**
     * Deleta uma conta social pelo seu ID.
     *
     * @param int $id o ID da conta social
     *
     * @return bool
     */
    public function deleteSocialAccount(int $id): bool
    {
        $success = $this->socialAccountRepository->delete($id);
        if ($success) {
            Log::info("Conta social ID: {$id} deletada com sucesso.");
        }
        return $success;
    }

    /**
     * Retorna todas as contas sociais paginadas para um usuário.
     *
     * @param int $userId  o ID do usuário
     * @param int $perPage número de itens por página
     *
     * @return LengthAwarePaginator
     */
    public function getAllSocialAccounts(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->socialAccountRepository->getAllPaginated($userId, $perPage);
    }
}
