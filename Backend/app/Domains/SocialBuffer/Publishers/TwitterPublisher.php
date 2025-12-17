<?php

namespace App\Domains\SocialBuffer\Publishers;

use App\Domains\SocialBuffer\Contracts\PublisherInterface;
use App\Domains\SocialBuffer\Models\Post;
use App\Domains\SocialBuffer\Models\SocialAccount;
use App\Domains\SocialBuffer\DTOs\PublishResultDTO;
use App\Domains\SocialBuffer\Services\ExternalApi\TwitterService;
use Illuminate\Support\Facades\Log;

class TwitterPublisher implements PublisherInterface
{
    protected TwitterService $twitterService;

    public function __construct(TwitterService $twitterService)
    {
        $this->twitterService = $twitterService;
    }

    /**
     * Publica um post no Twitter.
     *
     * @param Post $post o post a ser publicado
     * @param SocialAccount $socialAccount a conta social para publicação
     *
     * @return PublishResultDTO o resultado da publicação
     */
    public function publish(Post $post, SocialAccount $socialAccount): PublishResultDTO
    {
        Log::info("Publicando post ID: {$post->id} no Twitter para conta {$socialAccount->id}.");

        try {
            // Validar dados necessários
            if (empty($post->content)) {
                throw new \InvalidArgumentException('Post deve ter conteúdo para publicação no Twitter.');
            }

            // Configurar credentials específicos da conta
            $this->twitterService->setCredentials(
                $socialAccount->access_token,
                $socialAccount->access_token_secret
            );

            // Preparar mídia (se houver)
            $mediaIds = [];
            if (!empty($post->media_urls)) {
                $mediaUrls = is_array($post->media_urls) ? $post->media_urls : [$post->media_urls];
                foreach ($mediaUrls as $mediaUrl) {
                    try {
                        $mediaId = $this->twitterService->uploadMedia($mediaUrl);
                        $mediaIds[] = $mediaId;
                    } catch (\Exception $e) {
                        Log::warning("Falha ao fazer upload de mídia para Twitter: " . $e->getMessage());
                        // Continuar sem a mídia em caso de erro
                    }
                }
            }

            // Publicar tweet
            $response = $this->twitterService->postTweet($post->content, $mediaIds);

            $tweetId = $response['data']['id'] ?? 'unknown';
            $tweetUrl = "https://twitter.com/user/status/{$tweetId}";

            Log::info("Post ID: {$post->id} publicado com sucesso no Twitter. Tweet ID: {$tweetId}");

            return new PublishResultDTO(
                success: true,
                message: 'Post published successfully on Twitter.',
                platformPostId: $tweetId,
                platform: 'twitter',
                postUrl: $tweetUrl,
                response: $response,
            );
        } catch (\Exception $e) {
            Log::error("Falha ao publicar post ID: {$post->id} no Twitter. Erro: " . $e->getMessage());

            return new PublishResultDTO(
                success: false,
                message: "Failed to publish post on Twitter: {$e->getMessage()}",
                platform: 'twitter',
                error: $e->getMessage(),
            );
        }
    }
}
