<?php

namespace App\Domains\Workflows\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Evento disparado quando um nó de workflow é processado.
 */
class WorkflowNodeProcessed
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var int o ID da execução do workflow
     */
    public int $workflowExecutionId;

    /**
     * @var string o ID do nó processado
     */
    public string $nodeId;

    /**
     * @var string o tipo do nó processado
     */
    public string $nodeType;

    /**
     * @var array<string, mixed> o payload atual do workflow após o processamento do nó
     */
    public array $payload;

    /**
     * @var string o status do processamento do nó (ex: 'completed', 'failed')
     */
    public string $status;

    /**
     * Create a new event instance.
     *
     * @param int    $workflowExecutionId
     * @param string $nodeId
     * @param string $nodeType
     * @param array<string, mixed>  $payload
     * @param string $status
     */
    public function __construct(int $workflowExecutionId, string $nodeId, string $nodeType, array $payload, string $status)
    {
        $this->workflowExecutionId = $workflowExecutionId;
        $this->nodeId = $nodeId;
        $this->nodeType = $nodeType;
        $this->payload = $payload;
        $this->status = $status;
    }
}
