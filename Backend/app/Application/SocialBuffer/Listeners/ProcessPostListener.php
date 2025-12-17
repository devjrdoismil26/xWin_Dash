<?php

namespace App\Application\SocialBuffer\Listeners;

use App\Application\SocialBuffer\UseCases\PublishPostToPlatformsUseCase;
use App\Domains\SocialBuffer\Contracts\PostRepositoryInterface;
use App\Domains\SocialBuffer\Events\PostCreated;
use App\Shared\ValueObjects\PostStatus;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

/**
 * Listener que processa o post após sua criação.
 * Responsável por agendar ou iniciar a publicação do post.
 */
class ProcessPostListener implements ShouldQueue
{
    private PostRepositoryInterface $postRepository;

    private PublishPostToPlatformsUseCase $publishPostToPlatformsUseCase;

    public function __construct(PostRepositoryInterface $postRepository, PublishPostToPlatformsUseCase $publishPostToPlatformsUseCase)
    {
        $this->postRepository = $postRepository;
        $this->publishPostToPlatformsUseCase = $publishPostToPlatformsUseCase;
    }

    /**
     * Handle the event.
     */
    public function handle(PostCreated $event): void
    {
        $post = $event->post;

        Log::info("Processando post: {$post->id} com status {$post->status}");

        if ($post->status === PostStatus::PUBLISHED) {
            // Dispara o UseCase para publicar o post nas plataformas
            $this->publishPostToPlatformsUseCase->execute($post);
        } elseif ($post->status === PostStatus::SCHEDULED) {
            // Lógica para agendamento (já tratada pelo OrchestratePostCreationAndSchedulingUseCase)
            Log::info("Post {$post->id} agendado. Nenhuma ação adicional necessária aqui.");
        }
    }
}
