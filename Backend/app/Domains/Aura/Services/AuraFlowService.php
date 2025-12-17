<?php

namespace App\Domains\Aura\Services;

use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraFlowModel;
use Illuminate\Support\Facades\Log;

class AuraFlowService
{
    /**
     * @phpstan-ignore-next-line
     */
    public function __construct(private AuraFlowModel $model)
    {
    }

    /**
     * Inicia um fluxo do Aura para um número específico
     *
     * @param string $flowId ID do fluxo
     * @param string $phoneNumber Número do WhatsApp
     * @param array<string, mixed> $variables Variáveis do contexto
     * @return array{success: bool, execution_id: string|null, message: string}
     */
    public function startFlow(string $flowId, string $phoneNumber, array $variables = []): array
    {
        try {
            Log::info('Starting Aura flow', compact('flowId', 'phoneNumber', 'variables'));

            // Buscar o fluxo
            $flow = $this->model->find($flowId);
            if (!$flow) {
                throw new \RuntimeException("Fluxo {$flowId} não encontrado");
            }

            if (!$flow->is_active) {
                throw new \RuntimeException("Fluxo {$flowId} não está ativo");
            }

            // Criar execução do fluxo
            $execution = $this->createFlowExecution($flow, $phoneNumber, $variables);

            // Iniciar primeiro nó do fluxo
            $this->executeNextNode($execution['id'], $flow->structure['nodes'][0] ?? null);

            Log::info("Fluxo {$flowId} iniciado com sucesso", ['execution_id' => $execution['id']]);

            return [
                'success' => true,
                'execution_id' => $execution['id'],
                'message' => 'Fluxo iniciado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Erro ao iniciar fluxo', [
                'flow_id' => $flowId,
                'phone_number' => $phoneNumber,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'execution_id' => null,
                'message' => 'Erro ao iniciar fluxo: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Cria uma nova execução de fluxo
     *
     * @param AuraFlowModel $flow
     * @param string $phoneNumber
     * @param array $variables
     * @return array{id: string, status: string}
     */
    private function createFlowExecution(AuraFlowModel $flow, string $phoneNumber, array $variables): array
    {
        try {
            // Salvar execução no banco de dados
            $execution = \App\Domains\Aura\Models\AuraFlowExecution::create([
                'flow_id' => $flow->id,
                'phone_number' => $phoneNumber,
                'variables' => json_encode($variables),
                'status' => 'running',
                'current_node_id' => $flow->structure['nodes'][0]['id'] ?? null,
                'started_at' => now(),
                'user_id' => auth()->id(),
                'project_id' => auth()->user()->current_project_id
            ]);

            // Log da execução criada
            Log::info('Aura Flow Execution created', [
                'execution_id' => $execution->id,
                'flow_id' => $flow->id,
                'phone_number' => $phoneNumber,
                'user_id' => auth()->id()
            ]);

            return [
                'id' => $execution->id,
                'status' => 'running',
                'created_at' => $execution->created_at
            ];
        } catch (\Exception $e) {
            Log::error('Error creating Aura Flow Execution', [
                'error' => $e->getMessage(),
                'flow_id' => $flow->id,
                'phone_number' => $phoneNumber
            ]);

            return [
                'id' => null,
                'status' => 'error',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Executa o próximo nó do fluxo
     */
    private function executeNextNode(string $executionId, ?array $node): bool
    {
        if (!$node) {
            Log::warning("Nó não encontrado para execução {$executionId}");
            return false;
        }

        Log::info("Executando nó do fluxo", [
            'execution_id' => $executionId,
            'node_type' => $node['type'] ?? 'unknown',
            'node_id' => $node['id'] ?? 'unknown'
        ]);

        // Implementar execução real dos nós
        switch ($node['type'] ?? '') {
            case 'message':
                return $this->executeMessageNode($executionId, $node);
            case 'condition':
                return $this->executeConditionNode($executionId, $node);
            case 'input':
                return $this->executeInputNode($executionId, $node);
            case 'delay':
                return $this->executeDelayNode($executionId, $node);
            case 'webhook':
                return $this->executeWebhookNode($executionId, $node);
            case 'transfer_human':
                return $this->executeTransferNode($executionId, $node);
            default:
                Log::warning("Tipo de nó não suportado: " . ($node['type'] ?? 'unknown'));
                return false;
        }
    }

    /**
     * Executa nó de mensagem
     */
    private function executeMessageNode(string $executionId, array $node): bool
    {
        try {
            $message = $node['data']['message'] ?? 'Mensagem padrão';

            // Buscar execução para obter número do telefone
            $execution = \App\Domains\Aura\Models\AuraFlowExecution::find($executionId);
            if (!$execution) {
                Log::error('Execution not found', ['execution_id' => $executionId]);
                return false;
            }

            $phoneNumber = $execution->phone_number;

            // Integrar com WhatsAppService real
            $whatsappService = app(\App\Domains\Aura\Services\WhatsAppService::class);
            $result = $whatsappService->sendMessage($phoneNumber, $message);

            if ($result['success']) {
                // Atualizar execução com sucesso
                $execution->update([
                    'last_node_executed' => $node['id'],
                    'last_executed_at' => now()
                ]);

                Log::info("Mensagem enviada com sucesso", [
                    'execution_id' => $executionId,
                    'phone_number' => $phoneNumber,
                    'message' => $message
                ]);
                return true;
            } else {
                Log::error("Falha ao enviar mensagem", [
                    'execution_id' => $executionId,
                    'error' => $result['error'] ?? 'Unknown error'
                ]);
                return false;
            }
        } catch (\Exception $e) {
            Log::error('Error executing message node', [
                'execution_id' => $executionId,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Executa nó de condição
     */
    private function executeConditionNode(string $executionId, array $node): bool
    {
        try {
            $condition = $node['data']['condition'] ?? null;

            // Buscar execução para obter variáveis
            $execution = \App\Domains\Aura\Models\AuraFlowExecution::find($executionId);
            if (!$execution) {
                Log::error('Execution not found', ['execution_id' => $executionId]);
                return false;
            }

            $variables = json_decode($execution->variables, true) ?? [];

            // Implementar avaliação de condições
            $result = $this->evaluateCondition($condition, $variables);

            // Atualizar execução com resultado da condição
            $execution->update([
                'last_node_executed' => $node['id'],
                'last_executed_at' => now(),
                'condition_result' => $result
            ]);

            Log::info("Condição avaliada", [
                'execution_id' => $executionId,
                'condition' => $condition,
                'result' => $result,
                'variables' => $variables
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Error executing condition node', [
                'execution_id' => $executionId,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Executa nó de input/coleta de dados
     */
    private function executeInputNode(string $executionId, array $node): bool
    {
        $inputType = $node['data']['input_type'] ?? 'text';
        $prompt = $node['data']['prompt'] ?? 'Por favor, forneça a informação:';

        try {
            // Buscar execução do fluxo
            $execution = $this->workflowExecutionRepository->findById($executionId);
            if (!$execution) {
                Log::error("Execução não encontrada", compact('executionId'));
                return false;
            }

            // Criar nó de input pendente
            $inputNode = [
                'node_id' => $node['id'],
                'input_type' => $inputType,
                'prompt' => $prompt,
                'status' => 'waiting_input',
                'created_at' => now(),
                'variables' => $execution['variables'] ?? []
            ];

            // Salvar estado de espera por input
            $this->workflowExecutionRepository->update($executionId, [
                'status' => 'waiting_input',
                'current_node_id' => $node['id'],
                'input_pending' => $inputNode,
                'updated_at' => now()
            ]);

            // Enviar mensagem para o usuário solicitando input
            $this->sendInputRequest($execution['user_id'], $execution['chat_id'], $prompt, $inputType);

            Log::info("Input solicitado do usuário", compact('executionId', 'inputType', 'prompt'));
            return true;
        } catch (\Exception $e) {
            Log::error("Erro ao executar nó de input", [
                'executionId' => $executionId,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Executa nó de delay
     */
    private function executeDelayNode(string $executionId, array $node): bool
    {
        $delayMinutes = $node['data']['delay_minutes'] ?? 1;

        try {
            // Buscar execução do fluxo
            $execution = $this->workflowExecutionRepository->findById($executionId);
            if (!$execution) {
                Log::error("Execução não encontrada", compact('executionId'));
                return false;
            }

            // Atualizar status para aguardando delay
            $this->workflowExecutionRepository->update($executionId, [
                'status' => 'waiting_delay',
                'current_node_id' => $node['id'],
                'delay_until' => now()->addMinutes($delayMinutes),
                'updated_at' => now()
            ]);

            // Agendar job para continuar execução após delay
            \App\Jobs\ContinueWorkflowExecutionJob::dispatch($executionId)
                ->delay(now()->addMinutes($delayMinutes));

            Log::info("Delay programado", compact('executionId', 'delayMinutes'));
            return true;
        } catch (\Exception $e) {
            Log::error("Erro ao executar nó de delay", [
                'executionId' => $executionId,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Executa nó de webhook
     */
    private function executeWebhookNode(string $executionId, array $node): bool
    {
        $url = $node['data']['url'] ?? null;
        $method = $node['data']['method'] ?? 'POST';
        $payload = $node['data']['payload'] ?? [];

        try {
            if (!$url) {
                Log::error("URL do webhook não fornecida", compact('executionId'));
                return false;
            }

            // Buscar execução do fluxo para obter variáveis
            $execution = $this->workflowExecutionRepository->findById($executionId);
            if (!$execution) {
                Log::error("Execução não encontrada", compact('executionId'));
                return false;
            }

            // Substituir variáveis no payload
            $processedPayload = $this->processVariables($payload, $execution['variables'] ?? []);

            // Fazer chamada HTTP para webhook
            $response = \Illuminate\Support\Facades\Http::timeout(30)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'User-Agent' => 'Aura-Flow-Service/1.0'
                ])
                ->send($method, $url, [
                    'json' => $processedPayload,
                    'execution_id' => $executionId,
                    'timestamp' => now()->toISOString()
                ]);

            // Salvar resposta do webhook
            $this->workflowExecutionRepository->update($executionId, [
                'webhook_response' => [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'headers' => $response->headers(),
                    'timestamp' => now()
                ],
                'updated_at' => now()
            ]);

            Log::info("Webhook executado", [
                'executionId' => $executionId,
                'url' => $url,
                'method' => $method,
                'status' => $response->status()
            ]);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error("Erro ao executar webhook", [
                'executionId' => $executionId,
                'url' => $url,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Executa nó de transferência para humano
     */
    private function executeTransferNode(string $executionId, array $node): bool
    {
        $department = $node['data']['department'] ?? 'general';
        $priority = $node['data']['priority'] ?? 'normal';

        try {
            // Buscar execução do fluxo
            $execution = $this->workflowExecutionRepository->findById($executionId);
            if (!$execution) {
                Log::error("Execução não encontrada", compact('executionId'));
                return false;
            }

            // Buscar chat associado
            $chat = $this->auraChatRepository->findById($execution['chat_id']);
            if (!$chat) {
                Log::error("Chat não encontrado", [
                    'executionId' => $executionId,
                    'chat_id' => $execution['chat_id']
                ]);
                return false;
            }

            // Atualizar status do chat para transferido
            $this->auraChatRepository->update($execution['chat_id'], [
                'status' => 'transferred_to_human',
                'department' => $department,
                'priority' => $priority,
                'transferred_at' => now(),
                'updated_at' => now()
            ]);

            // Atualizar execução do fluxo
            $this->workflowExecutionRepository->update($executionId, [
                'status' => 'transferred_to_human',
                'current_node_id' => $node['id'],
                'transfer_data' => [
                    'department' => $department,
                    'priority' => $priority,
                    'transferred_at' => now()
                ],
                'updated_at' => now()
            ]);

            // Notificar agentes humanos disponíveis
            $this->notifyHumanAgents($department, $priority, $execution['chat_id'], $execution['user_id']);

            // Enviar mensagem de confirmação para o usuário
            $this->sendTransferConfirmation($execution['user_id'], $execution['chat_id'], $department);

            Log::info("Transferido para agente humano", compact('executionId', 'department', 'priority'));
            return true;
        } catch (\Exception $e) {
            Log::error("Erro ao transferir para humano", [
                'executionId' => $executionId,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Avalia uma condição do fluxo
     */
    private function evaluateCondition(?array $condition, array $variables): bool
    {
        if (!$condition) {
            return false;
        }

        // Implementar avaliação de condições
        // Exemplo: $condition = ['field' => 'user_type', 'operator' => '=', 'value' => 'premium']
        $field = $condition['field'] ?? null;
        $operator = $condition['operator'] ?? '=';
        $value = $condition['value'] ?? null;

        if (!$field || !isset($variables[$field])) {
            return false;
        }

        $fieldValue = $variables[$field];

        return match ($operator) {
            '=' => $fieldValue == $value,
            '!=' => $fieldValue != $value,
            '>' => $fieldValue > $value,
            '<' => $fieldValue < $value,
            '>=' => $fieldValue >= $value,
            '<=' => $fieldValue <= $value,
            'contains' => str_contains($fieldValue, $value),
            'not_contains' => !str_contains($fieldValue, $value),
            default => false
        };
    }

    /**
     * Obtém todos os fluxos ativos
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getActiveFlows()
    {
        return $this->model->where('is_active', true)->get();
    }

    /**
     * Obtém estatísticas de um fluxo
     *
     * @param string $flowId
     * @return array{executions: int, completion_rate: float, avg_duration: float, popular_paths: array}
     */
    public function getFlowStatistics(string $flowId): array
    {
        try {
            $flow = $this->model->find($flowId);
            if (!$flow) {
                throw new \RuntimeException("Fluxo {$flowId} não encontrado");
            }

            // Implementar queries reais com tabela de execuções
            $executions = \App\Domains\Aura\Models\AuraFlowExecution::where('flow_id', $flowId);
            $totalExecutions = $executions->count();
            $completedExecutions = $executions->where('status', 'completed')->count();
            $completionRate = $totalExecutions > 0 ? ($completedExecutions / $totalExecutions) * 100 : 0;

            // Calcular duração média
            $avgDuration = $executions->whereNotNull('completed_at')
                ->whereNotNull('started_at')
                ->selectRaw('AVG(TIMESTAMPDIFF(MINUTE, started_at, completed_at)) as avg_duration')
                ->value('avg_duration') ?? 0;

            // Caminhos populares (nós mais executados)
            $popularPaths = $executions->selectRaw('last_node_executed, COUNT(*) as count')
                ->whereNotNull('last_node_executed')
                ->groupBy('last_node_executed')
                ->orderBy('count', 'desc')
                ->limit(5)
                ->get()
                ->pluck('count', 'last_node_executed')
                ->toArray();

            return [
                'executions' => $totalExecutions,
                'completion_rate' => round($completionRate, 2),
                'avg_duration' => round($avgDuration, 2),
                'popular_paths' => $popularPaths
            ];
        } catch (\Exception $e) {
            Log::error("Erro ao obter estatísticas do fluxo", [
                'flowId' => $flowId,
                'error' => $e->getMessage()
            ]);
            return [
                'executions' => 0,
                'completion_rate' => 0,
                'avg_duration' => 0,
                'popular_paths' => []
            ];
        }
    }

    /**
     * Processa variáveis em um payload
     */
    private function processVariables(array $payload, array $variables): array
    {
        $processed = [];

        foreach ($payload as $key => $value) {
            if (is_string($value)) {
                // Substituir variáveis no formato {{variable_name}}
                $processed[$key] = preg_replace_callback('/\{\{([^}]+)\}\}/', function ($matches) use ($variables) {
                    $varName = trim($matches[1]);
                    return $variables[$varName] ?? $matches[0];
                }, $value);
            } elseif (is_array($value)) {
                $processed[$key] = $this->processVariables($value, $variables);
            } else {
                $processed[$key] = $value;
            }
        }

        return $processed;
    }

    /**
     * Envia solicitação de input para o usuário
     */
    private function sendInputRequest(string $userId, string $chatId, string $prompt, string $inputType): void
    {
        try {
            // Enviar mensagem via WhatsApp
            $this->whatsAppService->sendMessage($chatId, $prompt);

            // Salvar mensagem no banco
            $this->auraMessageRepository->create([
                'chat_id' => $chatId,
                'user_id' => $userId,
                'message_type' => 'system_input_request',
                'content' => $prompt,
                'metadata' => [
                    'input_type' => $inputType,
                    'timestamp' => now()
                ]
            ]);
        } catch (\Exception $e) {
            Log::error("Erro ao enviar solicitação de input", [
                'userId' => $userId,
                'chatId' => $chatId,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Notifica agentes humanos sobre transferência
     */
    private function notifyHumanAgents(string $department, string $priority, string $chatId, string $userId): void
    {
        try {
            // Buscar agentes disponíveis no departamento
            $agents = \App\Domains\Users\Models\User::whereHas('roles', function ($query) {
                $query->where('name', 'human_agent');
            })
            ->where('is_online', true)
            ->where('department', $department)
            ->get();

            foreach ($agents as $agent) {
                // Enviar notificação
                \App\Domains\Core\Services\NotificationService::send([
                    'user_id' => $agent->id,
                    'type' => 'chat_transfer',
                    'title' => 'Novo chat transferido',
                    'message' => "Chat {$chatId} transferido para {$department} (Prioridade: {$priority})",
                    'data' => [
                        'chat_id' => $chatId,
                        'user_id' => $userId,
                        'department' => $department,
                        'priority' => $priority
                    ]
                ]);
            }
        } catch (\Exception $e) {
            Log::error("Erro ao notificar agentes humanos", [
                'department' => $department,
                'chatId' => $chatId,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Envia confirmação de transferência para o usuário
     */
    private function sendTransferConfirmation(string $userId, string $chatId, string $department): void
    {
        try {
            $message = "Você foi transferido para o departamento {$department}. Um agente humano irá atendê-lo em breve.";

            // Enviar via WhatsApp
            $this->whatsAppService->sendMessage($chatId, $message);

            // Salvar mensagem no banco
            $this->auraMessageRepository->create([
                'chat_id' => $chatId,
                'user_id' => $userId,
                'message_type' => 'system_transfer',
                'content' => $message,
                'metadata' => [
                    'department' => $department,
                    'timestamp' => now()
                ]
            ]);
        } catch (\Exception $e) {
            Log::error("Erro ao enviar confirmação de transferência", [
                'userId' => $userId,
                'chatId' => $chatId,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Pausa um fluxo ativo
     */
    public function pauseFlow(string $flowId): bool
    {
        try {
            $flow = $this->model->find($flowId);
            if (!$flow) {
                return false;
            }

            $flow->update(['is_active' => false, 'status' => 'paused']);
            Log::info("Fluxo {$flowId} pausado com sucesso");
            return true;
        } catch (\Exception $e) {
            Log::error("Erro ao pausar fluxo {$flowId}: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Retoma um fluxo pausado
     */
    public function resumeFlow(string $flowId): bool
    {
        try {
            $flow = $this->model->find($flowId);
            if (!$flow) {
                return false;
            }

            $flow->update(['is_active' => true, 'status' => 'active']);
            Log::info("Fluxo {$flowId} retomado com sucesso");
            return true;
        } catch (\Exception $e) {
            Log::error("Erro ao retomar fluxo {$flowId}: " . $e->getMessage());
            return false;
        }
    }
}
