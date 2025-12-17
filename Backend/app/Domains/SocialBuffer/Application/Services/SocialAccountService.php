<?php

namespace App\Domains\SocialBuffer\Application\Services;

use App\Domains\SocialBuffer\Application\UseCases\CreateSocialAccountUseCase;
use App\Domains\SocialBuffer\Application\UseCases\UpdateSocialAccountUseCase;
use App\Domains\SocialBuffer\Application\UseCases\DeleteSocialAccountUseCase;
use App\Domains\SocialBuffer\Application\UseCases\GetSocialAccountUseCase;
use App\Domains\SocialBuffer\Application\UseCases\ListSocialAccountsUseCase;
use App\Domains\SocialBuffer\Application\Commands\CreateSocialAccountCommand;
use App\Domains\SocialBuffer\Application\Commands\UpdateSocialAccountCommand;
use App\Domains\SocialBuffer\Application\Commands\DeleteSocialAccountCommand;
use App\Domains\SocialBuffer\Application\Queries\GetSocialAccountQuery;
use App\Domains\SocialBuffer\Application\Queries\ListSocialAccountsQuery;
use App\Domains\SocialBuffer\Domain\SocialAccount;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

/**
 * Serviço especializado para gerenciamento de contas sociais
 */
class SocialAccountService
{
    private CreateSocialAccountUseCase $createSocialAccountUseCase;
    private UpdateSocialAccountUseCase $updateSocialAccountUseCase;
    private DeleteSocialAccountUseCase $deleteSocialAccountUseCase;
    private GetSocialAccountUseCase $getSocialAccountUseCase;
    private ListSocialAccountsUseCase $listSocialAccountsUseCase;

    public function __construct(
        CreateSocialAccountUseCase $createSocialAccountUseCase,
        UpdateSocialAccountUseCase $updateSocialAccountUseCase,
        DeleteSocialAccountUseCase $deleteSocialAccountUseCase,
        GetSocialAccountUseCase $getSocialAccountUseCase,
        ListSocialAccountsUseCase $listSocialAccountsUseCase
    ) {
        $this->createSocialAccountUseCase = $createSocialAccountUseCase;
        $this->updateSocialAccountUseCase = $updateSocialAccountUseCase;
        $this->deleteSocialAccountUseCase = $deleteSocialAccountUseCase;
        $this->getSocialAccountUseCase = $getSocialAccountUseCase;
        $this->listSocialAccountsUseCase = $listSocialAccountsUseCase;
    }

    /**
     * Cria uma nova conta social
     */
    public function createSocialAccount(array $data): array
    {
        try {
            $command = CreateSocialAccountCommand::fromArray($data);
            return $this->createSocialAccountUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in SocialAccountService::createSocialAccount', [
                'error' => $exception->getMessage(),
                'data' => $data
            ]);

            throw $exception;
        }
    }

    /**
     * Atualiza uma conta social existente
     */
    public function updateSocialAccount(int $accountId, array $data): array
    {
        try {
            $command = UpdateSocialAccountCommand::fromArray(array_merge($data, ['id' => $accountId]));
            return $this->updateSocialAccountUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in SocialAccountService::updateSocialAccount', [
                'error' => $exception->getMessage(),
                'accountId' => $accountId,
                'data' => $data
            ]);

            throw $exception;
        }
    }

    /**
     * Remove uma conta social
     */
    public function deleteSocialAccount(int $accountId): array
    {
        try {
            $command = DeleteSocialAccountCommand::fromArray(['id' => $accountId]);
            return $this->deleteSocialAccountUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in SocialAccountService::deleteSocialAccount', [
                'error' => $exception->getMessage(),
                'accountId' => $accountId
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém uma conta social por ID
     */
    public function getSocialAccount(int $accountId): array
    {
        try {
            $query = GetSocialAccountQuery::fromArray(['id' => $accountId]);
            return $this->getSocialAccountUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in SocialAccountService::getSocialAccount', [
                'error' => $exception->getMessage(),
                'accountId' => $accountId
            ]);

            throw $exception;
        }
    }

    /**
     * Lista contas sociais com filtros
     */
    public function listSocialAccounts(array $filters = []): array
    {
        try {
            $query = ListSocialAccountsQuery::fromArray($filters);
            return $this->listSocialAccountsUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in SocialAccountService::listSocialAccounts', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém contas sociais por plataforma
     */
    public function getSocialAccountsByPlatform(string $platform, array $filters = []): array
    {
        try {
            $filters['platform'] = $platform;
            $query = ListSocialAccountsQuery::fromArray($filters);
            return $this->listSocialAccountsUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in SocialAccountService::getSocialAccountsByPlatform', [
                'error' => $exception->getMessage(),
                'platform' => $platform,
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém contas sociais ativas
     */
    public function getActiveSocialAccounts(array $filters = []): array
    {
        try {
            $filters['status'] = 'active';
            $query = ListSocialAccountsQuery::fromArray($filters);
            return $this->listSocialAccountsUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in SocialAccountService::getActiveSocialAccounts', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém contas sociais conectadas
     */
    public function getConnectedSocialAccounts(array $filters = []): array
    {
        try {
            $filters['status'] = 'connected';
            $query = ListSocialAccountsQuery::fromArray($filters);
            return $this->listSocialAccountsUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in SocialAccountService::getConnectedSocialAccounts', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém contas sociais por usuário
     */
    public function getSocialAccountsByUser(int $userId, array $filters = []): array
    {
        try {
            $filters['user_id'] = $userId;
            $query = ListSocialAccountsQuery::fromArray($filters);
            return $this->listSocialAccountsUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in SocialAccountService::getSocialAccountsByUser', [
                'error' => $exception->getMessage(),
                'userId' => $userId,
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém estatísticas de contas sociais
     */
    public function getSocialAccountStatistics(array $filters = []): array
    {
        try {
            $cacheKey = 'social_account_statistics_' . md5(serialize($filters));

            return Cache::remember($cacheKey, 300, function () use ($filters) {
                $allAccounts = $this->listSocialAccounts($filters);

                $statistics = [
                    'total_accounts' => count($allAccounts['data'] ?? []),
                    'active_accounts' => 0,
                    'connected_accounts' => 0,
                    'disconnected_accounts' => 0,
                    'accounts_by_platform' => [],
                    'accounts_by_status' => [],
                    'total_followers' => 0,
                    'average_followers' => 0,
                ];

                foreach ($allAccounts['data'] ?? [] as $account) {
                    $status = $account['status'] ?? 'unknown';
                    $platform = $account['platform'] ?? 'unknown';
                    $followers = $account['followers_count'] ?? 0;

                    // Contar por status
                    if (!isset($statistics['accounts_by_status'][$status])) {
                        $statistics['accounts_by_status'][$status] = 0;
                    }
                    $statistics['accounts_by_status'][$status]++;

                    // Contar por plataforma
                    if (!isset($statistics['accounts_by_platform'][$platform])) {
                        $statistics['accounts_by_platform'][$platform] = 0;
                    }
                    $statistics['accounts_by_platform'][$platform]++;

                    // Somar seguidores
                    $statistics['total_followers'] += $followers;

                    // Contar contas ativas
                    if ($status === 'active') {
                        $statistics['active_accounts']++;
                    }

                    // Contar contas conectadas
                    if ($status === 'connected') {
                        $statistics['connected_accounts']++;
                    }

                    // Contar contas desconectadas
                    if ($status === 'disconnected') {
                        $statistics['disconnected_accounts']++;
                    }
                }

                if ($statistics['total_accounts'] > 0) {
                    $statistics['average_followers'] = $statistics['total_followers'] / $statistics['total_accounts'];
                }

                return $statistics;
            });
        } catch (\Throwable $exception) {
            Log::error('Error in SocialAccountService::getSocialAccountStatistics', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém contagem de contas por plataforma
     */
    public function getAccountsCountByPlatform(): array
    {
        try {
            $cacheKey = 'accounts_count_by_platform';

            return Cache::remember($cacheKey, 300, function () {
                $statistics = $this->getSocialAccountStatistics();
                return $statistics['accounts_by_platform'] ?? [];
            });
        } catch (\Throwable $exception) {
            Log::error('Error in SocialAccountService::getAccountsCountByPlatform', [
                'error' => $exception->getMessage()
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém contagem de contas por status
     */
    public function getAccountsCountByStatus(): array
    {
        try {
            $cacheKey = 'accounts_count_by_status';

            return Cache::remember($cacheKey, 300, function () {
                $statistics = $this->getSocialAccountStatistics();
                return $statistics['accounts_by_status'] ?? [];
            });
        } catch (\Throwable $exception) {
            Log::error('Error in SocialAccountService::getAccountsCountByStatus', [
                'error' => $exception->getMessage()
            ]);

            throw $exception;
        }
    }

    /**
     * Verifica se conta social existe
     */
    public function socialAccountExists(int $accountId): bool
    {
        try {
            $account = $this->getSocialAccount($accountId);
            return !empty($account);
        } catch (\Throwable $exception) {
            Log::error('Error in SocialAccountService::socialAccountExists', [
                'error' => $exception->getMessage(),
                'accountId' => $accountId
            ]);

            return false;
        }
    }

    /**
     * Verifica se conta social está conectada
     */
    public function isSocialAccountConnected(int $accountId): bool
    {
        try {
            $account = $this->getSocialAccount($accountId);
            return ($account['status'] ?? '') === 'connected';
        } catch (\Throwable $exception) {
            Log::error('Error in SocialAccountService::isSocialAccountConnected', [
                'error' => $exception->getMessage(),
                'accountId' => $accountId
            ]);

            return false;
        }
    }

    /**
     * Obtém contas sociais disponíveis para postagem
     */
    public function getAvailableAccountsForPosting(array $filters = []): array
    {
        try {
            $filters['status'] = 'connected';
            $filters['can_post'] = true;
            $query = ListSocialAccountsQuery::fromArray($filters);
            return $this->listSocialAccountsUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in SocialAccountService::getAvailableAccountsForPosting', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém contas sociais por tipo de conteúdo
     */
    public function getAccountsByContentType(string $contentType, array $filters = []): array
    {
        try {
            $filters['supported_content_types'] = $contentType;
            $query = ListSocialAccountsQuery::fromArray($filters);
            return $this->listSocialAccountsUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in SocialAccountService::getAccountsByContentType', [
                'error' => $exception->getMessage(),
                'contentType' => $contentType,
                'filters' => $filters
            ]);

            throw $exception;
        }
    }
}
