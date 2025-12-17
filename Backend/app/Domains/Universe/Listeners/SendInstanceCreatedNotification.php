<?php

namespace App\Domains\Universe\Listeners;

use App\Domains\Universe\Events\UniverseInstanceCreated;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class SendInstanceCreatedNotification implements ShouldQueue
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
     * @param UniverseInstanceCreated $event
     */
    public function handle(UniverseInstanceCreated $event): void
    {
        $instance = $event->instance;
        /** @var User|null $user */
        $user = User::find($instance->user_id);

        if ($user instanceof User) {
            Log::info("Enviando notificação de instância do Universo criada para o usuário {$user->id} para a instância ID: {$instance->id}.");

            $user->notify(new \App\Domains\Universe\Notifications\UniverseInstanceCreatedNotification($instance));

            Log::info("Notificação enviada com sucesso para o usuário {$user->id}.");
        } else {
            Log::warning("Usuário não encontrado para enviar notificação de instância do Universo criada para a instância ID: {$instance->id}.");
        }
    }
}
