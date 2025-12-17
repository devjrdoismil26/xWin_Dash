<?php

namespace App\Domains\Workflows\Events;

use App\Domains\Workflows\Domain\WorkflowExecution;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

/**
 * Evento disparado quando um workflow falha.
 */
class WorkflowFailed
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var mixed a execução do workflow que falhou
     */
    public $execution;

    /**
     * @var string a mensagem de erro da falha
     */
    public string $errorMessage;

    /**
     * Create a new event instance.
     *
     * @param mixed $execution
     * @param string $errorMessage
     */
    public function __construct($execution, string $errorMessage)
    {
        $this->execution = $execution;
        $this->errorMessage = $errorMessage;
    }
}
