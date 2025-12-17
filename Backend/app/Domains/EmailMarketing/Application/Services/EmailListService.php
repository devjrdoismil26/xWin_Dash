<?php

namespace App\Domains\EmailMarketing\Application\Services;

use App\Domains\EmailMarketing\Application\UseCases\CreateEmailListUseCase;
use App\Domains\EmailMarketing\Application\UseCases\UpdateEmailListUseCase;
use App\Domains\EmailMarketing\Application\UseCases\DeleteEmailListUseCase;
use App\Domains\EmailMarketing\Application\UseCases\GetEmailListUseCase;
use App\Domains\EmailMarketing\Application\UseCases\ListEmailListsUseCase;
use App\Domains\EmailMarketing\Application\UseCases\AddSubscriberUseCase;
use App\Domains\EmailMarketing\Application\Commands\CreateEmailListCommand;
use App\Domains\EmailMarketing\Application\Commands\UpdateEmailListCommand;
use App\Domains\EmailMarketing\Application\Commands\DeleteEmailListCommand;
use App\Domains\EmailMarketing\Application\Commands\AddSubscriberCommand;
use App\Domains\EmailMarketing\Application\Queries\GetEmailListQuery;
use App\Domains\EmailMarketing\Application\Queries\ListEmailListsQuery;
use App\Domains\EmailMarketing\Domain\EmailList;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

/**
 * Serviço especializado para operações de listas de email
 */
class EmailListService
{
    private CreateEmailListUseCase $createListUseCase;
    private UpdateEmailListUseCase $updateListUseCase;
    private DeleteEmailListUseCase $deleteListUseCase;
    private GetEmailListUseCase $getListUseCase;
    private ListEmailListsUseCase $listListsUseCase;
    private AddSubscriberUseCase $addSubscriberUseCase;

    public function __construct(
        CreateEmailListUseCase $createListUseCase,
        UpdateEmailListUseCase $updateListUseCase,
        DeleteEmailListUseCase $deleteListUseCase,
        GetEmailListUseCase $getListUseCase,
        ListEmailListsUseCase $listListsUseCase,
        AddSubscriberUseCase $addSubscriberUseCase
    ) {
        $this->createListUseCase = $createListUseCase;
        $this->updateListUseCase = $updateListUseCase;
        $this->deleteListUseCase = $deleteListUseCase;
        $this->getListUseCase = $getListUseCase;
        $this->listListsUseCase = $listListsUseCase;
        $this->addSubscriberUseCase = $addSubscriberUseCase;
    }

    /**
     * Cria uma nova lista de email
     */
    public function createList(array $data): array
    {
        try {
            $command = CreateEmailListCommand::fromArray($data);
            return $this->createListUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailListService::createList', [
                'error' => $exception->getMessage(),
                'data' => $data
            ]);

            throw $exception;
        }
    }

    /**
     * Atualiza uma lista de email existente
     */
    public function updateList(int $listId, array $data): array
    {
        try {
            $command = UpdateEmailListCommand::fromArray(array_merge($data, ['id' => $listId]));
            return $this->updateListUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailListService::updateList', [
                'error' => $exception->getMessage(),
                'listId' => $listId,
                'data' => $data
            ]);

            throw $exception;
        }
    }

    /**
     * Remove uma lista de email
     */
    public function deleteList(int $listId): array
    {
        try {
            $command = DeleteEmailListCommand::fromArray(['id' => $listId]);
            return $this->deleteListUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailListService::deleteList', [
                'error' => $exception->getMessage(),
                'listId' => $listId
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém uma lista de email por ID
     */
    public function getList(int $listId): array
    {
        try {
            $query = GetEmailListQuery::fromArray(['id' => $listId]);
            return $this->getListUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailListService::getList', [
                'error' => $exception->getMessage(),
                'listId' => $listId
            ]);

            throw $exception;
        }
    }

    /**
     * Lista listas de email com filtros
     */
    public function listLists(array $filters = []): array
    {
        try {
            $query = ListEmailListsQuery::fromArray($filters);
            return $this->listListsUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailListService::listLists', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Adiciona um subscriber a uma lista
     */
    public function addSubscriber(int $listId, array $subscriberData): array
    {
        try {
            $command = AddSubscriberCommand::fromArray(array_merge($subscriberData, ['list_id' => $listId]));
            return $this->addSubscriberUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailListService::addSubscriber', [
                'error' => $exception->getMessage(),
                'listId' => $listId,
                'subscriberData' => $subscriberData
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém estatísticas de uma lista
     */
    public function getListStats(int $listId): array
    {
        try {
            $cacheKey = "email_list_stats_{$listId}";

            return Cache::remember($cacheKey, 300, function () use ($listId) {
                $list = $this->getList($listId);

                return [
                    'list_id' => $listId,
                    'name' => $list['name'] ?? 'N/A',
                    'description' => $list['description'] ?? '',
                    'total_subscribers' => $list['total_subscribers'] ?? 0,
                    'active_subscribers' => $list['active_subscribers'] ?? 0,
                    'unsubscribed_count' => $list['unsubscribed_count'] ?? 0,
                    'bounced_count' => $list['bounced_count'] ?? 0,
                    'created_at' => $list['created_at'] ?? null,
                    'updated_at' => $list['updated_at'] ?? null,
                    'growth_rate' => $this->calculateGrowthRate($list),
                    'engagement_rate' => $this->calculateEngagementRate($list),
                ];
            });
        } catch (\Throwable $exception) {
            Log::error('Error in EmailListService::getListStats', [
                'error' => $exception->getMessage(),
                'listId' => $listId
            ]);

            throw $exception;
        }
    }

    /**
     * Calcula taxa de crescimento da lista
     */
    private function calculateGrowthRate(array $list): float
    {
        $totalSubscribers = $list['total_subscribers'] ?? 0;
        $unsubscribedCount = $list['unsubscribed_count'] ?? 0;

        if ($totalSubscribers === 0) {
            return 0;
        }

        return (($totalSubscribers - $unsubscribedCount) / $totalSubscribers) * 100;
    }

    /**
     * Calcula taxa de engajamento da lista
     */
    private function calculateEngagementRate(array $list): float
    {
        $activeSubscribers = $list['active_subscribers'] ?? 0;
        $totalSubscribers = $list['total_subscribers'] ?? 0;

        return $totalSubscribers > 0 ? ($activeSubscribers / $totalSubscribers) * 100 : 0;
    }

    /**
     * Obtém contagem de listas por usuário
     */
    public function getListsCountByUser(int $userId): int
    {
        try {
            $cacheKey = "user_email_lists_count_{$userId}";

            return Cache::remember($cacheKey, 300, function () use ($userId) {
                $lists = $this->listLists(['user_id' => $userId]);
                return count($lists['data'] ?? []);
            });
        } catch (\Throwable $exception) {
            Log::error('Error in EmailListService::getListsCountByUser', [
                'error' => $exception->getMessage(),
                'userId' => $userId
            ]);

            return 0;
        }
    }

    /**
     * Verifica se usuário pode criar mais listas
     */
    public function canUserCreateMoreLists(int $userId, int $maxLists = 50): bool
    {
        try {
            $currentCount = $this->getListsCountByUser($userId);
            return $currentCount < $maxLists;
        } catch (\Throwable $exception) {
            Log::error('Error in EmailListService::canUserCreateMoreLists', [
                'error' => $exception->getMessage(),
                'userId' => $userId,
                'maxLists' => $maxLists
            ]);

            return false;
        }
    }
}
