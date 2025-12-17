<?php

namespace App\Application\AI\Listeners;

use App\Domains\AI\Events\AIGenerationCompleted;
use App\Domains\AI\Events\AIGenerationCreated;
use App\Domains\AI\Events\AIGenerationFailed;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class ProcessAIGenerationListener implements ShouldQueue
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
     * Handle the AIGenerationCreated event.
     *
     * @param AIGenerationCreated $event
     * @return void
     */
    public function handleAIGenerationCreated(AIGenerationCreated $event): void
    {
        Log::info("ProcessAIGenerationListener: Geração de AI (ID: {$event->aiGeneration->id}) criada. Status: " . $event->aiGeneration->status->value);
        // Lógica para iniciar o processamento da geração, notificar o usuário, etc.
    }

    /**
     * Handle the AIGenerationCompleted event.
     *
     * @param AIGenerationCompleted $event
     * @return void
     */
    public function handleAIGenerationCompleted(AIGenerationCompleted $event): void
    {
        Log::info("ProcessAIGenerationListener: Geração de AI (ID: {$event->aiGeneration->id}) concluída com sucesso.");
        // Lógica para notificar o usuário sobre o resultado, atualizar o frontend, etc.
    }

    /**
     * Handle the AIGenerationFailed event.
     *
     * @param AIGenerationFailed $event
     * @return void
     */
    public function handleAIGenerationFailed(AIGenerationFailed $event): void
    {
        Log::error("ProcessAIGenerationListener: Geração de AI (ID: {$event->aiGeneration->id}) falhou. Erro: {$event->aiGeneration->error_message}");
        // Lógica para notificar o usuário sobre a falha, registrar o erro, etc.
    }

    /**
     * Register the listeners for the subscriber.
     *
     * @param \Illuminate\Events\Dispatcher $events
     * @return array<string, array<int, string>>
     */
    public function subscribe($events): array
    {
        $events->listen(
            AIGenerationCreated::class,
            [ProcessAIGenerationListener::class, 'handleAIGenerationCreated'],
        );

        $events->listen(
            AIGenerationCompleted::class,
            [ProcessAIGenerationListener::class, 'handleAIGenerationCompleted'],
        );

        $events->listen(
            AIGenerationFailed::class,
            [ProcessAIGenerationListener::class, 'handleAIGenerationFailed'],
        );
        
        return [];
    }
}
