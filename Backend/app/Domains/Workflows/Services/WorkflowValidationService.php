<?php

namespace App\Domains\Workflows\Services;

use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowModel;
use Illuminate\Support\Facades\Log;

/**
 * ✅ Workflow Validation Service
 *
 * Serviço especializado para validação de workflows
 * Responsável por validar workflows antes da execução
 */
class WorkflowValidationService
{
    public function __construct(
        private WorkflowModel $workflows
    ) {
    }

    /**
     * Validar workflow antes da execução
     */
    public function validateWorkflow(int $workflowId, array $payload, array $options = []): array
    {
        $errors = [];

        try {
            // Validar existência do workflow
            $workflow = $this->workflows->find($workflowId);
            if (!$workflow) {
                $errors[] = 'Workflow not found';
                return ['valid' => false, 'errors' => $errors];
            }

            // Validar status do workflow
            if (!$workflow->is_active) {
                $errors[] = 'Workflow is not active';
            }

            // Validar definição do workflow
            $definition = (array) ($workflow->canvas_definition ?? []);
            if (empty($definition)) {
                $errors[] = 'Workflow definition is empty';
            } else {
                $definitionErrors = $this->validateWorkflowDefinition($definition);
                $errors = array_merge($errors, $definitionErrors);
            }

            // Validar payload
            $payloadErrors = $this->validatePayload($payload, $definition);
            $errors = array_merge($errors, $payloadErrors);

            // Validar opções
            $optionsErrors = $this->validateOptions($options);
            $errors = array_merge($errors, $optionsErrors);

            // Validar permissões do usuário
            if (isset($options['user_id'])) {
                $permissionErrors = $this->validateUserPermissions($workflowId, $options['user_id']);
                $errors = array_merge($errors, $permissionErrors);
            }

            return [
                'valid' => empty($errors),
                'errors' => $errors,
                'workflow' => $workflow
            ];
        } catch (\Exception $e) {
            Log::error('Erro na validação de workflow: ' . $e->getMessage(), [
                'workflow_id' => $workflowId,
                'payload' => $payload,
                'options' => $options
            ]);

            return [
                'valid' => false,
                'errors' => ['Validation error: ' . $e->getMessage()]
            ];
        }
    }

    /**
     * Validar definição do workflow
     */
    private function validateWorkflowDefinition(array $definition): array
    {
        $errors = [];

        // Validar estrutura básica
        if (!isset($definition['nodes']) || !is_array($definition['nodes'])) {
            $errors[] = 'Workflow definition must contain nodes array';
        }

        if (!isset($definition['edges']) || !is_array($definition['edges'])) {
            $errors[] = 'Workflow definition must contain edges array';
        }

        if (empty($definition['nodes'])) {
            $errors[] = 'Workflow must have at least one node';
        }

        // Validar nós
        if (isset($definition['nodes'])) {
            $nodeErrors = $this->validateNodes($definition['nodes']);
            $errors = array_merge($errors, $nodeErrors);
        }

        // Validar arestas
        if (isset($definition['edges'])) {
            $edgeErrors = $this->validateEdges($definition['edges'], $definition['nodes'] ?? []);
            $errors = array_merge($errors, $edgeErrors);
        }

        // Validar conectividade
        if (isset($definition['nodes']) && isset($definition['edges'])) {
            $connectivityErrors = $this->validateConnectivity($definition['nodes'], $definition['edges']);
            $errors = array_merge($errors, $connectivityErrors);
        }

        return $errors;
    }

    /**
     * Validar nós do workflow
     */
    private function validateNodes(array $nodes): array
    {
        $errors = [];
        $nodeIds = [];

        foreach ($nodes as $index => $node) {
            // Validar ID do nó
            if (!isset($node['id']) || empty($node['id'])) {
                $errors[] = "Node at index {$index} must have an ID";
                continue;
            }

            $nodeId = $node['id'];
            if (in_array($nodeId, $nodeIds)) {
                $errors[] = "Duplicate node ID: {$nodeId}";
            }
            $nodeIds[] = $nodeId;

            // Validar tipo do nó
            if (!isset($node['type']) || empty($node['type'])) {
                $errors[] = "Node {$nodeId} must have a type";
            } else {
                $typeErrors = $this->validateNodeType($node);
                $errors = array_merge($errors, $typeErrors);
            }

            // Validar dados do nó
            if (isset($node['data'])) {
                $dataErrors = $this->validateNodeData($node);
                $errors = array_merge($errors, $dataErrors);
            }
        }

        return $errors;
    }

    /**
     * Validar tipo do nó
     */
    private function validateNodeType(array $node): array
    {
        $errors = [];
        $nodeId = $node['id'];
        $type = $node['type'];

        $validTypes = [
            'trigger', 'start', 'end', 'action', 'condition', 'delay',
            'webhook', 'ai_generate', 'social_publish', 'email_send',
            'data_transform', 'api_call', 'custom', 'zapier_webhook',
            'google_sheets', 'lead_field', 'ads_campaign', 'if_else',
            'loop', 'upload', 'media_processing', 'aura_flow', 'analytics',
            'workflow_trigger'
        ];

        if (!in_array($type, $validTypes)) {
            $errors[] = "Node {$nodeId} has invalid type: {$type}";
        }

        return $errors;
    }

    /**
     * Validar dados do nó
     */
    private function validateNodeData(array $node): array
    {
        $errors = [];
        $nodeId = $node['id'];
        $type = $node['type'];
        $data = $node['data'] ?? [];

        switch ($type) {
            case 'webhook':
                if (!isset($data['url']) || empty($data['url'])) {
                    $errors[] = "Webhook node {$nodeId} must have a URL";
                }
                break;
            case 'ai_generate':
                if (!isset($data['prompt']) || empty($data['prompt'])) {
                    $errors[] = "AI Generate node {$nodeId} must have a prompt";
                }
                break;
            case 'social_publish':
                if (!isset($data['platform']) || empty($data['platform'])) {
                    $errors[] = "Social Publish node {$nodeId} must have a platform";
                }
                break;
            case 'email_send':
                if (!isset($data['to']) || empty($data['to'])) {
                    $errors[] = "Email Send node {$nodeId} must have a recipient";
                }
                break;
            case 'condition':
                if (!isset($data['field']) || empty($data['field'])) {
                    $errors[] = "Condition node {$nodeId} must have a field";
                }
                if (!isset($data['operator']) || empty($data['operator'])) {
                    $errors[] = "Condition node {$nodeId} must have an operator";
                }
                break;
            case 'delay':
                if (!isset($data['delay']) || !is_numeric($data['delay'])) {
                    $errors[] = "Delay node {$nodeId} must have a numeric delay value";
                }
                break;
        }

        return $errors;
    }

    /**
     * Validar arestas do workflow
     */
    private function validateEdges(array $edges, array $nodes): array
    {
        $errors = [];
        $nodeIds = array_column($nodes, 'id');

        foreach ($edges as $index => $edge) {
            // Validar estrutura da aresta
            if (!isset($edge['source']) || !isset($edge['target'])) {
                $errors[] = "Edge at index {$index} must have source and target";
                continue;
            }

            $source = $edge['source'];
            $target = $edge['target'];

            // Validar se os nós existem
            if (!in_array($source, $nodeIds)) {
                $errors[] = "Edge source node '{$source}' does not exist";
            }

            if (!in_array($target, $nodeIds)) {
                $errors[] = "Edge target node '{$target}' does not exist";
            }

            // Validar se não é uma aresta para si mesmo
            if ($source === $target) {
                $errors[] = "Edge cannot connect node '{$source}' to itself";
            }
        }

        return $errors;
    }

    /**
     * Validar conectividade do workflow
     */
    private function validateConnectivity(array $nodes, array $edges): array
    {
        $errors = [];
        $nodeIds = array_column($nodes, 'id');

        // Encontrar nós de início
        $startNodes = array_filter($nodes, function ($node) {
            return ($node['type'] ?? '') === 'trigger' ||
                   ($node['type'] ?? '') === 'start' ||
                   ($node['data']['isStart'] ?? false) === true;
        });

        if (empty($startNodes)) {
            $errors[] = 'Workflow must have at least one start node';
        }

        // Verificar se todos os nós são alcançáveis
        $reachableNodes = [];
        foreach ($startNodes as $startNode) {
            $reachable = $this->findReachableNodes($startNode['id'], $edges);
            $reachableNodes = array_merge($reachableNodes, $reachable);
        }

        $unreachableNodes = array_diff($nodeIds, array_unique($reachableNodes));
        if (!empty($unreachableNodes)) {
            $errors[] = 'Unreachable nodes: ' . implode(', ', $unreachableNodes);
        }

        return $errors;
    }

    /**
     * Encontrar nós alcançáveis a partir de um nó
     */
    private function findReachableNodes(string $startNodeId, array $edges): array
    {
        $reachable = [$startNodeId];
        $queue = [$startNodeId];
        $visited = [];

        while (!empty($queue)) {
            $current = array_shift($queue);

            if (in_array($current, $visited)) {
                continue;
            }
            $visited[] = $current;

            foreach ($edges as $edge) {
                if (($edge['source'] ?? '') === $current) {
                    $target = $edge['target'] ?? '';
                    if (!in_array($target, $reachable)) {
                        $reachable[] = $target;
                        $queue[] = $target;
                    }
                }
            }
        }

        return $reachable;
    }

    /**
     * Validar payload
     */
    private function validatePayload(array $payload, array $definition): array
    {
        $errors = [];

        // Validar se payload é um array
        if (!is_array($payload)) {
            $errors[] = 'Payload must be an array';
        }

        // Validar campos obrigatórios baseados na definição
        if (isset($definition['required_fields'])) {
            foreach ($definition['required_fields'] as $field) {
                if (!isset($payload[$field])) {
                    $errors[] = "Required field '{$field}' is missing from payload";
                }
            }
        }

        return $errors;
    }

    /**
     * Validar opções
     */
    private function validateOptions(array $options): array
    {
        $errors = [];

        // Validar user_id se fornecido
        if (isset($options['user_id']) && (!is_int($options['user_id']) || $options['user_id'] <= 0)) {
            $errors[] = 'User ID must be a positive integer';
        }

        // Validar timeout se fornecido
        if (isset($options['timeout']) && (!is_int($options['timeout']) || $options['timeout'] <= 0)) {
            $errors[] = 'Timeout must be a positive integer';
        }

        // Validar retry_count se fornecido
        if (isset($options['retry_count']) && (!is_int($options['retry_count']) || $options['retry_count'] < 0)) {
            $errors[] = 'Retry count must be a non-negative integer';
        }

        return $errors;
    }

    /**
     * Validar permissões do usuário
     */
    private function validateUserPermissions(int $workflowId, int $userId): array
    {
        $errors = [];

        // Verificar se o usuário tem permissão para executar o workflow
        $workflow = $this->workflows->find($workflowId);
        if ($workflow && $workflow->user_id !== $userId) {
            // Verificar se o usuário tem permissão de execução
            // Implementar lógica de permissões aqui
        }

        return $errors;
    }
}
