<?php

namespace App\Domains\AI\Observers;

use App\Domains\AI\Events\AIGenerationCompleted;
use App\Domains\AI\Events\AIGenerationCreated; // Exemplo de job a ser disparado
use App\Domains\AI\Events\AIGenerationFailed;
use App\Domains\AI\Jobs\GenerateTextJob;
use App\Domains\AI\Models\AIGeneration;

class AIGenerationObserver
{
    /**
     * Handle the AIGeneration "created" event.
     *
     * @param \App\Domains\AI\Models\AIGeneration $aiGeneration
     * @return void
     */
    public function created(AIGeneration $aiGeneration): void
    {
        // Dispara um evento para notificar que uma nova geração foi criada
        AIGenerationCreated::dispatch($aiGeneration);

        // Exemplo: Job será disparado por outros listeners baseado no tipo
        // Para evitar dependência de propriedades inexistentes no modelo
    }

    /**
     * Handle the AIGeneration "updated" event.
     *
     * @param \App\Domains\AI\Models\AIGeneration $aiGeneration
     * @return void
     */
    public function updated(AIGeneration $aiGeneration): void
    {
        // Se o status mudou para 'completed', dispara o evento de conclusão
        if ($aiGeneration->isDirty('status') && $aiGeneration->isCompleted()) {
            AIGenerationCompleted::dispatch($aiGeneration);
        }

        // Se o status mudou para 'failed', dispara o evento de falha
        if ($aiGeneration->isDirty('status') && $aiGeneration->isFailed()) {
            AIGenerationFailed::dispatch($aiGeneration);
        }
    }

    /**
     * Handle the AIGeneration "deleted" event.
     *
     * @param \App\Domains\AI\Models\AIGeneration $aiGeneration
     * @return void
     */
    public function deleted(AIGeneration $aiGeneration): void
    {
        //
    }

    /**
     * Handle the AIGeneration "restored" event.
     *
     * @param \App\Domains\AI\Models\AIGeneration $aiGeneration
     * @return void
     */
    public function restored(AIGeneration $aiGeneration): void
    {
        //
    }

    /**
     * Handle the AIGeneration "forceDeleted" event.
     *
     * @param \App\Domains\AI\Models\AIGeneration $aiGeneration
     * @return void
     */
    public function forceDeleted(AIGeneration $aiGeneration): void
    {
        //
    }
}
