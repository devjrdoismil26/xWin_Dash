<?php

namespace App\Domains\SocialBuffer\Application\Handlers;

use App\Domains\SocialBuffer\Application\Queries\ListPostsQuery;
use App\Domains\SocialBuffer\Domain\Repositories\PostRepositoryInterface;
use App\Domains\SocialBuffer\Domain\Services\PostService;
use Illuminate\Support\Facades\Log;

class ListPostsHandler
{
    public function __construct(
        private PostRepositoryInterface $postRepository,
        private PostService $postService
    ) {
    }

    public function handle(ListPostsQuery $query): array
    {
        try {
            // Validar dados da query
            $this->validateQuery($query);

            // Preparar filtros
            $filters = [
                'user_id' => $query->userId,
                'platform' => $query->platform,
                'status' => $query->status,
                'date_from' => $query->dateFrom,
                'date_to' => $query->dateTo
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

            // Buscar posts
            $result = $this->postRepository->findByFilters($filters, $paginationOptions);

            // Enriquecer com dados adicionais se solicitado
            if ($query->includeAnalytics) {
                foreach ($result['data'] as &$post) {
                    $post['analytics'] = $this->postService->getPostAnalytics($post);
                }
            }

            Log::info('Posts listed successfully', [
                'user_id' => $query->userId,
                'count' => count($result['data']),
                'filters' => $filters
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error('Error listing posts', [
                'user_id' => $query->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateQuery(ListPostsQuery $query): void
    {
        if (empty($query->userId)) {
            throw new \InvalidArgumentException('ID do usuário é obrigatório');
        }
    }
}
