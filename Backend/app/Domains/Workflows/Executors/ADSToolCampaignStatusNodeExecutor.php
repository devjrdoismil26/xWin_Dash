<?php

namespace App\Domains\Workflows\Executors;

use App\Domains\ADStool\Services\CampaignService;
use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Exceptions\WorkflowExecutionException;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Leads\Models\Lead;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use Illuminate\Support\Facades\Log;

class ADSToolCampaignStatusNodeExecutor implements WorkflowNodeExecutor
{
    protected CampaignService $campaignService;

    public function __construct(CampaignService $campaignService)
    {
        $this->campaignService = $campaignService;
    }

    /**
     * Executa o nó para verificar o status de uma campanha do ADSTool.
     *
     * @param WorkflowNodeModel        $node    the node to be executed
     * @param Lead                     $lead    the lead being processed
     * @param WorkflowExecutionContext $context the execution context
     *
     * @return array<string, mixed> o payload atualizado e a indicação do próximo nó
     *
     * @throws WorkflowExecutionException se a configuração for inválida ou a verificação falhar
     */
    public function execute(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): array
    {
        Log::info("Executando ADSToolCampaignStatusNodeExecutor para node {$node->id}.");

        $config = $node->configuration ?? [];
        $campaignId = $config['campaign_id'] ?? null;
        $expectedStatus = $config['expected_status'] ?? null;
        $truePath = $config['true_path'] ?? $config['true'] ?? null;
        $falsePath = $config['false_path'] ?? $config['false'] ?? null;

        if (!$campaignId || !$expectedStatus) {
            throw new WorkflowExecutionException("Nó de status de campanha do ADSTool inválido: 'campaign_id' e 'expected_status' são obrigatórios.");
        }

        try {
            // Construir payload para substituição de placeholders
            $payload = [
                'lead_id' => $lead->id ?? '',
                'lead_name' => $lead->name ?? '',
                ...$context->getData()
            ];

            // Substituir placeholders no campaign_id com valores do payload
            $finalCampaignId = $this->replacePlaceholder($campaignId, $payload);
            
            // Converter para int se necessário
            $campaignIdInt = is_numeric($finalCampaignId) ? (int) $finalCampaignId : $finalCampaignId;

            $currentCampaign = $this->campaignService->getCampaignById($campaignIdInt);

            if (!$currentCampaign) {
                throw new WorkflowExecutionException("Campanha ADSTool ID: {$finalCampaignId} não encontrada.");
            }

            $statusMatches = ($currentCampaign->status === $expectedStatus);

            // Determinar próximo nó baseado no resultado
            $nextNodeId = $statusMatches 
                ? ($truePath ?? $node->next_node_id) 
                : ($falsePath ?? null);

            Log::info("Status da campanha ADSTool ID: {$finalCampaignId} (atual: {$currentCampaign->status}) corresponde ao esperado ({$expectedStatus}): " . ($statusMatches ? 'Sim' : 'Não') . ". Próximo nó: {$nextNodeId}.");

            $context->setData('ads_campaign_status_check', [
                'campaign_id' => $finalCampaignId,
                'current_status' => $currentCampaign->status,
                'expected_status' => $expectedStatus,
                'status_matches' => $statusMatches,
            ]);

            if ($nextNodeId) {
                $context->setData('next_node_id', $nextNodeId);
            }

            return $context->getData();
        } catch (\Exception $e) {
            Log::error("Falha ao verificar status da campanha ADSTool ID: {$campaignId}: " . $e->getMessage());
            throw new WorkflowExecutionException("Falha na verificação de status da campanha ADSTool: " . $e->getMessage());
        }
    }

    /**
     * Determine the ID of the next node to be executed.
     *
     * @param WorkflowNodeModel        $node    the current node
     * @param Lead                     $lead    the lead being processed
     * @param WorkflowExecutionContext $context the execution context
     *
     * @return string|null the ID of the next node, or null if it's the end of the path
     */
    public function getNextNodeId(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): ?string
    {
        // Verificar se há um próximo nó definido no contexto (definido pelo execute)
        $nextNodeId = $context->getData()['next_node_id'] ?? null;
        
        if ($nextNodeId) {
            return (string) $nextNodeId;
        }

        // Fallback para o próximo nó padrão
        return $node->next_node_id ? (string) $node->next_node_id : null;
    }

    /**
     * Substitui um placeholder no texto com um valor do payload.
     *
     * @param string|null $text    o texto com placeholder (ex: "{{ campaign_id }}")
     * @param array       $payload o payload do workflow
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
