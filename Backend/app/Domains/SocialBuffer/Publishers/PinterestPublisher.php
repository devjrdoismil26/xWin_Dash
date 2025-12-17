<?php

namespace App\Domains\SocialBuffer\Publishers;

use App\Domains\SocialBuffer\Contracts\PublisherInterface;
use App\Domains\SocialBuffer\Models\Post;
use App\Domains\SocialBuffer\Models\SocialAccount;
use App\Domains\SocialBuffer\DTOs\PublishResultDTO;
use App\Domains\SocialBuffer\Services\ExternalApi\PinterestService;
use Illuminate\Support\Facades\Log;

class PinterestPublisher implements PublisherInterface
{
    protected PinterestService $pinterestService;

    public function __construct(PinterestService $pinterestService)
    {
        $this->pinterestService = $pinterestService;
    }

    /**
     * Publica um post no Pinterest.
     *
     * @param Post $post o post a ser publicado
     * @param SocialAccount $socialAccount a conta social para publicação
     *
     * @return PublishResultDTO o resultado da publicação
     */
    public function publish(Post $post, SocialAccount $socialAccount): PublishResultDTO
    {
        Log::info("Publicando post ID: {$post->id} no Pinterest para conta {$socialAccount->id}.");

        try {
            // Validar dados necessários para Pinterest
            if (empty($post->media_urls)) {
                throw new \InvalidArgumentException('Pinterest requer pelo menos uma imagem para criar um Pin.');
            }

            // Configurar token de acesso específico da conta
            $this->pinterestService->setAccessToken($socialAccount->access_token);

            // Preparar dados do Pin
            $imageUrl = is_array($post->media_urls) ? $post->media_urls[0] : $post->media_urls;
            $description = $post->content ?? '';
            $link = $post->link ?? null; // URL de destino do Pin
            $boardId = $socialAccount->board_id ?? null; // ID do board padrão

            // Criar Pin no Pinterest
            $response = $this->pinterestService->createPin($imageUrl, $description, $link, $boardId);

            $pinId = $response['id'] ?? 'unknown';
            $pinUrl = $response['url'] ?? "https://pinterest.com/pin/{$pinId}";

            Log::info("Post ID: {$post->id} publicado com sucesso no Pinterest. Pin ID: {$pinId}");

            return new PublishResultDTO(
                success: true,
                message: 'Post published successfully on Pinterest.',
                platformPostId: $pinId,
                platform: 'pinterest',
                postUrl: $pinUrl,
                response: $response,
            );
        } catch (\Exception $e) {
            Log::error("Falha ao publicar post ID: {$post->id} no Pinterest. Erro: " . $e->getMessage());

            return new PublishResultDTO(
                success: false,
                message: "Failed to publish post on Pinterest: {$e->getMessage()}",
                platform: 'pinterest',
                error: $e->getMessage(),
            );
        }
    }
}
