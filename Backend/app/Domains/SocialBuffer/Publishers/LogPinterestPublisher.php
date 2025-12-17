<?php

namespace App\Domains\SocialBuffer\Publishers;

use App\Domains\SocialBuffer\Contracts\PublisherInterface;
use App\Domains\SocialBuffer\Models\Post;
use App\Domains\SocialBuffer\Models\SocialAccount;
use App\Domains\SocialBuffer\DTOs\PublishResultDTO;
use Illuminate\Support\Facades\Log;

class LogPinterestPublisher implements PublisherInterface
{
    /**
     * Simula a publicação de um post no Pinterest, apenas logando a operação.
     *
     * @param Post $post o post a ser publicado
     *
     * @return PublishResultDTO o resultado simulado da publicação
     */
    public function publish(Post $post, SocialAccount $socialAccount): PublishResultDTO
    {
        Log::info("Simulando publicação de post ID: {$post->id} no Pinterest para conta {$socialAccount->id}. Conteúdo: {$post->content}");

        // Simulação de sucesso
        $mockPostId = 'pinterest_post_' . uniqid();
        $mockPostUrl = "https://pinterest.com/pin/{$mockPostId}";

        return new PublishResultDTO(
            success: true,
            message: 'Simulated: Post published successfully on Pinterest.',
            platformPostId: $mockPostId,
            platform: 'pinterest',
            postUrl: $mockPostUrl,
        );
    }
}
