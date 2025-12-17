<?php

namespace App\Domains\SocialBuffer\Application\Services;

use App\Domains\SocialBuffer\Application\Services\PostManagementService;
use App\Domains\SocialBuffer\Application\Services\SocialAccountService;
use App\Domains\SocialBuffer\Application\UseCases\PublishPostUseCase;
use App\Domains\SocialBuffer\Application\UseCases\SchedulePostUseCase;
use App\Domains\SocialBuffer\Application\Commands\PublishPostCommand;
use App\Domains\SocialBuffer\Application\Commands\SchedulePostCommand;
use App\Domains\SocialBuffer\Domain\Post;
use App\Domains\SocialBuffer\Domain\SocialAccount;
use Illuminate\Support\Facades\Log;

/**
 * Application Service para SocialBuffer
 *
 * Orquestra serviços especializados e fornece interface unificada
 * para operações de posts, contas sociais e publicação.
 */
class SocialBufferApplicationService
{
    private PostManagementService $postManagementService;
    private SocialAccountService $socialAccountService;
    private PublishPostUseCase $publishPostUseCase;
    private SchedulePostUseCase $schedulePostUseCase;

    public function __construct(
        PostManagementService $postManagementService,
        SocialAccountService $socialAccountService,
        PublishPostUseCase $publishPostUseCase,
        SchedulePostUseCase $schedulePostUseCase
    ) {
        $this->postManagementService = $postManagementService;
        $this->socialAccountService = $socialAccountService;
        $this->publishPostUseCase = $publishPostUseCase;
        $this->schedulePostUseCase = $schedulePostUseCase;
    }

    // ===== POST MANAGEMENT OPERATIONS =====

    /**
     * Cria um novo post
     */
    public function createPost(array $data): array
    {
        try {
            return $this->postManagementService->createPost($data);
        } catch (\Throwable $exception) {
            Log::error('Error in SocialBufferApplicationService::createPost', [
                'error' => $exception->getMessage(),
                'data' => $data
            ]);

            throw $exception;
        }
    }

    /**
     * Atualiza um post existente
     */
    public function updatePost(int $postId, array $data): array
    {
        try {
            return $this->postManagementService->updatePost($postId, $data);
        } catch (\Throwable $exception) {
            Log::error('Error in SocialBufferApplicationService::updatePost', [
                'error' => $exception->getMessage(),
                'postId' => $postId,
                'data' => $data
            ]);

            throw $exception;
        }
    }

    /**
     * Remove um post
     */
    public function deletePost(int $postId): array
    {
        try {
            return $this->postManagementService->deletePost($postId);
        } catch (\Throwable $exception) {
            Log::error('Error in SocialBufferApplicationService::deletePost', [
                'error' => $exception->getMessage(),
                'postId' => $postId
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém um post por ID
     */
    public function getPost(int $postId): array
    {
        try {
            return $this->postManagementService->getPost($postId);
        } catch (\Throwable $exception) {
            Log::error('Error in SocialBufferApplicationService::getPost', [
                'error' => $exception->getMessage(),
                'postId' => $postId
            ]);

            throw $exception;
        }
    }

    /**
     * Lista posts com filtros
     */
    public function listPosts(array $filters = []): array
    {
        try {
            return $this->postManagementService->listPosts($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in SocialBufferApplicationService::listPosts', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Busca posts por termo
     */
    public function searchPosts(string $term, array $filters = []): array
    {
        try {
            return $this->postManagementService->searchPosts($term, $filters);
        } catch (\Throwable $exception) {
            Log::error('Error in SocialBufferApplicationService::searchPosts', [
                'error' => $exception->getMessage(),
                'term' => $term,
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém posts por status
     */
    public function getPostsByStatus(string $status, array $filters = []): array
    {
        try {
            return $this->postManagementService->getPostsByStatus($status, $filters);
        } catch (\Throwable $exception) {
            Log::error('Error in SocialBufferApplicationService::getPostsByStatus', [
                'error' => $exception->getMessage(),
                'status' => $status,
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém posts por plataforma
     */
    public function getPostsByPlatform(string $platform, array $filters = []): array
    {
        try {
            return $this->postManagementService->getPostsByPlatform($platform, $filters);
        } catch (\Throwable $exception) {
            Log::error('Error in SocialBufferApplicationService::getPostsByPlatform', [
                'error' => $exception->getMessage(),
                'platform' => $platform,
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém posts agendados
     */
    public function getScheduledPosts(array $filters = []): array
    {
        try {
            return $this->postManagementService->getScheduledPosts($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in SocialBufferApplicationService::getScheduledPosts', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém posts publicados
     */
    public function getPublishedPosts(array $filters = []): array
    {
        try {
            return $this->postManagementService->getPublishedPosts($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in SocialBufferApplicationService::getPublishedPosts', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém posts em rascunho
     */
    public function getDraftPosts(array $filters = []): array
    {
        try {
            return $this->postManagementService->getDraftPosts($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in SocialBufferApplicationService::getDraftPosts', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém estatísticas de posts
     */
    public function getPostStatistics(array $filters = []): array
    {
        try {
            return $this->postManagementService->getPostStatistics($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in SocialBufferApplicationService::getPostStatistics', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém posts próximos ao agendamento
     */
    public function getUpcomingPosts(int $hours = 24): array
    {
        try {
            return $this->postManagementService->getUpcomingPosts($hours);
        } catch (\Throwable $exception) {
            Log::error('Error in SocialBufferApplicationService::getUpcomingPosts', [
                'error' => $exception->getMessage(),
                'hours' => $hours
            ]);

            throw $exception;
        }
    }

    // ===== SOCIAL ACCOUNT OPERATIONS =====

    /**
     * Cria uma nova conta social
     */
    public function createSocialAccount(array $data): array
    {
        try {
            return $this->socialAccountService->createSocialAccount($data);
        } catch (\Throwable $exception) {
            Log::error('Error in SocialBufferApplicationService::createSocialAccount', [
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
            return $this->socialAccountService->updateSocialAccount($accountId, $data);
        } catch (\Throwable $exception) {
            Log::error('Error in SocialBufferApplicationService::updateSocialAccount', [
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
            return $this->socialAccountService->deleteSocialAccount($accountId);
        } catch (\Throwable $exception) {
            Log::error('Error in SocialBufferApplicationService::deleteSocialAccount', [
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
            return $this->socialAccountService->getSocialAccount($accountId);
        } catch (\Throwable $exception) {
            Log::error('Error in SocialBufferApplicationService::getSocialAccount', [
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
            return $this->socialAccountService->listSocialAccounts($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in SocialBufferApplicationService::listSocialAccounts', [
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
            return $this->socialAccountService->getSocialAccountsByPlatform($platform, $filters);
        } catch (\Throwable $exception) {
            Log::error('Error in SocialBufferApplicationService::getSocialAccountsByPlatform', [
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
            return $this->socialAccountService->getActiveSocialAccounts($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in SocialBufferApplicationService::getActiveSocialAccounts', [
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
            return $this->socialAccountService->getConnectedSocialAccounts($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in SocialBufferApplicationService::getConnectedSocialAccounts', [
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
            return $this->socialAccountService->getSocialAccountsByUser($userId, $filters);
        } catch (\Throwable $exception) {
            Log::error('Error in SocialBufferApplicationService::getSocialAccountsByUser', [
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
            return $this->socialAccountService->getSocialAccountStatistics($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in SocialBufferApplicationService::getSocialAccountStatistics', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém contas sociais disponíveis para postagem
     */
    public function getAvailableAccountsForPosting(array $filters = []): array
    {
        try {
            return $this->socialAccountService->getAvailableAccountsForPosting($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in SocialBufferApplicationService::getAvailableAccountsForPosting', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    // ===== PUBLICATION OPERATIONS =====

    /**
     * Publica um post
     */
    public function publishPost(int $postId, array $options = []): array
    {
        try {
            $command = PublishPostCommand::fromArray(array_merge($options, ['id' => $postId]));
            return $this->publishPostUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in SocialBufferApplicationService::publishPost', [
                'error' => $exception->getMessage(),
                'postId' => $postId,
                'options' => $options
            ]);

            throw $exception;
        }
    }

    /**
     * Agenda um post
     */
    public function schedulePost(int $postId, array $options = []): array
    {
        try {
            $command = SchedulePostCommand::fromArray(array_merge($options, ['id' => $postId]));
            return $this->schedulePostUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in SocialBufferApplicationService::schedulePost', [
                'error' => $exception->getMessage(),
                'postId' => $postId,
                'options' => $options
            ]);

            throw $exception;
        }
    }

    // ===== CONVENIENCE METHODS =====

    /**
     * Obtém dashboard completo do SocialBuffer
     */
    public function getDashboard(array $filters = []): array
    {
        try {
            return [
                'post_statistics' => $this->getPostStatistics($filters),
                'social_account_statistics' => $this->getSocialAccountStatistics($filters),
                'upcoming_posts' => $this->getUpcomingPosts(24),
                'recent_posts' => $this->getPublishedPosts(array_merge($filters, ['per_page' => 10])),
                'active_accounts' => $this->getActiveSocialAccounts($filters),
            ];
        } catch (\Throwable $exception) {
            Log::error('Error in SocialBufferApplicationService::getDashboard', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém estatísticas resumidas
     */
    public function getSummaryStatistics(array $filters = []): array
    {
        try {
            $postStats = $this->getPostStatistics($filters);
            $accountStats = $this->getSocialAccountStatistics($filters);

            return [
                'total_posts' => $postStats['total_posts'] ?? 0,
                'scheduled_posts' => $postStats['scheduled_posts'] ?? 0,
                'published_posts' => $postStats['published_posts'] ?? 0,
                'total_accounts' => $accountStats['total_accounts'] ?? 0,
                'active_accounts' => $accountStats['active_accounts'] ?? 0,
                'connected_accounts' => $accountStats['connected_accounts'] ?? 0,
                'total_followers' => $accountStats['total_followers'] ?? 0,
                'average_engagement' => $postStats['average_engagement'] ?? 0,
            ];
        } catch (\Throwable $exception) {
            Log::error('Error in SocialBufferApplicationService::getSummaryStatistics', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }
}
