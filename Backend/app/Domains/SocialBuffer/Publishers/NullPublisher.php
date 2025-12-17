<?php

namespace App\Domains\SocialBuffer\Publishers;

use App\Domains\SocialBuffer\Contracts\PublisherInterface;
use App\Domains\SocialBuffer\Models\Post;
use App\Domains\SocialBuffer\Models\SocialAccount;
use App\Domains\SocialBuffer\DTOs\PublishResultDTO;
use Illuminate\Support\Facades\Log;

class NullPublisher implements PublisherInterface
{
    /**
     * Simula a publicação de um post, sem realizar nenhuma ação real.
     *
     * @param Post $post o post a ser "publicado"
     * @param SocialAccount $socialAccount a conta social para publicação
     *
     * @return PublishResultDTO o resultado simulado da publicação
     */
    public function publish(Post $post, SocialAccount $socialAccount): PublishResultDTO
    {
        Log::info("NullPublisher: Simulando publicação de post ID: {$post->id} na conta {$socialAccount->id}. Nenhuma ação real realizada.");

        return new PublishResultDTO(
            success: true,
            message: 'Simulated: Post published successfully (NullPublisher).',
            platformPostId: 'null_post_' . uniqid(),
            platform: 'null',
            postUrl: '#',
        );
    }
}
