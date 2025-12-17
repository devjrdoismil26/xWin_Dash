<?php

namespace App\Domains\SocialBuffer\Publishers;

use App\Domains\SocialBuffer\Contracts\PublisherInterface;
use App\Domains\SocialBuffer\Models\Post;
use App\Domains\SocialBuffer\Models\SocialAccount;
use App\Domains\SocialBuffer\DTOs\PublishResultDTO;
use App\Domains\SocialBuffer\Services\ExternalApi\TikTokService;
use Illuminate\Support\Facades\Log;

class TikTokPublisher implements PublisherInterface
{
    protected TikTokService $tiktokService;

    public function __construct(TikTokService $tiktokService)
    {
        $this->tiktokService = $tiktokService;
    }

    /**
     * Publica um post no TikTok.
     *
     * @param Post $post o post a ser publicado
     * @param SocialAccount $socialAccount a conta social para publicação
     *
     * @return PublishResultDTO o resultado da publicação
     */
    public function publish(Post $post, SocialAccount $socialAccount): PublishResultDTO
    {
        Log::info("Publicando post ID: {$post->id} no TikTok para conta {$socialAccount->id}.");

        try {
            // Validar dados necessários para TikTok
            if (empty($post->media_urls)) {
                throw new \InvalidArgumentException('TikTok requer um vídeo para publicação.');
            }

            // Configurar token de acesso específico da conta
            $this->tiktokService->setAccessToken($socialAccount->access_token);

            // Preparar dados do vídeo
            $videoUrl = is_array($post->media_urls) ? $post->media_urls[0] : $post->media_urls;
            $caption = $post->content ?? '';

            // Validar se é vídeo
            if (!$this->isVideoUrl($videoUrl)) {
                throw new \InvalidArgumentException('TikTok aceita apenas vídeos.');
            }

            // Publicar vídeo no TikTok
            $response = $this->tiktokService->publishVideo($videoUrl, $caption);

            $postId = $response['data']['video']['id'] ?? 'unknown';
            $postUrl = $response['data']['video']['share_url'] ?? "https://tiktok.com/@user/video/{$postId}";

            Log::info("Post ID: {$post->id} publicado com sucesso no TikTok. TikTok Post ID: {$postId}");

            return new PublishResultDTO(
                success: true,
                message: 'Post published successfully on TikTok.',
                platformPostId: $postId,
                platform: 'tiktok',
                postUrl: $postUrl,
                response: $response,
            );
        } catch (\Exception $e) {
            Log::error("Falha ao publicar post ID: {$post->id} no TikTok. Erro: " . $e->getMessage());

            return new PublishResultDTO(
                success: false,
                message: "Failed to publish post on TikTok: {$e->getMessage()}",
                platform: 'tiktok',
                error: $e->getMessage(),
            );
        }
    }

    /**
     * Verifica se a URL é de um vídeo.
     */
    protected function isVideoUrl(string $url): bool
    {
        $videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv'];
        $extension = strtolower(pathinfo($url, PATHINFO_EXTENSION));
        return in_array($extension, $videoExtensions);
    }
}
