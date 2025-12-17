<?php

namespace App\Domains\Workflows\Events;

use App\Domains\Workflows\Domain\WorkflowExecution;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

/**
 * Evento disparado quando um workflow atinge o tempo limite.
 */
class WorkflowTimeout
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var WorkflowExecution a execução do workflow que atingiu o tempo limite
     */
    public WorkflowExecution $execution;

    /**
     * @var int o tempo limite em segundos
     */
    public int $timeoutSeconds;

    /**
     * Create a new event instance.
     *
     * @param WorkflowExecution $execution
     * @param int               $timeoutSeconds
     */
    public function __construct(WorkflowExecution $execution, int $timeoutSeconds)
    {
        $this->execution = $execution;
        $this->timeoutSeconds = $timeoutSeconds;
    }
}
