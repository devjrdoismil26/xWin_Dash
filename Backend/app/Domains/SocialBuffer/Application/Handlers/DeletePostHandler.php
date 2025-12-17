<?php

namespace App\Domains\SocialBuffer\Application\Handlers;

use App\Domains\SocialBuffer\Application\Commands\DeletePostCommand;
use App\Domains\SocialBuffer\Domain\Repositories\PostRepositoryInterface;
use App\Domains\SocialBuffer\Domain\Services\PostService;
use App\Domains\SocialBuffer\Domain\Services\SocialMediaIntegrationService;
use Illuminate\Support\Facades\Log;

class DeletePostHandler
{
    public function __construct(
        private PostRepositoryInterface $postRepository,
        private PostService $postService,
        private SocialMediaIntegrationService $socialMediaService
    ) {
    }

    public function handle(DeletePostCommand $command): array
    {
        try {
            // Buscar o post existente
            $post = $this->postRepository->findById($command->postId);

            if (!$post) {
                throw new \Exception('Post não encontrado');
            }

            // Validar permissões
            if ($post->user_id !== $command->userId) {
                throw new \Exception('Usuário não tem permissão para excluir este post');
            }

            // Validar dados do comando
            $this->validateCommand($command);

            // Se o post foi publicado, remover das redes sociais
            if ($post->status === 'published') {
                $this->socialMediaService->deletePost($post);
            }

            // Excluir o post
            $this->postRepository->delete($command->postId);

            Log::info('Post deleted successfully', [
                'post_id' => $command->postId,
                'user_id' => $command->userId
            ]);

            return [
                'message' => 'Post excluído com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error deleting post', [
                'post_id' => $command->postId,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(DeletePostCommand $command): void
    {
        if (empty($command->postId)) {
            throw new \InvalidArgumentException('ID do post é obrigatório');
        }

        if (empty($command->userId)) {
            throw new \InvalidArgumentException('ID do usuário é obrigatório');
        }
    }
}
