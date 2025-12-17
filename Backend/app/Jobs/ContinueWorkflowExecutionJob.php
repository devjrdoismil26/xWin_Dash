<?php

namespace App\Jobs;

use App\Domains\Workflows\Services\WorkflowExecutionService;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowExecutionModel;
use App\Domains\Leads\Models\Lead;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * 🔄 Continue Workflow Execution Job
 * 
 * Job para continuar a execução de um workflow a partir de um nó específico.
 * Útil para workflows que precisam aguardar eventos externos ou delays.
 */
class ContinueWorkflowExecutionJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /**
     * ID da execução do workflow
     */
    public string $executionId;

    /**
     * ID do nó a partir do qual continuar
     */
    public ?string $fromNodeId;

    /**
     * Payload adicional para a continuação
     *
     * @var array<string, mixed>
     */
    public array $additionalPayload;

    /**
     * Número de tentativas
     */
    public int $tries = 3;

    /**
     * Timeout em segundos
     */
    public int $timeout = 300;

    /**
     * Create a new job instance.
     *
     * @param string $executionId      ID da execução do workflow
     * @param string|null $fromNodeId  ID do nó a partir do qual continuar (opcional)
     * @param array<string, mixed> $additionalPayload Payload adicional (opcional)
     */
    public function __construct(
        string $executionId,
        ?string $fromNodeId = null,
        array $additionalPayload = []
    ) {
        $this->executionId = $executionId;
        $this->fromNodeId = $fromNodeId;
        $this->additionalPayload = $additionalPayload;
    }

    /**
     * Execute the job.
     */
    public function handle(WorkflowExecutionService $executionService): void
    {
        Log::info("Continuando execução do workflow", [
            'execution_id' => $this->executionId,
            'from_node_id' => $this->fromNodeId,
        ]);

        try {
            // Buscar a execução
            $execution = WorkflowExecutionModel::find($this->executionId);

            if (!$execution) {
                Log::error("Execução de workflow não encontrada", [
                    'execution_id' => $this->executionId,
                ]);
                throw new \Exception("Execution not found: {$this->executionId}");
            }

            // Verificar se a execução está em um estado válido para continuar
            if (!in_array($execution->status, ['paused', 'waiting', 'in_progress'])) {
                Log::warning("Execução em estado inválido para continuar", [
                    'execution_id' => $this->executionId,
                    'status' => $execution->status,
                ]);
                return;
            }

            // Mesclar payload adicional com o payload existente
            $currentPayload = array_merge(
                $execution->payload ?? [],
                $this->additionalPayload
            );

            // Atualizar o payload da execução
            $execution->update([
                'payload' => $currentPayload,
                'status' => 'in_progress',
            ]);

            // Buscar o lead associado
            $lead = null;
            if (isset($currentPayload['lead_id'])) {
                $lead = Lead::find($currentPayload['lead_id']);
            }

            // Determinar o próximo nó
            $nextNodeId = $this->fromNodeId ?? $execution->current_node_id;

            if (!$nextNodeId) {
                Log::error("Nenhum nó para continuar a execução", [
                    'execution_id' => $this->executionId,
                ]);
                throw new \Exception("No node to continue from");
            }

            // Continuar a execução do workflow
            $executionService->continueExecution(
                $execution,
                $nextNodeId,
                $lead,
                $currentPayload
            );

            Log::info("Execução do workflow continuada com sucesso", [
                'execution_id' => $this->executionId,
                'from_node_id' => $nextNodeId,
            ]);

        } catch (\Exception $e) {
            Log::error("Erro ao continuar execução do workflow", [
                'execution_id' => $this->executionId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            // Atualizar status da execução para failed
            if (isset($execution)) {
                $execution->update([
                    'status' => 'failed',
                    'error' => $e->getMessage(),
                    'completed_at' => now(),
                ]);
            }

            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("ContinueWorkflowExecutionJob falhou permanentemente", [
            'execution_id' => $this->executionId,
            'error' => $exception->getMessage(),
        ]);

        // Marcar execução como failed
        $execution = WorkflowExecutionModel::find($this->executionId);
        if ($execution) {
            $execution->update([
                'status' => 'failed',
                'error' => $exception->getMessage(),
                'completed_at' => now(),
            ]);
        }
    }
}
