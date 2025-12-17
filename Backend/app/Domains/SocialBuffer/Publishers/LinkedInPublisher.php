<?php

namespace App\Domains\SocialBuffer\Publishers;

use App\Domains\SocialBuffer\Contracts\PublisherInterface;
use App\Domains\SocialBuffer\Models\Post;
use App\Domains\SocialBuffer\Models\SocialAccount;
use App\Domains\SocialBuffer\DTOs\PublishResultDTO;
use App\Domains\SocialBuffer\Services\ExternalApi\LinkedInService;
use Illuminate\Support\Facades\Log;

class LinkedInPublisher implements PublisherInterface
{
    protected LinkedInService $linkedinService;

    public function __construct(LinkedInService $linkedinService)
    {
        $this->linkedinService = $linkedinService;
    }

    /**
     * Publica um post no LinkedIn.
     *
     * @param Post $post o post a ser publicado
     * @param SocialAccount $socialAccount a conta social para publicação
     *
     * @return PublishResultDTO o resultado da publicação
     */
    public function publish(Post $post, SocialAccount $socialAccount): PublishResultDTO
    {
        Log::info("Publicando post ID: {$post->id} no LinkedIn para conta {$socialAccount->id}.");

        try {
            // Validar dados necessários
            if (empty($post->content)) {
                throw new \InvalidArgumentException('Post deve ter conteúdo para publicação no LinkedIn.');
            }

            // Configurar token de acesso específico da conta
            $this->linkedinService->setAccessToken($socialAccount->access_token);
            $this->linkedinService->setPersonId($socialAccount->platform_user_id);

            // Preparar URLs de mídia
            $mediaUrls = [];
            if (!empty($post->media_urls)) {
                $mediaUrls = is_array($post->media_urls) ? $post->media_urls : [$post->media_urls];
            }

            // Publicar post no LinkedIn
            $response = $this->linkedinService->publishPost($post->content, $mediaUrls);

            $postId = $response['id'] ?? 'unknown';
            $postUrl = "https://linkedin.com/feed/update/{$postId}";

            Log::info("Post ID: {$post->id} publicado com sucesso no LinkedIn. LinkedIn Post ID: {$postId}");

            return new PublishResultDTO(
                success: true,
                message: 'Post published successfully on LinkedIn.',
                platformPostId: $postId,
                platform: 'linkedin',
                postUrl: $postUrl,
                response: $response,
            );
        } catch (\Exception $e) {
            Log::error("Falha ao publicar post ID: {$post->id} no LinkedIn. Erro: " . $e->getMessage());

            return new PublishResultDTO(
                success: false,
                message: "Failed to publish post on LinkedIn: {$e->getMessage()}",
                platform: 'linkedin',
                error: $e->getMessage(),
            );
        }
    }
}
