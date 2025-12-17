<?php

namespace App\Domains\SocialBuffer\Application\Services;

use App\Domains\SocialBuffer\Application\UseCases\CreatePostUseCase;
use App\Domains\SocialBuffer\Application\UseCases\UpdatePostUseCase;
use App\Domains\SocialBuffer\Application\UseCases\DeletePostUseCase;
use App\Domains\SocialBuffer\Application\UseCases\GetPostUseCase;
use App\Domains\SocialBuffer\Application\UseCases\ListPostsUseCase;
use App\Domains\SocialBuffer\Application\Commands\CreatePostCommand;
use App\Domains\SocialBuffer\Application\Commands\UpdatePostCommand;
use App\Domains\SocialBuffer\Application\Commands\DeletePostCommand;
use App\Domains\SocialBuffer\Application\Queries\GetPostQuery;
use App\Domains\SocialBuffer\Application\Queries\ListPostsQuery;
use App\Domains\SocialBuffer\Domain\Post;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

/**
 * Serviço especializado para gerenciamento de posts
 */
class PostManagementService
{
    private CreatePostUseCase $createPostUseCase;
    private UpdatePostUseCase $updatePostUseCase;
    private DeletePostUseCase $deletePostUseCase;
    private GetPostUseCase $getPostUseCase;
    private ListPostsUseCase $listPostsUseCase;

    public function __construct(
        CreatePostUseCase $createPostUseCase,
        UpdatePostUseCase $updatePostUseCase,
        DeletePostUseCase $deletePostUseCase,
        GetPostUseCase $getPostUseCase,
        ListPostsUseCase $listPostsUseCase
    ) {
        $this->createPostUseCase = $createPostUseCase;
        $this->updatePostUseCase = $updatePostUseCase;
        $this->deletePostUseCase = $deletePostUseCase;
        $this->getPostUseCase = $getPostUseCase;
        $this->listPostsUseCase = $listPostsUseCase;
    }

    /**
     * Cria um novo post
     */
    public function createPost(array $data): array
    {
        try {
            $command = CreatePostCommand::fromArray($data);
            return $this->createPostUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in PostManagementService::createPost', [
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
            $command = UpdatePostCommand::fromArray(array_merge($data, ['id' => $postId]));
            return $this->updatePostUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in PostManagementService::updatePost', [
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
            $command = DeletePostCommand::fromArray(['id' => $postId]);
            return $this->deletePostUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in PostManagementService::deletePost', [
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
            $query = GetPostQuery::fromArray(['id' => $postId]);
            return $this->getPostUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in PostManagementService::getPost', [
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
            $query = ListPostsQuery::fromArray($filters);
            return $this->listPostsUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in PostManagementService::listPosts', [
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
            $filters['search'] = $term;
            $query = ListPostsQuery::fromArray($filters);
            return $this->listPostsUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in PostManagementService::searchPosts', [
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
            $filters['status'] = $status;
            $query = ListPostsQuery::fromArray($filters);
            return $this->listPostsUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in PostManagementService::getPostsByStatus', [
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
            $filters['platform'] = $platform;
            $query = ListPostsQuery::fromArray($filters);
            return $this->listPostsUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in PostManagementService::getPostsByPlatform', [
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
            $filters['status'] = 'scheduled';
            $filters['scheduled_at'] = 'future';
            $query = ListPostsQuery::fromArray($filters);
            return $this->listPostsUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in PostManagementService::getScheduledPosts', [
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
            $filters['status'] = 'published';
            $query = ListPostsQuery::fromArray($filters);
            return $this->listPostsUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in PostManagementService::getPublishedPosts', [
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
            $filters['status'] = 'draft';
            $query = ListPostsQuery::fromArray($filters);
            return $this->listPostsUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in PostManagementService::getDraftPosts', [
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
            $cacheKey = 'post_statistics_' . md5(serialize($filters));

            return Cache::remember($cacheKey, 300, function () use ($filters) {
                $allPosts = $this->listPosts($filters);

                $statistics = [
                    'total_posts' => count($allPosts['data'] ?? []),
                    'draft_posts' => 0,
                    'scheduled_posts' => 0,
                    'published_posts' => 0,
                    'failed_posts' => 0,
                    'posts_by_platform' => [],
                    'posts_by_type' => [],
                    'engagement_rate' => 0,
                    'average_engagement' => 0,
                ];

                foreach ($allPosts['data'] ?? [] as $post) {
                    $status = $post['status'] ?? 'unknown';
                    $platform = $post['platform'] ?? 'unknown';
                    $type = $post['type'] ?? 'unknown';

                    // Contar por status
                    if (isset($statistics[$status . '_posts'])) {
                        $statistics[$status . '_posts']++;
                    }

                    // Contar por plataforma
                    if (!isset($statistics['posts_by_platform'][$platform])) {
                        $statistics['posts_by_platform'][$platform] = 0;
                    }
                    $statistics['posts_by_platform'][$platform]++;

                    // Contar por tipo
                    if (!isset($statistics['posts_by_type'][$type])) {
                        $statistics['posts_by_type'][$type] = 0;
                    }
                    $statistics['posts_by_type'][$type]++;

                    // Calcular engajamento
                    $engagement = $post['engagement'] ?? 0;
                    $statistics['average_engagement'] += $engagement;
                }

                if ($statistics['total_posts'] > 0) {
                    $statistics['average_engagement'] = $statistics['average_engagement'] / $statistics['total_posts'];
                }

                return $statistics;
            });
        } catch (\Throwable $exception) {
            Log::error('Error in PostManagementService::getPostStatistics', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém contagem de posts por status
     */
    public function getPostsCountByStatus(): array
    {
        try {
            $cacheKey = 'posts_count_by_status';

            return Cache::remember($cacheKey, 300, function () {
                $statistics = $this->getPostStatistics();

                return [
                    'draft' => $statistics['draft_posts'] ?? 0,
                    'scheduled' => $statistics['scheduled_posts'] ?? 0,
                    'published' => $statistics['published_posts'] ?? 0,
                    'failed' => $statistics['failed_posts'] ?? 0,
                ];
            });
        } catch (\Throwable $exception) {
            Log::error('Error in PostManagementService::getPostsCountByStatus', [
                'error' => $exception->getMessage()
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém contagem de posts por plataforma
     */
    public function getPostsCountByPlatform(): array
    {
        try {
            $cacheKey = 'posts_count_by_platform';

            return Cache::remember($cacheKey, 300, function () {
                $statistics = $this->getPostStatistics();
                return $statistics['posts_by_platform'] ?? [];
            });
        } catch (\Throwable $exception) {
            Log::error('Error in PostManagementService::getPostsCountByPlatform', [
                'error' => $exception->getMessage()
            ]);

            throw $exception;
        }
    }

    /**
     * Verifica se post existe
     */
    public function postExists(int $postId): bool
    {
        try {
            $post = $this->getPost($postId);
            return !empty($post);
        } catch (\Throwable $exception) {
            Log::error('Error in PostManagementService::postExists', [
                'error' => $exception->getMessage(),
                'postId' => $postId
            ]);

            return false;
        }
    }

    /**
     * Obtém posts próximos ao agendamento
     */
    public function getUpcomingPosts(int $hours = 24): array
    {
        try {
            $filters = [
                'status' => 'scheduled',
                'scheduled_at_from' => now()->format('Y-m-d H:i:s'),
                'scheduled_at_to' => now()->addHours($hours)->format('Y-m-d H:i:s'),
                'per_page' => 50
            ];

            $query = ListPostsQuery::fromArray($filters);
            return $this->listPostsUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in PostManagementService::getUpcomingPosts', [
                'error' => $exception->getMessage(),
                'hours' => $hours
            ]);

            throw $exception;
        }
    }
}
