<?php

namespace App\Domains\SocialBuffer\Application\Handlers;

use App\Domains\SocialBuffer\Application\Commands\UpdatePostCommand;
use App\Domains\SocialBuffer\Domain\Repositories\PostRepositoryInterface;
use App\Domains\SocialBuffer\Domain\Services\PostService;
use App\Domains\SocialBuffer\Domain\Services\SocialMediaIntegrationService;
use Illuminate\Support\Facades\Log;

class UpdatePostHandler
{
    public function __construct(
        private PostRepositoryInterface $postRepository,
        private PostService $postService,
        private SocialMediaIntegrationService $socialMediaService
    ) {
    }

    public function handle(UpdatePostCommand $command): array
    {
        try {
            // Buscar o post existente
            $post = $this->postRepository->findById($command->postId);

            if (!$post) {
                throw new \Exception('Post não encontrado');
            }

            // Validar permissões
            if ($post->user_id !== $command->userId) {
                throw new \Exception('Usuário não tem permissão para editar este post');
            }

            // Validar dados do comando
            $this->validateCommand($command);

            // Atualizar o post
            $updateData = array_filter([
                'content' => $command->content,
                'scheduled_at' => $command->scheduledAt,
                'media_urls' => $command->mediaUrls,
                'hashtags' => $command->hashtags,
                'mentions' => $command->mentions,
                'status' => $command->status
            ], function ($value) {
                return $value !== null;
            });

            $updatedPost = $this->postService->updatePost($post, $updateData);

            // Salvar no repositório
            $savedPost = $this->postRepository->save($updatedPost);

            // Se o status mudou para publicado, integrar com redes sociais
            if ($command->status === 'published' && $post->status !== 'published') {
                $this->socialMediaService->publishPost($savedPost);
            }

            Log::info('Post updated successfully', [
                'post_id' => $command->postId,
                'user_id' => $command->userId
            ]);

            return [
                'post' => $savedPost->toArray(),
                'message' => 'Post atualizado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error updating post', [
                'post_id' => $command->postId,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(UpdatePostCommand $command): void
    {
        if (empty($command->postId)) {
            throw new \InvalidArgumentException('ID do post é obrigatório');
        }

        if (empty($command->userId)) {
            throw new \InvalidArgumentException('ID do usuário é obrigatório');
        }
    }
}
