<?php

namespace App\Domains\Workflows\Events;

use App\Domains\Workflows\Domain\WorkflowExecution;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

/**
 * Evento disparado quando um workflow é concluído com sucesso.
 */
class WorkflowCompleted
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var mixed a execução do workflow que foi concluída
     */
    public $execution;

    /**
     * Create a new event instance.
     *
     * @param mixed $execution
     */
    public function __construct($execution)
    {
        $this->execution = $execution;
    }
}
