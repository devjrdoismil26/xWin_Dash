<?php

namespace App\Domains\SocialBuffer\Application\Handlers;

use App\Domains\SocialBuffer\Application\Queries\GetSocialAccountQuery;
use App\Domains\SocialBuffer\Domain\Repositories\SocialAccountRepositoryInterface;
use App\Domains\SocialBuffer\Domain\Services\SocialAccountService;
use Illuminate\Support\Facades\Log;

class GetSocialAccountHandler
{
    public function __construct(
        private SocialAccountRepositoryInterface $socialAccountRepository,
        private SocialAccountService $socialAccountService
    ) {
    }

    public function handle(GetSocialAccountQuery $query): ?array
    {
        try {
            // Validar dados da query
            $this->validateQuery($query);

            // Buscar a conta
            $account = $this->socialAccountRepository->findById($query->accountId);

            if (!$account) {
                return null;
            }

            // Verificar permissões
            if ($account->user_id !== $query->userId) {
                throw new \Exception('Usuário não tem permissão para visualizar esta conta');
            }

            // Enriquecer com dados adicionais se solicitado
            $result = $account->toArray();

            if ($query->includeStats) {
                $result['stats'] = $this->socialAccountService->getAccountStats($account);
            }

            if ($query->includePosts) {
                $result['recent_posts'] = $this->socialAccountService->getRecentPosts($account, 10);
            }

            if ($query->includeFollowers) {
                $result['followers'] = $this->socialAccountService->getFollowersCount($account);
            }

            Log::info('Social account retrieved successfully', [
                'account_id' => $query->accountId,
                'user_id' => $query->userId
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error('Error retrieving social account', [
                'account_id' => $query->accountId,
                'user_id' => $query->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateQuery(GetSocialAccountQuery $query): void
    {
        if (empty($query->accountId)) {
            throw new \InvalidArgumentException('ID da conta é obrigatório');
        }

        if (empty($query->userId)) {
            throw new \InvalidArgumentException('ID do usuário é obrigatório');
        }
    }
}
