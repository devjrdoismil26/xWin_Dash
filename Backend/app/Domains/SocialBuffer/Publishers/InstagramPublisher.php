<?php

namespace App\Domains\SocialBuffer\Publishers;

use App\Domains\SocialBuffer\Contracts\PublisherInterface;
use App\Domains\SocialBuffer\Models\Post;
use App\Domains\SocialBuffer\Models\SocialAccount;
use App\Domains\SocialBuffer\DTOs\PublishResultDTO;
use App\Domains\SocialBuffer\Services\ExternalApi\InstagramService;
use Illuminate\Support\Facades\Log;

class InstagramPublisher implements PublisherInterface
{
    protected InstagramService $instagramService;

    public function __construct(InstagramService $instagramService)
    {
        $this->instagramService = $instagramService;
    }

    /**
     * Publica um post no Instagram.
     *
     * @param Post $post o post a ser publicado
     * @param SocialAccount $socialAccount a conta social para publicação
     *
     * @return PublishResultDTO o resultado da publicação
     */
    public function publish(Post $post, SocialAccount $socialAccount): PublishResultDTO
    {
        Log::info("Publicando post ID: {$post->id} no Instagram para conta {$socialAccount->id}.");

        try {
            // Validar dados necessários
            if (empty($post->content) && empty($post->media_urls)) {
                throw new \InvalidArgumentException('Post deve ter conteúdo ou mídia para publicação.');
            }

            // Configurar token de acesso específico da conta
            $this->instagramService->setAccessToken($socialAccount->access_token);

            // Publicar com base no tipo de conteúdo
            if (!empty($post->media_urls)) {
                // Post com imagem
                $imageUrl = is_array($post->media_urls) ? $post->media_urls[0] : $post->media_urls;
                $response = $this->instagramService->publishImage($imageUrl, $post->content ?? '');
            } else {
                // Post apenas texto (Instagram Stories ou outras opções)
                throw new \InvalidArgumentException('Instagram requer pelo menos uma imagem para publicação no feed.');
            }

            $platformPostId = $response['id'] ?? 'unknown';
            $postUrl = "https://instagram.com/p/{$platformPostId}";

            Log::info("Post ID: {$post->id} publicado com sucesso no Instagram. Instagram Post ID: {$platformPostId}");

            return new PublishResultDTO(
                success: true,
                message: 'Post published successfully on Instagram.',
                platformPostId: $platformPostId,
                platform: 'instagram',
                postUrl: $postUrl,
                response: $response,
            );
        } catch (\Exception $e) {
            Log::error("Falha ao publicar post ID: {$post->id} no Instagram. Erro: " . $e->getMessage());

            return new PublishResultDTO(
                success: false,
                message: "Failed to publish post on Instagram: {$e->getMessage()}",
                platform: 'instagram',
                error: $e->getMessage(),
            );
        }
    }
}
