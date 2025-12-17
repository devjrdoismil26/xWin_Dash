<?php

namespace App\Domains\SocialBuffer\Application\Handlers;

use App\Domains\SocialBuffer\Application\Commands\PublishPostCommand;
use App\Domains\SocialBuffer\Domain\Repositories\PostRepositoryInterface;
use App\Domains\SocialBuffer\Domain\Services\PostService;
use App\Domains\SocialBuffer\Domain\Services\SocialMediaIntegrationService;
use Illuminate\Support\Facades\Log;

class PublishPostHandler
{
    public function __construct(
        private PostRepositoryInterface $postRepository,
        private PostService $postService,
        private SocialMediaIntegrationService $socialMediaService
    ) {
    }

    public function handle(PublishPostCommand $command): array
    {
        try {
            // Buscar o post existente
            $post = $this->postRepository->findById($command->postId);

            if (!$post) {
                throw new \Exception('Post não encontrado');
            }

            // Validar permissões
            if ($post->user_id !== $command->userId) {
                throw new \Exception('Usuário não tem permissão para publicar este post');
            }

            // Validar dados do comando
            $this->validateCommand($command);

            // Verificar se o post pode ser publicado
            if ($post->status === 'published') {
                throw new \Exception('Post já foi publicado');
            }

            // Publicar o post
            $publishedPost = $this->postService->publishPost($post);

            // Salvar no repositório
            $savedPost = $this->postRepository->save($publishedPost);

            // Integrar com redes sociais
            $publishResult = $this->socialMediaService->publishPost($savedPost);

            Log::info('Post published successfully', [
                'post_id' => $command->postId,
                'user_id' => $command->userId
            ]);

            return [
                'post' => $savedPost->toArray(),
                'publish_result' => $publishResult,
                'message' => 'Post publicado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error publishing post', [
                'post_id' => $command->postId,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(PublishPostCommand $command): void
    {
        if (empty($command->postId)) {
            throw new \InvalidArgumentException('ID do post é obrigatório');
        }

        if (empty($command->userId)) {
            throw new \InvalidArgumentException('ID do usuário é obrigatório');
        }
    }
}
