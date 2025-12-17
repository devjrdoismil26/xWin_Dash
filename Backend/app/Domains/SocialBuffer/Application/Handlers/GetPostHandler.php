<?php

namespace App\Domains\SocialBuffer\Application\Handlers;

use App\Domains\SocialBuffer\Application\Queries\GetPostQuery;
use App\Domains\SocialBuffer\Domain\Repositories\PostRepositoryInterface;
use App\Domains\SocialBuffer\Domain\Services\PostService;
use Illuminate\Support\Facades\Log;

class GetPostHandler
{
    public function __construct(
        private PostRepositoryInterface $postRepository,
        private PostService $postService
    ) {
    }

    public function handle(GetPostQuery $query): ?array
    {
        try {
            // Validar dados da query
            $this->validateQuery($query);

            // Buscar o post
            $post = $this->postRepository->findById($query->postId);

            if (!$post) {
                return null;
            }

            // Verificar permissões
            if ($post->user_id !== $query->userId) {
                throw new \Exception('Usuário não tem permissão para visualizar este post');
            }

            // Enriquecer com dados adicionais se solicitado
            $result = $post->toArray();

            if ($query->includeAnalytics) {
                $result['analytics'] = $this->postService->getPostAnalytics($post);
            }

            if ($query->includeEngagement) {
                $result['engagement'] = $this->postService->getPostEngagement($post);
            }

            Log::info('Post retrieved successfully', [
                'post_id' => $query->postId,
                'user_id' => $query->userId
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error('Error retrieving post', [
                'post_id' => $query->postId,
                'user_id' => $query->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateQuery(GetPostQuery $query): void
    {
        if (empty($query->postId)) {
            throw new \InvalidArgumentException('ID do post é obrigatório');
        }

        if (empty($query->userId)) {
            throw new \InvalidArgumentException('ID do usuário é obrigatório');
        }
    }
}
