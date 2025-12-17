<?php

namespace App\Domains\SocialBuffer\Application\Handlers;

use App\Domains\SocialBuffer\Application\Commands\CreatePostCommand;
use App\Domains\SocialBuffer\Domain\Repositories\PostRepositoryInterface;
use App\Domains\SocialBuffer\Domain\Services\PostService;
use App\Domains\SocialBuffer\Domain\Services\SocialMediaIntegrationService;
use Illuminate\Support\Facades\Log;

class CreatePostHandler
{
    public function __construct(
        private PostRepositoryInterface $postRepository,
        private PostService $postService,
        private SocialMediaIntegrationService $socialMediaService
    ) {
    }

    public function handle(CreatePostCommand $command): array
    {
        try {
            // Validar dados do comando
            $this->validateCommand($command);

            // Criar o post no domínio
            $post = $this->postService->createPost([
                'user_id' => $command->userId,
                'content' => $command->content,
                'platform' => $command->platform,
                'scheduled_at' => $command->scheduledAt,
                'media_urls' => $command->mediaUrls,
                'hashtags' => $command->hashtags,
                'mentions' => $command->mentions,
                'status' => 'draft'
            ]);

            // Salvar no repositório
            $savedPost = $this->postRepository->save($post);

            // Se for para publicar imediatamente, integrar com redes sociais
            if ($command->publishImmediately) {
                $this->socialMediaService->publishPost($savedPost);
            }

            Log::info('Post created successfully', [
                'post_id' => $savedPost->id,
                'user_id' => $command->userId
            ]);

            return [
                'post' => $savedPost->toArray(),
                'message' => 'Post criado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error creating post', [
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(CreatePostCommand $command): void
    {
        if (empty($command->content)) {
            throw new \InvalidArgumentException('Conteúdo do post é obrigatório');
        }

        if (empty($command->platform)) {
            throw new \InvalidArgumentException('Plataforma é obrigatória');
        }

        if (empty($command->userId)) {
            throw new \InvalidArgumentException('ID do usuário é obrigatório');
        }
    }
}
