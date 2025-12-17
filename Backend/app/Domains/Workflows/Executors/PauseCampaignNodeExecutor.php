<?php

namespace App\Domains\Workflows\Executors;

use App\Domains\ADStool\Services\GoogleAdsIntegrationService;
use App\Domains\EmailMarketing\Services\EmailCampaignService;
use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Exceptions\WorkflowExecutionException;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Leads\Models\Lead;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use Illuminate\Support\Facades\Log;

class PauseCampaignNodeExecutor implements WorkflowNodeExecutor
{
    protected EmailCampaignService $emailCampaignService;
    protected GoogleAdsIntegrationService $adsCampaignService;

    public function __construct(
        EmailCampaignService $emailCampaignService,
        GoogleAdsIntegrationService $adsCampaignService
    ) {
        $this->emailCampaignService = $emailCampaignService;
        $this->adsCampaignService = $adsCampaignService;
    }

    /**
     * Execute the action of the workflow node.
     *
     * @param WorkflowNodeModel        $node    the node to be executed
     * @param Lead                     $lead    the lead being processed
     * @param WorkflowExecutionContext $context the execution context
     *
     * @return array<string, mixed> o payload atualizado após a pausa da campanha
     *
     * @throws WorkflowExecutionException se a configuração for inválida ou a pausa falhar
     */
    public function execute(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): array
    {
        Log::info("Executando PauseCampaignNodeExecutor para node {$node->id}.");

        $config = $node->configuration ?? [];
        $campaignType = $config['campaign_type'] ?? null; // 'email' ou 'ads'
        $campaignId = $config['campaign_id'] ?? null;

        if (!$campaignType || !$campaignId) {
            throw new WorkflowExecutionException("Nó de pausa de campanha inválido: 'campaign_type' e 'campaign_id' são obrigatórios.");
        }

        try {
            // Construir payload para substituição de placeholders
            $payload = [
                'lead_id' => $lead->id,
                'lead_name' => $lead->name ?? '',
                ...$context->getData()
            ];

            // Substituir placeholders com valores do contexto
            $finalCampaignId = $this->replacePlaceholder($campaignId, $payload);

            $success = false;
            switch ($campaignType) {
                case 'email':
                    $success = $this->emailCampaignService->pauseCampaign($finalCampaignId);
                    Log::info("Campanha de e-mail ID: {$finalCampaignId} pausada com sucesso.");
                    break;
                case 'ads':
                    $success = $this->adsCampaignService->pauseCampaign($finalCampaignId);
                    Log::info("Campanha de anúncios ID: {$finalCampaignId} pausada com sucesso.");
                    break;
                default:
                    throw new WorkflowExecutionException("Tipo de campanha desconhecido para pausa: {$campaignType}.");
            }

            if (!$success) {
                throw new WorkflowExecutionException("Falha ao pausar campanha ID: {$finalCampaignId}.");
            }

            // Adicionar resultado ao contexto
            $context->setData('campaign_pause_result', [
                'success' => true,
                'campaign_type' => $campaignType,
                'campaign_id' => $finalCampaignId,
                'status' => 'paused',
                'paused_at' => now()->toIso8601String()
            ]);

            return $context->getData();
        } catch (\Exception $e) {
            Log::error("Falha ao pausar campanha ID: {$campaignId} do tipo {$campaignType}: " . $e->getMessage());
            throw new WorkflowExecutionException("Falha ao pausar campanha: " . $e->getMessage());
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
        $config = $node->configuration ?? [];
        $result = $context->getData('campaign_pause_result');

        // Se pausa foi bem-sucedida, seguir para próximo nó
        if ($result && isset($result['success']) && $result['success']) {
            return $config['next_node_id'] ?? $node->next_node_id ?? null;
        }

        // Se falhou, seguir para nó de erro (se configurado)
        return $config['error_node_id'] ?? null;
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
            return $payload[$key] ?? $matches[0];
        }, $text);
    }
}
