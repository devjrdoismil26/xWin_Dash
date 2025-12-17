<?php

namespace App\Domains\SocialBuffer\Publishers;

use App\Domains\SocialBuffer\Contracts\PublisherInterface;
use App\Domains\SocialBuffer\Models\Post;
use App\Domains\SocialBuffer\Models\SocialAccount;
use App\Domains\SocialBuffer\DTOs\PublishResultDTO;
use Illuminate\Support\Facades\Log;

class LogTwitterPublisher implements PublisherInterface
{
    /**
     * Simula a publicação de um post no Twitter, apenas logando a operação.
     *
     * @param Post $post o post a ser publicado
     *
     * @return PublishResultDTO o resultado simulado da publicação
     */
    public function publish(Post $post, SocialAccount $socialAccount): PublishResultDTO
    {
        Log::info("Simulando publicação de post ID: {$post->id} no Twitter para conta {$socialAccount->id}. Conteúdo: {$post->content}");

        // Simulação de sucesso
        $mockPostId = 'twitter_post_' . uniqid();
        $mockPostUrl = "https://twitter.com/user/status/{$mockPostId}";

        return new PublishResultDTO(
            success: true,
            message: 'Simulated: Post published successfully on Twitter.',
            platformPostId: $mockPostId,
            platform: 'twitter',
            postUrl: $mockPostUrl,
        );
    }
}
