<?php

namespace App\Domains\SocialBuffer\Publishers;

use App\Domains\SocialBuffer\Contracts\PublisherInterface;
use App\Domains\SocialBuffer\Models\Post;
use App\Domains\SocialBuffer\Models\SocialAccount;
use App\Domains\SocialBuffer\DTOs\PublishResultDTO;
use App\Domains\SocialBuffer\Services\ExternalApi\FacebookService;
use Illuminate\Support\Facades\Log;

class FacebookPublisher implements PublisherInterface
{
    protected FacebookService $facebookService;

    public function __construct(FacebookService $facebookService)
    {
        $this->facebookService = $facebookService;
    }

    /**
     * Publica um post no Facebook.
     *
     * @param Post $post o post a ser publicado
     * @param SocialAccount $socialAccount a conta social para publicação
     *
     * @return PublishResultDTO o resultado da publicação
     */
    public function publish(Post $post, SocialAccount $socialAccount): PublishResultDTO
    {
        Log::info("Publicando post ID: {$post->id} no Facebook para conta {$socialAccount->id}.");

        try {
            // Validar dados necessários
            if (empty($post->content) && empty($post->media_urls)) {
                throw new \InvalidArgumentException('Post deve ter conteúdo ou mídia para publicação.');
            }

            // Configurar token de acesso específico da conta
            $this->facebookService->setAccessToken($socialAccount->access_token);

            // Preparar URLs de mídia
            $mediaUrls = [];
            if (!empty($post->media_urls)) {
                $mediaUrls = is_array($post->media_urls) ? $post->media_urls : [$post->media_urls];
            }

            // Publicar post no Facebook
            $response = $this->facebookService->publishPost($post->content ?? '', $mediaUrls);

            $postId = $response['id'] ?? 'unknown';
            $postUrl = "https://facebook.com/{$postId}";

            Log::info("Post ID: {$post->id} publicado com sucesso no Facebook. Facebook Post ID: {$postId}");

            return new PublishResultDTO(
                success: true,
                message: 'Post published successfully on Facebook.',
                platformPostId: $postId,
                platform: 'facebook',
                postUrl: $postUrl,
                response: $response,
            );
        } catch (\Exception $e) {
            Log::error("Falha ao publicar post ID: {$post->id} no Facebook. Erro: " . $e->getMessage());

            return new PublishResultDTO(
                success: false,
                message: "Failed to publish post on Facebook: {$e->getMessage()}",
                platform: 'facebook',
                error: $e->getMessage(),
            );
        }
    }
}
