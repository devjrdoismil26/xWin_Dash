<?php

namespace App\Domains\Universe\Listeners;

use App\Domains\Universe\Events\AIPersonalizationCompleted;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class ProcessAIPersonalizationResult implements ShouldQueue
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
     * @param AIPersonalizationCompleted $event
     */
    public function handle(AIPersonalizationCompleted $event): void
    {
        $userId = $event->userId;
        $personalizedContent = $event->personalizedContent;

        Log::info("Processando resultado de personalização de IA para o usuário ID: {$userId}.");

        // Lógica para usar o conteúdo personalizado
        // Exemplo: Atualizar o perfil do usuário, enviar um e-mail com o conteúdo, etc.
        // $user = User::find($userId);
        // if ($user) {
        //     $user->update(['personalized_data' => $personalizedContent]);
        //     Log::info("Dados personalizados atualizados para o usuário ID: {$userId}.");
        // }

        Log::info("Resultado de personalização de IA processado para o usuário ID: {$userId}.");
    }
}
