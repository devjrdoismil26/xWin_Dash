<?php

namespace App\Domains\SocialBuffer\Listeners;

use App\Domains\SocialBuffer\Events\PostPublished; // Supondo que este evento exista
use App\Models\User;
use App\Notifications\PostPublishedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue; // Supondo o model de usuário padrão do Laravel
use Illuminate\Support\Facades\Log;

// Supondo que esta notificação exista

class SendPostPublishedNotification implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param PostPublished $event
     */
    public function handle(PostPublished $event)
    {
        $post = $event->post;
        $user = User::find($post->userId); // Supondo que o Post tem um userId

        if ($user) {
            Log::info("Enviando notificação de post publicado para o usuário {$user->id} para o post ID: {$post->id}.");
            $user->notify(new PostPublishedNotification($post, $event->results));
        } else {
            Log::warning("Usuário não encontrado para enviar notificação de post publicado para o post ID: {$post->id}.");
        }
    }
}
