<?php

namespace App\Domains\Workflows\Executors;

use App\Domains\Leads\Services\LeadService;
use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Exceptions\WorkflowExecutionException;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Leads\Models\Lead;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use Illuminate\Support\Facades\Log;

class UpdateLeadNodeExecutor implements WorkflowNodeExecutor
{
    protected LeadService $leadService;

    public function __construct(LeadService $leadService)
    {
        $this->leadService = $leadService;
    }

    /**
     * Executa o nó de atualização de Lead.
     *
     * @param WorkflowNodeModel        $node    the node to be executed
     * @param Lead                     $lead    the lead being processed
     * @param WorkflowExecutionContext $context the execution context
     *
     * @return array<string, mixed> o payload atualizado após a atualização do Lead
     *
     * @throws WorkflowExecutionException se a configuração for inválida ou a atualização falhar
     */
    public function execute(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): mixed
    {
        Log::info("Executando UpdateLeadNodeExecutor para node {$node->id}.");

        $config = $node->configuration ?? [];
        $updates = $config['updates'] ?? []; // Array de campos a serem atualizados
        $leadId = $config['lead_id'] ?? $lead->id; // Permite atualizar outro lead
        $validateFields = $config['validate_fields'] ?? true;
        $trackHistory = $config['track_history'] ?? true;

        if (empty($updates)) {
            Log::warning("Nó de atualização de Lead: Nenhuma atualização especificada para o Lead ID: {$leadId}.");
            return $context->getData();
        }

        try {
            // Construir payload completo para substituição de placeholders
            $payload = [
                'lead_name' => $lead->name ?? '',
                'lead_email' => $lead->email ?? '',
                'lead_phone' => $lead->phone ?? '',
                'lead_company' => $lead->company ?? '',
                'lead_id' => $lead->id,
                'target_lead_id' => $leadId,
                ...$context->getData()
            ];

            // Substituir placeholders nos valores de atualização com valores do payload
            $finalUpdates = $this->replacePlaceholdersInArray($updates, $payload);

            // Validar campos atualizáveis se habilitado
            if ($validateFields) {
                $this->validateUpdateFields($finalUpdates);
            }

            // Buscar lead a ser atualizado (pode ser diferente do lead atual)
            $targetLead = ($leadId == $lead->id) ? $lead : $this->leadService->getLeadById($leadId);
            
            if (!$targetLead) {
                throw new WorkflowExecutionException("Lead ID: {$leadId} não encontrado para atualização.");
            }

            // Salvar estado anterior para histórico
            $previousState = $trackHistory ? $targetLead->toArray() : null;

            // Atualizar lead
            $updatedLead = $this->leadService->updateLead($leadId, $finalUpdates);
            
            // Registrar no contexto
            $context->setData('updated_lead', $updatedLead->toArray());
            $context->setData('updated_lead_id', $leadId);
            $context->setData('update_fields', array_keys($finalUpdates));
            
            if ($trackHistory && $previousState) {
                $context->setData('lead_previous_state', $previousState);
                $context->setData('lead_changes', $this->calculateChanges($previousState, $updatedLead->toArray()));
            }

            Log::info("Lead ID: {$leadId} atualizado com sucesso.", [
                'updated_fields' => array_keys($finalUpdates),
                'updated_by_workflow' => true
            ]);
        } catch (\Exception $e) {
            Log::error("Falha ao atualizar Lead ID: {$leadId}: " . $e->getMessage(), [
                'updates' => $updates,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw new WorkflowExecutionException("Falha na atualização do Lead: " . $e->getMessage());
        }

        return $context->getData();
    }

    /**
     * Substitui placeholders em um array com valores do payload.
     *
     * @param array<string, mixed> $array   o array com placeholders
     * @param array<string, mixed> $payload o payload do workflow
     *
     * @return array<string, mixed> o array com placeholders substituídos
     */
    protected function replacePlaceholdersInArray(array $array, array $payload): array
    {
        $newArray = [];
        foreach ($array as $key => $value) {
            if (is_string($value)) {
                $newArray[$key] = preg_replace_callback('/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/', function ($matches) use ($payload) {
                    $k = $matches[1];
                    return $payload[$k] ?? $matches[0];
                }, $value);
            } elseif (is_array($value)) {
                $newArray[$key] = $this->replacePlaceholdersInArray($value, $payload);
            } else {
                $newArray[$key] = $value;
            }
        }
        return $newArray;
    }

    /**
     * Validate update fields
     */
    protected function validateUpdateFields(array $updates): void
    {
        $allowedFields = [
            'name', 'email', 'phone', 'company', 'position', 'website',
            'status', 'score', 'value', 'notes', 'source',
            'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'
        ];

        $invalidFields = array_diff(array_keys($updates), $allowedFields);
        
        if (!empty($invalidFields)) {
            Log::warning("Campos não permitidos para atualização: " . implode(', ', $invalidFields));
            // Não bloquear, apenas logar warning
        }
    }

    /**
     * Calculate changes between previous and current state
     */
    protected function calculateChanges(array $previous, array $current): array
    {
        $changes = [];
        
        foreach ($current as $key => $value) {
            if (isset($previous[$key]) && $previous[$key] != $value) {
                $changes[$key] = [
                    'from' => $previous[$key],
                    'to' => $value
                ];
            }
        }
        
        return $changes;
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
        return $node->next_node_id ? (string) $node->next_node_id : null;
    }
}
