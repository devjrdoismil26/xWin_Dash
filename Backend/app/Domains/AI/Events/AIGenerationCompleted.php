<?php

namespace App\Domains\AI\Events;

use App\Domains\AI\Models\AIGeneration;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Supondo que o Model exista

/**
 * Evento disparado quando uma geração de AI é concluída com sucesso.
 */
class AIGenerationCompleted
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var AIGeneration o model da geração de AI concluída
     */
    public AIGeneration $aiGeneration;

    /**
     * Create a new event instance.
     *
     * @param AIGeneration $aiGeneration
     */
    public function __construct(AIGeneration $aiGeneration)
    {
        $this->aiGeneration = $aiGeneration;
    }
}
