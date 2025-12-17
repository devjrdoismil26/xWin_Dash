<?php

namespace App\Domains\SocialBuffer\Application\Handlers;

use App\Domains\SocialBuffer\Application\Queries\ListSocialAccountsQuery;
use App\Domains\SocialBuffer\Domain\Repositories\SocialAccountRepositoryInterface;
use App\Domains\SocialBuffer\Domain\Services\SocialAccountService;
use Illuminate\Support\Facades\Log;

class ListSocialAccountsHandler
{
    public function __construct(
        private SocialAccountRepositoryInterface $socialAccountRepository,
        private SocialAccountService $socialAccountService
    ) {
    }

    public function handle(ListSocialAccountsQuery $query): array
    {
        try {
            // Validar dados da query
            $this->validateQuery($query);

            // Preparar filtros
            $filters = [
                'user_id' => $query->userId,
                'platform' => $query->platform,
                'is_active' => $query->isActive
            ];

            // Remover filtros vazios
            $filters = array_filter($filters, function ($value) {
                return $value !== null && $value !== '';
            });

            // Preparar opções de paginação
            $paginationOptions = [
                'page' => $query->page ?? 1,
                'per_page' => $query->perPage ?? 15,
                'sort_by' => $query->sortBy ?? 'created_at',
                'sort_direction' => $query->sortDirection ?? 'desc'
            ];

            // Buscar contas
            $result = $this->socialAccountRepository->findByFilters($filters, $paginationOptions);

            // Enriquecer com dados adicionais se solicitado
            if ($query->includeStats) {
                foreach ($result['data'] as &$account) {
                    $account['stats'] = $this->socialAccountService->getAccountStats($account);
                }
            }

            if ($query->includeFollowers) {
                foreach ($result['data'] as &$account) {
                    $account['followers'] = $this->socialAccountService->getFollowersCount($account);
                }
            }

            Log::info('Social accounts listed successfully', [
                'user_id' => $query->userId,
                'count' => count($result['data']),
                'filters' => $filters
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error('Error listing social accounts', [
                'user_id' => $query->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateQuery(ListSocialAccountsQuery $query): void
    {
        if (empty($query->userId)) {
            throw new \InvalidArgumentException('ID do usuário é obrigatório');
        }
    }
}
