<?php

namespace App\Domains\Workflows\Executors;

use App\Domains\Leads\Services\LeadService;
use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Exceptions\WorkflowExecutionException;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Leads\Models\Lead;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use Illuminate\Support\Facades\Log;

class CreateLeadNodeExecutor implements WorkflowNodeExecutor
{
    protected LeadService $leadService;

    public function __construct(LeadService $leadService)
    {
        $this->leadService = $leadService;
    }

    /**
     * Execute the action of the workflow node.
     *
     * @param WorkflowNodeModel        $node    the node to be executed
     * @param Lead                     $lead    the lead being processed
     * @param WorkflowExecutionContext $context the execution context
     *
     * @return array<string, mixed> the result of the execution, which can be used by subsequent nodes
     *
     * @throws WorkflowExecutionException se a configuração for inválida ou a criação falhar
     */
    public function execute(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): array
    {
        Log::info("Executando CreateLeadNodeExecutor para node {$node->id}.");

        $config = $this->extractConfig($node);
        $this->validateConfig($config);

        try {
            $payload = $this->buildPayload($lead, $context);
            $leadData = $this->prepareLeadData($config, $payload, $lead);

            // Verificar duplicata se habilitado
            if ($config['check_duplicate']) {
                $duplicate = $this->checkDuplicate($leadData['email'] ?? '', $leadData['phone'] ?? null);
                if ($duplicate) {
                    Log::info("Lead duplicado encontrado, usando existente", [
                        'existing_lead_id' => $duplicate->id,
                        'email' => $leadData['email']
                    ]);
                    
                    $payload[$config['outputField']] = $duplicate->toArray();
                    $payload['lead_created'] = false;
                    $payload['lead_duplicate'] = true;
                    $context->setData($config['outputField'], $duplicate->toArray());
                    
                    return $context->getData();
                }
            }

            // Enriquecer dados se habilitado
            if ($config['enrich_data']) {
                $leadData = $this->enrichLeadData($leadData);
            }

            // Criar novo lead
            $newLead = $this->leadService->createLead($leadData);
            
            $payload[$config['outputField']] = $newLead->toArray();
            $payload['lead_created'] = true;
            $payload['lead_duplicate'] = false;
            
            $context->setData($config['outputField'], $newLead->toArray());
            $context->setData('created_lead_id', $newLead->id);
            
            Log::info("Lead criado com sucesso e adicionado ao payload no campo '{$config['outputField']}'.", [
                'lead_id' => $newLead->id,
                'email' => $newLead->email
            ]);
        } catch (\Exception $e) {
            Log::error("Falha ao criar Lead: " . $e->getMessage(), [
                'config' => $config,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw new WorkflowExecutionException("Falha na criação do Lead: " . $e->getMessage());
        }

        return $context->getData();
    }

    /**
     * Extrai a configuração do nó.
     */
    private function extractConfig(WorkflowNodeModel $node): array
    {
        $config = $node->configuration ?? [];
        
        return [
            'name' => $config['name'] ?? null,
            'email' => $config['email'] ?? null,
            'phone' => $config['phone'] ?? null,
            'company' => $config['company'] ?? null,
            'position' => $config['position'] ?? null,
            'website' => $config['website'] ?? null,
            'source' => $config['source'] ?? 'workflow',
            'status' => $config['status'] ?? 'new',
            'score' => $config['score'] ?? null,
            'value' => $config['value'] ?? null,
            'notes' => $config['notes'] ?? null,
            'check_duplicate' => $config['check_duplicate'] ?? true,
            'enrich_data' => $config['enrich_data'] ?? false,
            'outputField' => $config['output_field'] ?? 'created_lead'
        ];
    }

    /**
     * Valida a configuração.
     */
    private function validateConfig(array $config): void
    {
        // Pelo menos um método de contato é obrigatório
        if (!$config['name'] || (!$config['email'] && !$config['phone'])) {
            throw new WorkflowExecutionException("Nó de criação de Lead inválido: 'name' e pelo menos um de 'email' ou 'phone' são obrigatórios.");
        }

        // Validar email se fornecido
        if ($config['email'] && !filter_var($config['email'], FILTER_VALIDATE_EMAIL)) {
            throw new WorkflowExecutionException("Email inválido fornecido: {$config['email']}");
        }
    }

    /**
     * Constrói o payload para substituição.
     */
    private function buildPayload(Lead $lead, WorkflowExecutionContext $context): array
    {
        return [
            'current_lead_name' => $lead->name ?? '',
            'current_lead_email' => $lead->email ?? '',
            'current_lead_phone' => $lead->phone ?? '',
            'current_lead_company' => $lead->company ?? '',
            'workflow_id' => $context->getData()['workflow_id'] ?? null,
            'execution_id' => $context->getData()['execution_id'] ?? null,
            ...$context->getData()
        ];
    }

    /**
     * Prepara os dados do lead.
     */
    private function prepareLeadData(array $config, array $payload, Lead $lead): array
    {
        $leadData = [
            'name' => $this->replacePlaceholder($config['name'], $payload),
            'email' => $this->replacePlaceholder($config['email'], $payload),
            'phone' => $this->replacePlaceholder($config['phone'], $payload),
            'company' => $this->replacePlaceholder($config['company'], $payload),
            'position' => $this->replacePlaceholder($config['position'], $payload),
            'website' => $this->replacePlaceholder($config['website'], $payload),
            'source' => $this->replacePlaceholder($config['source'], $payload),
            'status' => $this->replacePlaceholder($config['status'], $payload) ?? 'new',
            'notes' => $this->replacePlaceholder($config['notes'], $payload),
            'project_id' => $lead->project_id ?? session('selected_project_id'),
        ];

        // Adicionar score e value se fornecidos
        if ($config['score'] !== null) {
            $score = $this->replacePlaceholder($config['score'], $payload);
            $leadData['score'] = is_numeric($score) ? (int) $score : null;
        }

        if ($config['value'] !== null) {
            $value = $this->replacePlaceholder($config['value'], $payload);
            $leadData['value'] = is_numeric($value) ? (float) $value : null;
        }

        // Remover campos vazios
        return array_filter($leadData, fn($value) => $value !== null && $value !== '');
    }

    /**
     * Check for duplicate lead
     */
    private function checkDuplicate(string $email, ?string $phone = null): ?Lead
    {
        try {
            // Verificar por email
            if ($email) {
                $existing = $this->leadService->getLeadByEmail($email);
                if ($existing) {
                    return $existing;
                }
            }

            // Verificar por telefone se fornecido
            if ($phone) {
                // Implementar busca por telefone se necessário
                // Por enquanto, apenas email
            }

            return null;
        } catch (\Exception $e) {
            Log::warning("Erro ao verificar duplicata de lead: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Enrich lead data
     */
    private function enrichLeadData(array $leadData): array
    {
        // Placeholder para enriquecimento futuro
        // Pode integrar com serviços externos de enriquecimento de dados
        // Por enquanto, retorna dados originais
        return $leadData;
    }

    /**
     * Determine the ID of the next node to be executed.
     *
     * @param WorkflowNodeModel        $node    the current node
     * @param Lead                     $lead    the lead being processed
     * @param WorkflowExecutionContext $context the execution context, including the result of the current node's execution
     *
     * @return string|null the ID of the next node, or null if it's the end of the path
     */
    public function getNextNodeId(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): ?string
    {
        // Para nós de criação de lead, seguimos para o próximo nó configurado
        return $node->next_node_id ? (string) $node->next_node_id : null;
    }

    /**
     * Substitui um placeholder no texto com um valor do payload.
     *
     * @param string|null $text    o texto com placeholder (ex: "{{ name }}")
     * @param array<string, mixed> $payload o payload do workflow
     *
     * @return string|null o texto com placeholder substituído ou null
     */
    protected function replacePlaceholder(?string $text, array $payload): ?string
    {
        if ($text === null) {
            return null;
        }
        return preg_replace_callback('/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/', function ($matches) use ($payload) {
            $key = $matches[1];
            return $payload[$key] ?? $matches[0]; // Retorna o placeholder original se a chave não existir
        }, $text);
    }
}
