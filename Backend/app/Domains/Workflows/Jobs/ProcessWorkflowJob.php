<?php

namespace App\Domains\Workflows\Jobs;

use App\Domains\Workflows\Events\WorkflowCompleted;
use App\Domains\Workflows\Events\WorkflowFailed;
use App\Domains\Workflows\Events\WorkflowStarted;
use App\Domains\Workflows\Services\WorkflowExecutionService;
use App\Domains\Workflows\Services\WorkflowService;
use Illuminate\Bus\Queueable; // Supondo que este serviço exista
use Illuminate\Contracts\Queue\ShouldQueue; // Supondo que este serviço exista
use Illuminate\Foundation\Bus\Dispatchable; // Supondo que este evento exista
use Illuminate\Queue\InteractsWithQueue; // Supondo que este evento exista
use Illuminate\Queue\SerializesModels; // Supondo que este evento exista
use Illuminate\Support\Facades\Log;

class ProcessWorkflowJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public int $workflowId;

    /**
     * @var array<string, mixed>
     */
    public array $initialPayload;

    public ?int $userId;

    /**
     * Create a new job instance.
     *
     * @param int      $workflowId     o ID do workflow a ser processado
     * @param array<string, mixed> $initialPayload o payload inicial para o workflow
     * @param int|null $userId         o ID do usuário que disparou o workflow (opcional)
     */
    public function __construct(int $workflowId, array $initialPayload = [], ?int $userId = null)
    {
        $this->workflowId = $workflowId;
        $this->initialPayload = $initialPayload;
        $this->userId = $userId;
    }

    /**
     * Execute the job.
     *
     * @param WorkflowService          $workflowService
     * @param WorkflowExecutionService $workflowExecutionService
     */
    public function handle(WorkflowService $workflowService, WorkflowExecutionService $workflowExecutionService): void
    {
        Log::info("Iniciando ProcessWorkflowJob para workflow ID: {$this->workflowId}.");

        try {
            $workflow = $workflowService->getWorkflowById($this->workflowId);
            if ($workflow === null) {
                throw new \Exception("Workflow ID: {$this->workflowId} não encontrado.");
            }

            // Criar uma nova execução de workflow
            $execution = $workflowExecutionService->createExecution($this->workflowId, $this->initialPayload, $this->userId);
            WorkflowStarted::dispatch($execution); // Disparar evento de início

            $currentPayload = $this->initialPayload;
            $currentNodeId = 'start'; // Assumindo que o workflow sempre começa com um nó 'start'

            // Loop de execução do workflow
            while ($currentNodeId !== 'end') {
                $nodeConfig = $workflow->definition['nodes'][$currentNodeId] ?? null;

                if (!$nodeConfig) {
                    throw new \Exception("Nó de workflow '{$currentNodeId}' não encontrado na definição.");
                }

                // Atualizar o status da execução para o nó atual
                $workflowExecutionService->updateExecutionStatus($execution->id, 'in_progress', ['current_node' => $currentNodeId]);

                // Executar o nó (pode ser um job síncrono ou disparar outro job assíncrono)
                // Para este exemplo, vamos chamar o executor diretamente
                $executor = \App\Domains\Workflows\Jobs\WorkflowNodeExecutorFactory::create($nodeConfig['type']); // Supondo que a Factory existe
                $nodeResult = $executor->execute($nodeConfig, $currentPayload);

                // Atualizar o payload com o resultado do nó
                $currentPayload = array_merge($currentPayload, $nodeResult);

                // Determinar o próximo nó
                $currentNodeId = $nodeResult['next_node'] ?? ($nodeConfig['next'] ?? 'end');

                // Registrar a conclusão do nó
                $workflowExecutionService->recordNodeCompletion($execution->id, $currentNodeId, 'completed');
            }

            // Finalizar a execução do workflow
            $workflowExecutionService->updateExecutionStatus($execution->id, 'completed');
            WorkflowCompleted::dispatch($execution); // Disparar evento de conclusão
            Log::info("ProcessWorkflowJob para workflow ID: {$this->workflowId} concluído com sucesso.");
        } catch (\Exception $e) {
            Log::error("Falha no ProcessWorkflowJob para workflow ID: {$this->workflowId}. Erro: " . $e->getMessage());
            // Registrar falha na execução
            $workflowExecutionService->updateExecutionStatus($execution->id, 'failed', ['error_message' => $e->getMessage()]);
            WorkflowFailed::dispatch($execution, $e->getMessage()); // Disparar evento de falha
        }
    }
}
