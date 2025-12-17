<?php

namespace App\Domains\AI\Events;

use App\Domains\AI\Models\AIGeneration;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels; // Supondo que o Model exista
use Throwable;

/**
 * Evento disparado quando uma geração de AI falha.
 */
class AIGenerationFailed
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var AIGeneration o model da geração de AI que falhou
     */
    public AIGeneration $aiGeneration;

    /**
     * @var Throwable|null a exceção que causou a falha, se disponível
     */
    public ?Throwable $exception;

    /**
     * Create a new event instance.
     *
     * @param AIGeneration   $aiGeneration
     * @param Throwable|null $exception
     */
    public function __construct(AIGeneration $aiGeneration, ?Throwable $exception = null)
    {
        $this->aiGeneration = $aiGeneration;
        $this->exception = $exception;
    }
}
