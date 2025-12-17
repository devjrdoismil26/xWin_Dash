<?php

namespace App\Domains\Workflows\Jobs;

use App\Domains\Workflows\Events\WorkflowNodeProcessed;
use App\Domains\Workflows\Executors\ExecutorFactory;
use App\Domains\Workflows\Services\WorkflowExecutionService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable; // Supondo que este serviço exista
use Illuminate\Queue\InteractsWithQueue; // Supondo que a Factory exista
use Illuminate\Queue\SerializesModels; // Supondo que este evento exista
use Illuminate\Support\Facades\Log;

class ProcessWorkflowNodeJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public int $workflowExecutionId;

    /**
     * @var array<string, mixed>
     */
    public array $nodeConfig;

    /**
     * @var array<string, mixed>
     */
    public array $payload;

    /**
     * Create a new job instance.
     *
     * @param int   $workflowExecutionId o ID da execução do workflow
     * @param array<string, mixed> $nodeConfig          a configuração do nó a ser executado
     * @param array<string, mixed> $payload             o payload atual do workflow
     */
    public function __construct(int $workflowExecutionId, array $nodeConfig, array $payload)
    {
        $this->workflowExecutionId = $workflowExecutionId;
        $this->nodeConfig = $nodeConfig;
        $this->payload = $payload;
    }

    /**
     * Execute the job.
     *
     * @param WorkflowExecutionService $workflowExecutionService
     */
    public function handle(WorkflowExecutionService $workflowExecutionService): void
    {
        $nodeId = $this->nodeConfig['id'] ?? 'unknown';
        $nodeType = $this->nodeConfig['type'] ?? 'unknown';
        Log::info("Processando nó de workflow ID: {$nodeId}, Tipo: {$nodeType} para execução ID: {$this->workflowExecutionId}.");

        try {
            if (class_exists('App\\Domains\\Workflows\\Executors\\ExecutorFactory')) {
                $executor = ExecutorFactory::create($nodeType);

                // Convert arrays to proper objects if needed
                $nodeObject = (object) $this->nodeConfig;
                $leadObject = (object) $this->payload;
                $contextObject = null; // Create proper context if needed

                $updatedPayload = $executor->execute($nodeObject, $leadObject, $contextObject);
            } else {
                // Fallback execution
                $updatedPayload = $this->payload;
                Log::warning("ExecutorFactory não encontrada, usando fallback.");
            }

            // Atualizar o estado da execução do workflow
            $workflowExecutionService->updateExecutionStatus($this->workflowExecutionId, 'in_progress', ['payload' => $updatedPayload]);
            $workflowExecutionService->recordNodeCompletion($this->workflowExecutionId, $nodeId, 'completed');

            WorkflowNodeProcessed::dispatch($this->workflowExecutionId, $nodeId, $nodeType, $updatedPayload, 'completed');
            Log::info("Nó de workflow ID: {$nodeId} processado com sucesso para execução ID: {$this->workflowExecutionId}.");

            // Disparar o próximo nó, se houver
            $nextNodeId = $updatedPayload['next_node'] ?? null; // Assumindo que o executor define o próximo nó
            if ($nextNodeId && $nextNodeId !== 'end') {
                $workflow = $workflowExecutionService->getWorkflowByExecutionId($this->workflowExecutionId); // Obter o workflow
                $nextNodeConfig = $workflow->definition['nodes'][$nextNodeId] ?? null; // Obter a configuração do próximo nó
                if ($nextNodeConfig) {
                    ProcessWorkflowNodeJob::dispatch($this->workflowExecutionId, $nextNodeConfig, $updatedPayload);
                }
            }
        } catch (\Exception $e) {
            Log::error("Falha ao processar nó de workflow ID: {$nodeId}, Tipo: {$nodeType} para execução ID: {$this->workflowExecutionId}. Erro: " . $e->getMessage());
            $workflowExecutionService->recordNodeCompletion($this->workflowExecutionId, $nodeId, 'failed', $e->getMessage());
            // Disparar evento de falha do workflow
            // WorkflowFailed::dispatch($this->workflowExecutionId, $e->getMessage());
        }
    }
}
