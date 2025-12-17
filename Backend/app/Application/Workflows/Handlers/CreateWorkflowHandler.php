<?php

namespace App\Application\Workflows\Handlers;

use App\Application\Workflows\Commands\CreateWorkflowCommand;
use App\Application\Workflows\UseCases\CreateWorkflowUseCase;
use App\Shared\Exceptions\BusinessRuleException;
use App\Shared\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

/**
 * Handler para o comando CreateWorkflowCommand
 * Implementa validações de workflow e orquestração
 */
class CreateWorkflowHandler
{
    private CreateWorkflowUseCase $createWorkflowUseCase;
    private CrossModuleValidationService $validationService;

    public function __construct(
        CreateWorkflowUseCase $createWorkflowUseCase,
        CrossModuleValidationService $validationService
    ) {
        $this->createWorkflowUseCase = $createWorkflowUseCase;
        $this->validationService = $validationService;
    }

    /**
     * Manipula o comando de criação de workflow
     *
     * @param CreateWorkflowCommand $command
     * @return array
     * @throws BusinessRuleException
     */
    public function handle(CreateWorkflowCommand $command): array
    {
        try {
            DB::beginTransaction();

            // 1. Validações de negócio
            $this->validateBusinessRules($command);

            // 2. Validar estrutura do workflow
            $this->validateWorkflowStructure($command);

            // 3. Verificar permissões
            $this->validatePermissions($command);

            // 4. Aplicar regras de negócio
            $this->applyBusinessRules($command);

            // 5. Executar caso de uso
            $workflow = $this->createWorkflowUseCase->execute($command);

            // 6. Pós-processamento
            $this->postProcessWorkflow($workflow, $command);

            DB::commit();

            Log::info("Workflow criado com sucesso via Handler", [
                'workflow_id' => $workflow->id,
                'name' => $command->name,
                'user_id' => $command->userId
            ]);

            return [
                'success' => true,
                'workflow' => $workflow,
                'message' => 'Workflow criado com sucesso'
            ];

        } catch (BusinessRuleException $e) {
            DB::rollBack();
            Log::warning("Falha na criação de workflow - Regra de negócio", [
                'name' => $command->name,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);
            throw $e;

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Erro inesperado na criação de workflow", [
                'name' => $command->name,
                'user_id' => $command->userId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw new BusinessRuleException("Erro interno na criação de workflow: " . $e->getMessage());
        }
    }

    /**
     * Valida regras de negócio básicas
     */
    private function validateBusinessRules(CreateWorkflowCommand $command): void
    {
        // Validar nome
        if (empty($command->name) || strlen($command->name) < 3) {
            throw BusinessRuleException::operationNotAllowed(
                'create_workflow',
                'Nome deve ter pelo menos 3 caracteres'
            );
        }

        if (strlen($command->name) > 100) {
            throw BusinessRuleException::operationNotAllowed(
                'create_workflow',
                'Nome não pode ter mais de 100 caracteres'
            );
        }

        // Validar descrição
        if ($command->description && strlen($command->description) > 500) {
            throw BusinessRuleException::operationNotAllowed(
                'create_workflow',
                'Descrição não pode ter mais de 500 caracteres'
            );
        }

        // Validar usuário
        if (!$command->userId) {
            throw BusinessRuleException::operationNotAllowed(
                'create_workflow',
                'ID do usuário é obrigatório'
            );
        }

        // Verificar se usuário existe
        $user = $this->validationService->findUserById($command->userId);
        if (!$user) {
            throw BusinessRuleException::operationNotAllowed(
                'create_workflow',
                'Usuário não encontrado'
            );
        }

        // Verificar limite de workflows por usuário
        $userWorkflowCount = $this->validationService->getUserWorkflowCount($command->userId);
        $maxWorkflows = $user->hasRole('premium') ? 50 : 10;
        
        if ($userWorkflowCount >= $maxWorkflows) {
            throw BusinessRuleException::resourceLimit(
                'workflows',
                $maxWorkflows
            );
        }
    }

    /**
     * Valida a estrutura do workflow
     */
    private function validateWorkflowStructure(CreateWorkflowCommand $command): void
    {
        if (!$command->structure || !is_array($command->structure)) {
            throw BusinessRuleException::operationNotAllowed(
                'create_workflow',
                'Estrutura do workflow é obrigatória'
            );
        }

        // Validar nós obrigatórios
        if (!isset($command->structure['nodes']) || !is_array($command->structure['nodes'])) {
            throw BusinessRuleException::operationNotAllowed(
                'create_workflow',
                'Workflow deve ter pelo menos um nó'
            );
        }

        if (empty($command->structure['nodes'])) {
            throw BusinessRuleException::operationNotAllowed(
                'create_workflow',
                'Workflow deve ter pelo menos um nó'
            );
        }

        // Validar arestas
        if (!isset($command->structure['edges']) || !is_array($command->structure['edges'])) {
            $command->structure['edges'] = [];
        }

        // Validar cada nó
        $this->validateNodes($command->structure['nodes']);

        // Validar cada aresta
        $this->validateEdges($command->structure['edges'], $command->structure['nodes']);

        // Validar conectividade
        $this->validateConnectivity($command->structure);
    }

    /**
     * Valida os nós do workflow
     */
    private function validateNodes(array $nodes): void
    {
        $nodeIds = [];
        $startNodes = 0;

        foreach ($nodes as $node) {
            // Validar estrutura do nó
            if (!isset($node['id']) || !isset($node['type'])) {
                throw BusinessRuleException::operationNotAllowed(
                    'create_workflow',
                    'Cada nó deve ter ID e tipo'
                );
            }

            // Verificar IDs únicos
            if (in_array($node['id'], $nodeIds)) {
                throw BusinessRuleException::operationNotAllowed(
                    'create_workflow',
                    'IDs de nós devem ser únicos'
                );
            }
            $nodeIds[] = $node['id'];

            // Validar tipo do nó
            $validTypes = [
                'start', 'end', 'condition', 'action', 'delay', 
                'email', 'webhook', 'database', 'api_call'
            ];
            if (!in_array($node['type'], $validTypes)) {
                throw BusinessRuleException::operationNotAllowed(
                    'create_workflow',
                    "Tipo de nó inválido: {$node['type']}"
                );
            }

            // Contar nós de início
            if ($node['type'] === 'start') {
                $startNodes++;
            }

            // Validar configurações específicas por tipo
            $this->validateNodeConfiguration($node);
        }

        // Deve ter exatamente um nó de início
        if ($startNodes !== 1) {
            throw BusinessRuleException::operationNotAllowed(
                'create_workflow',
                'Workflow deve ter exatamente um nó de início'
            );
        }
    }

    /**
     * Valida configuração específica de um nó
     */
    private function validateNodeConfiguration(array $node): void
    {
        switch ($node['type']) {
            case 'email':
                if (!isset($node['data']['template_id']) && !isset($node['data']['subject'])) {
                    throw BusinessRuleException::operationNotAllowed(
                        'create_workflow',
                        'Nó de email deve ter template ou assunto'
                    );
                }
                break;

            case 'webhook':
                if (!isset($node['data']['url']) || !filter_var($node['data']['url'], FILTER_VALIDATE_URL)) {
                    throw BusinessRuleException::operationNotAllowed(
                        'create_workflow',
                        'Nó de webhook deve ter URL válida'
                    );
                }
                break;

            case 'delay':
                if (!isset($node['data']['duration']) || $node['data']['duration'] <= 0) {
                    throw BusinessRuleException::operationNotAllowed(
                        'create_workflow',
                        'Nó de delay deve ter duração válida'
                    );
                }
                break;
        }
    }

    /**
     * Valida as arestas do workflow
     */
    private function validateEdges(array $edges, array $nodes): void
    {
        $nodeIds = array_column($nodes, 'id');

        foreach ($edges as $edge) {
            if (!isset($edge['source']) || !isset($edge['target'])) {
                throw BusinessRuleException::operationNotAllowed(
                    'create_workflow',
                    'Cada aresta deve ter origem e destino'
                );
            }

            if (!in_array($edge['source'], $nodeIds)) {
                throw BusinessRuleException::operationNotAllowed(
                    'create_workflow',
                    "Nó de origem não encontrado: {$edge['source']}"
                );
            }

            if (!in_array($edge['target'], $nodeIds)) {
                throw BusinessRuleException::operationNotAllowed(
                    'create_workflow',
                    "Nó de destino não encontrado: {$edge['target']}"
                );
            }

            if ($edge['source'] === $edge['target']) {
                throw BusinessRuleException::operationNotAllowed(
                    'create_workflow',
                    'Nó não pode conectar a si mesmo'
                );
            }
        }
    }

    /**
     * Valida conectividade do workflow
     */
    private function validateConnectivity(array $structure): void
    {
        $nodes = $structure['nodes'];
        $edges = $structure['edges'];

        // Encontrar nó de início
        $startNode = null;
        foreach ($nodes as $node) {
            if ($node['type'] === 'start') {
                $startNode = $node;
                break;
            }
        }

        if (!$startNode) {
            throw BusinessRuleException::operationNotAllowed(
                'create_workflow',
                'Workflow deve ter um nó de início'
            );
        }

        // Verificar se todos os nós são alcançáveis
        $reachableNodes = $this->getReachableNodes($startNode['id'], $edges, $nodes);
        if (count($reachableNodes) !== count($nodes)) {
            throw BusinessRuleException::operationNotAllowed(
                'create_workflow',
                'Todos os nós devem ser alcançáveis a partir do nó de início'
            );
        }
    }

    /**
     * Encontra nós alcançáveis a partir de um nó
     */
    private function getReachableNodes(string $startNodeId, array $edges, array $nodes): array
    {
        $visited = [];
        $queue = [$startNodeId];

        while (!empty($queue)) {
            $current = array_shift($queue);
            if (in_array($current, $visited)) {
                continue;
            }
            $visited[] = $current;

            // Encontrar nós conectados
            foreach ($edges as $edge) {
                if ($edge['source'] === $current && !in_array($edge['target'], $visited)) {
                    $queue[] = $edge['target'];
                }
            }
        }

        return $visited;
    }

    /**
     * Valida permissões do usuário
     */
    private function validatePermissions(CreateWorkflowCommand $command): void
    {
        $user = auth()->user();
        if (!$user) {
            throw BusinessRuleException::operationNotAllowed(
                'create_workflow',
                'Usuário não autenticado'
            );
        }

        // Verificar se o usuário pode criar workflows
        if (!$user->hasPermission('workflows.create')) {
            throw BusinessRuleException::operationNotAllowed(
                'create_workflow',
                'Usuário não tem permissão para criar workflows'
            );
        }

        // Verificar se está criando para si mesmo ou se é admin
        if ($command->userId !== $user->id && !$user->hasRole('admin')) {
            throw BusinessRuleException::operationNotAllowed(
                'create_workflow',
                'Usuário só pode criar workflows para si mesmo'
            );
        }
    }

    /**
     * Aplica regras de negócio
     */
    private function applyBusinessRules(CreateWorkflowCommand $command): void
    {
        // Normalizar nome
        $command->name = trim($command->name);

        // Adicionar timestamp de criação
        $command->createdAt = now();

        // Definir status inicial
        $command->status = 'draft';

        // Adicionar metadados
        $command->metadata = [
            'created_by' => auth()->id(),
            'version' => '1.0.0',
            'complexity_score' => $this->calculateComplexityScore($command->structure)
        ];
    }

    /**
     * Pós-processamento do workflow criado
     */
    private function postProcessWorkflow($workflow, CreateWorkflowCommand $command): void
    {
        // Registrar atividade
        $this->validationService->recordWorkflowActivity($workflow->id, [
            'type' => 'workflow_created',
            'description' => "Workflow '{$command->name}' criado",
            'metadata' => [
                'nodes_count' => count($command->structure['nodes']),
                'edges_count' => count($command->structure['edges']),
                'complexity_score' => $command->metadata['complexity_score']
            ]
        ]);

        // Aplicar templates padrão se necessário
        $this->validationService->applyDefaultWorkflowTemplates($workflow);

        // Notificar administradores se workflow complexo
        if ($command->metadata['complexity_score'] > 50) {
            $this->validationService->notifyComplexWorkflowCreated($workflow);
        }
    }

    /**
     * Calcula score de complexidade do workflow
     */
    private function calculateComplexityScore(array $structure): int
    {
        $score = 0;
        
        // Pontos por nó
        $score += count($structure['nodes']) * 2;
        
        // Pontos por aresta
        $score += count($structure['edges']) * 1;
        
        // Pontos por tipos complexos
        foreach ($structure['nodes'] as $node) {
            if (in_array($node['type'], ['condition', 'api_call', 'webhook'])) {
                $score += 5;
            }
        }
        
        return $score;
    }
}