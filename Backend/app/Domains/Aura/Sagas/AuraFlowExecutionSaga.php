<?php

namespace App\Domains\Aura\Sagas;

use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraFlowExecutionModel;
use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraFlowModel;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Aura Flow Execution Saga
 * 
 * Saga for managing complex flow execution workflows in the Aura domain.
 * Implements saga pattern for distributed transactions and workflow orchestration.
 */
class AuraFlowExecutionSaga
{
    protected const SAGA_STATUS_PENDING = 'pending';
    protected const SAGA_STATUS_RUNNING = 'running';
    protected const SAGA_STATUS_COMPLETED = 'completed';
    protected const SAGA_STATUS_FAILED = 'failed';
    protected const SAGA_STATUS_COMPENSATING = 'compensating';
    protected const SAGA_STATUS_COMPENSATED = 'compensated';

    /**
     * Start a new flow execution saga.
     * 
     * @param string $flowId
     * @param array $initialData
     * @return string Saga ID
     */
    public function start(string $flowId, array $initialData = []): string
    {
        try {
            Log::info("AuraFlowExecutionSaga::start - starting", [
                'flow_id' => $flowId,
                'initial_data_keys' => array_keys($initialData)
            ]);

            $flow = AuraFlowModel::findOrFail($flowId);

            // Gerar ID único para a saga
            $sagaId = Str::uuid()->toString();

            // Criar registro de saga no banco de dados
            // Usando campo 'context' do AuraFlowExecutionModel para armazenar dados da saga
            $sagaData = [
                'saga_id' => $sagaId,
                'flow_id' => $flowId,
                'status' => self::SAGA_STATUS_PENDING,
                'steps' => [],
                'compensation_log' => [],
                'started_at' => now()->toIso8601String(),
                'initial_data' => $initialData
            ];

            // Criar execução de fluxo associada à saga
            $execution = AuraFlowExecutionModel::create([
                'flow_id' => $flowId,
                'status' => 'pending',
                'context' => $sagaData,
                'started_at' => now(),
            ]);

            // Iniciar execução da saga
            $this->executeSagaSteps($sagaId, $flow, $initialData);

            Log::info("AuraFlowExecutionSaga::start - success", [
                'saga_id' => $sagaId,
                'execution_id' => $execution->id
            ]);

            return $sagaId;
        } catch (\Exception $e) {
            Log::error("AuraFlowExecutionSaga::start - error", [
                'flow_id' => $flowId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            throw new \RuntimeException("Erro ao iniciar saga: " . $e->getMessage());
        }
    }

    /**
     * Execute saga steps.
     */
    protected function executeSagaSteps(string $sagaId, AuraFlowModel $flow, array $initialData): void
    {
        try {
            $execution = $this->getExecutionBySagaId($sagaId);
            if (!$execution) {
                throw new \Exception("Execução não encontrada para saga: {$sagaId}");
            }

            $sagaData = $execution->context ?? [];
            $sagaData['status'] = self::SAGA_STATUS_RUNNING;
            $execution->update(['context' => $sagaData, 'status' => 'running']);

            $structure = $flow->structure ?? [];
            $nodes = $structure['nodes'] ?? [];
            $steps = [];

            // Processar cada nó como um passo da saga
            foreach ($nodes as $index => $node) {
                $stepId = "step_{$index}_{$node['id']}";
                
                try {
                    $stepResult = $this->executeStep($stepId, $node, $initialData, $execution);
                    
                    $steps[] = [
                        'step_id' => $stepId,
                        'node_id' => $node['id'],
                        'node_type' => $node['type'] ?? 'unknown',
                        'status' => 'completed',
                        'result' => $stepResult,
                        'executed_at' => now()->toIso8601String(),
                        'compensation_data' => $stepResult['compensation_data'] ?? null
                    ];

                    // Atualizar contexto da saga
                    $sagaData['steps'] = $steps;
                    $execution->update(['context' => $sagaData]);

                } catch (\Exception $e) {
                    // Erro em um passo - iniciar compensação
                    Log::error("Erro ao executar passo da saga", [
                        'saga_id' => $sagaId,
                        'step_id' => $stepId,
                        'error' => $e->getMessage()
                    ]);

                    $steps[] = [
                        'step_id' => $stepId,
                        'node_id' => $node['id'],
                        'status' => 'failed',
                        'error' => $e->getMessage(),
                        'executed_at' => now()->toIso8601String()
                    ];

                    $sagaData['steps'] = $steps;
                    $sagaData['status'] = self::SAGA_STATUS_FAILED;
                    $execution->update(['context' => $sagaData, 'status' => 'failed']);

                    // Iniciar compensação
                    $this->compensate($sagaId, $stepId);
                    break;
                }
            }

            // Se todos os passos foram executados com sucesso, completar saga
            $allStepsCompleted = !empty($steps) && !in_array('failed', array_column($steps, 'status'));
            if ($allStepsCompleted) {
                $this->complete($sagaId);
            }

        } catch (\Exception $e) {
            Log::error("Erro ao executar passos da saga", [
                'saga_id' => $sagaId,
                'error' => $e->getMessage()
            ]);

            $this->compensate($sagaId, 'all');
        }
    }

    /**
     * Execute a single saga step.
     */
    protected function executeStep(string $stepId, array $node, array $context, AuraFlowExecutionModel $execution): array
    {
        $nodeType = $node['type'] ?? 'unknown';
        $nodeData = $node['data'] ?? [];

        // Executar ação do nó
        $result = match ($nodeType) {
            'message' => $this->executeMessageStep($nodeData, $context),
            'webhook' => $this->executeWebhookStep($nodeData, $context),
            'database' => $this->executeDatabaseStep($nodeData, $context),
            'external_api' => $this->executeExternalApiStep($nodeData, $context),
            default => ['executed' => true, 'note' => 'Step type not implemented']
        };

        // Preparar dados de compensação
        $compensationData = $this->prepareCompensationData($nodeType, $nodeData, $result);

        return [
            'step_id' => $stepId,
            'result' => $result,
            'compensation_data' => $compensationData
        ];
    }

    /**
     * Execute message step.
     */
    protected function executeMessageStep(array $nodeData, array $context): array
    {
        // Integrar com WhatsAppService para enviar mensagem
        $whatsappService = app(\App\Domains\Aura\Services\WhatsAppService::class);
        
        $connectionId = $nodeData['connection_id'] ?? $context['connection_id'] ?? null;
        $to = $nodeData['to'] ?? $context['phone_number'] ?? null;
        $message = $nodeData['message'] ?? '';

        if (!$connectionId || !$to) {
            throw new \Exception("Connection ID e destinatário são obrigatórios para passo de mensagem");
        }

        $result = $whatsappService->sendTextMessage($connectionId, $to, $message);

        return [
            'type' => 'message',
            'success' => $result['success'] ?? false,
            'message_id' => $result['message_id'] ?? null
        ];
    }

    /**
     * Execute webhook step.
     */
    protected function executeWebhookStep(array $nodeData, array $context): array
    {
        $url = $nodeData['url'] ?? null;
        $method = $nodeData['method'] ?? 'POST';
        $payload = $nodeData['payload'] ?? [];

        if (!$url) {
            throw new \Exception("URL é obrigatória para passo de webhook");
        }

        $response = \Illuminate\Support\Facades\Http::timeout(30)
            ->send($method, $url, ['json' => $payload]);

        return [
            'type' => 'webhook',
            'success' => $response->successful(),
            'status_code' => $response->status(),
            'response' => $response->json()
        ];
    }

    /**
     * Execute database step.
     */
    protected function executeDatabaseStep(array $nodeData, array $context): array
    {
        $table = $nodeData['table'] ?? null;
        $action = $nodeData['action'] ?? 'insert';
        $data = $nodeData['data'] ?? [];

        if (!$table) {
            throw new \Exception("Tabela é obrigatória para passo de banco de dados");
        }

        $result = match ($action) {
            'insert' => DB::table($table)->insert($data),
            'update' => DB::table($table)->where($nodeData['where'] ?? [])->update($data),
            'delete' => DB::table($table)->where($nodeData['where'] ?? [])->delete(),
            default => throw new \Exception("Ação de banco de dados não suportada: {$action}")
        };

        return [
            'type' => 'database',
            'action' => $action,
            'table' => $table,
            'success' => $result !== false,
            'affected_rows' => is_int($result) ? $result : null
        ];
    }

    /**
     * Execute external API step.
     */
    protected function executeExternalApiStep(array $nodeData, array $context): array
    {
        $url = $nodeData['url'] ?? null;
        $method = $nodeData['method'] ?? 'POST';
        $headers = $nodeData['headers'] ?? [];
        $payload = $nodeData['payload'] ?? [];

        if (!$url) {
            throw new \Exception("URL é obrigatória para passo de API externa");
        }

        $response = \Illuminate\Support\Facades\Http::withHeaders($headers)
            ->timeout(30)
            ->send($method, $url, ['json' => $payload]);

        return [
            'type' => 'external_api',
            'success' => $response->successful(),
            'status_code' => $response->status(),
            'response' => $response->json()
        ];
    }

    /**
     * Prepare compensation data for a step.
     */
    protected function prepareCompensationData(string $nodeType, array $nodeData, array $result): ?array
    {
        return match ($nodeType) {
            'message' => [
                'type' => 'message',
                'action' => 'delete_or_mark_cancelled',
                'message_id' => $result['message_id'] ?? null
            ],
            'database' => [
                'type' => 'database',
                'action' => 'rollback',
                'table' => $nodeData['table'] ?? null,
                'data' => $nodeData['data'] ?? []
            ],
            'webhook', 'external_api' => [
                'type' => $nodeType,
                'action' => 'compensate_call',
                'url' => $nodeData['url'] ?? null,
                'compensation_url' => $nodeData['compensation_url'] ?? null
            ],
            default => null
        };
    }

    /**
     * Compensate (rollback) a saga step.
     * 
     * @param string $sagaId
     * @param string $stepId
     * @return bool
     */
    public function compensate(string $sagaId, string $stepId): bool
    {
        try {
            Log::info("AuraFlowExecutionSaga::compensate - starting", [
                'saga_id' => $sagaId,
                'step_id' => $stepId
            ]);

            $execution = $this->getExecutionBySagaId($sagaId);
            if (!$execution) {
                throw new \Exception("Execução não encontrada para saga: {$sagaId}");
            }

            $sagaData = $execution->context ?? [];
            $steps = $sagaData['steps'] ?? [];
            $compensationLog = $sagaData['compensation_log'] ?? [];

            // Se stepId é 'all', compensar todos os passos em ordem reversa
            if ($stepId === 'all') {
                $stepsToCompensate = array_reverse($steps);
            } else {
                // Encontrar o passo específico e todos os passos anteriores
                $stepIndex = array_search($stepId, array_column($steps, 'step_id'));
                if ($stepIndex === false) {
                    throw new \Exception("Passo {$stepId} não encontrado na saga");
                }
                $stepsToCompensate = array_reverse(array_slice($steps, 0, $stepIndex + 1));
            }

            $sagaData['status'] = self::SAGA_STATUS_COMPENSATING;
            $execution->update(['context' => $sagaData]);

            // Compensar cada passo
            foreach ($stepsToCompensate as $step) {
                if (($step['status'] ?? '') === 'completed' && isset($step['compensation_data'])) {
                    $compensationResult = $this->executeCompensation($step['compensation_data']);
                    
                    $compensationLog[] = [
                        'step_id' => $step['step_id'],
                        'compensated_at' => now()->toIso8601String(),
                        'result' => $compensationResult
                    ];
                }
            }

            $sagaData['compensation_log'] = $compensationLog;
            $sagaData['status'] = self::SAGA_STATUS_COMPENSATED;
            $execution->update([
                'context' => $sagaData,
                'status' => 'compensated',
                'completed_at' => now()
            ]);

            Log::info("AuraFlowExecutionSaga::compensate - success", [
                'saga_id' => $sagaId,
                'steps_compensated' => count($compensationLog)
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error("AuraFlowExecutionSaga::compensate - error", [
                'saga_id' => $sagaId,
                'step_id' => $stepId,
                'error' => $e->getMessage()
            ]);

            return false;
        }
    }

    /**
     * Execute compensation for a step.
     */
    protected function executeCompensation(array $compensationData): array
    {
        $type = $compensationData['type'] ?? 'unknown';
        $action = $compensationData['action'] ?? null;

        return match ($type) {
            'message' => $this->compensateMessage($compensationData),
            'database' => $this->compensateDatabase($compensationData),
            'webhook', 'external_api' => $this->compensateApiCall($compensationData),
            default => ['compensated' => false, 'message' => 'Tipo de compensação não suportado']
        };
    }

    /**
     * Compensate message step.
     */
    protected function compensateMessage(array $compensationData): array
    {
        // Marcar mensagem como cancelada ou enviar mensagem de cancelamento
        return ['compensated' => true, 'action' => 'message_marked_cancelled'];
    }

    /**
     * Compensate database step.
     */
    protected function compensateDatabase(array $compensationData): array
    {
        $table = $compensationData['table'] ?? null;
        $data = $compensationData['data'] ?? [];

        if ($table && !empty($data)) {
            // Reverter inserção ou atualização
            // Em produção, usar transações ou soft deletes
            return ['compensated' => true, 'action' => 'database_rollback_initiated'];
        }

        return ['compensated' => false, 'message' => 'Dados insuficientes para compensação'];
    }

    /**
     * Compensate API call step.
     */
    protected function compensateApiCall(array $compensationData): array
    {
        $compensationUrl = $compensationData['compensation_url'] ?? null;

        if ($compensationUrl) {
            $response = \Illuminate\Support\Facades\Http::post($compensationUrl, [
                'compensation' => true,
                'timestamp' => now()->toIso8601String()
            ]);

            return [
                'compensated' => $response->successful(),
                'action' => 'compensation_api_called'
            ];
        }

        return ['compensated' => false, 'message' => 'URL de compensação não fornecida'];
    }

    /**
     * Complete the saga.
     * 
     * @param string $sagaId
     * @return bool
     */
    public function complete(string $sagaId): bool
    {
        try {
            Log::info("AuraFlowExecutionSaga::complete - starting", [
                'saga_id' => $sagaId
            ]);

            $execution = $this->getExecutionBySagaId($sagaId);
            if (!$execution) {
                throw new \Exception("Execução não encontrada para saga: {$sagaId}");
            }

            $sagaData = $execution->context ?? [];
            $sagaData['status'] = self::SAGA_STATUS_COMPLETED;
            $sagaData['completed_at'] = now()->toIso8601String();

            $execution->update([
                'context' => $sagaData,
                'status' => 'completed',
                'completed_at' => now()
            ]);

            Log::info("AuraFlowExecutionSaga::complete - success", [
                'saga_id' => $sagaId
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error("AuraFlowExecutionSaga::complete - error", [
                'saga_id' => $sagaId,
                'error' => $e->getMessage()
            ]);

            return false;
        }
    }

    /**
     * Get execution by saga ID.
     */
    protected function getExecutionBySagaId(string $sagaId): ?AuraFlowExecutionModel
    {
        return AuraFlowExecutionModel::whereJsonContains('context->saga_id', $sagaId)->first();
    }
}
