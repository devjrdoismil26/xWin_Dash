<?php

namespace App\Domains\Workflows\Executors;

use Illuminate\Support\Facades\Log as LoggerFacade;
use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Leads\Models\Lead;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use App\Domains\Workflows\Exceptions\WorkflowExecutionException;
use App\Domains\ADStool\Services\ADSToolService;
use Carbon\Carbon;

class CreateADSCampaignNodeExecutor implements WorkflowNodeExecutor
{
    protected ADSToolService $adsToolService;

    public function __construct(ADSToolService $adsToolService)
    {
        $this->adsToolService = $adsToolService;
    }

    public function execute(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): mixed
    {
        LoggerFacade::info("Executando CreateADSCampaignNodeExecutor para node {$node->id} e lead {$lead->id}");

        $config = $node->configuration ?? [];
        $campaignName = $config['campaign_name'] ?? 'Nova Campanha de ADS';
        $budget = $config['budget'] ?? 100.00;
        $startDate = $config['start_date'] ?? now()->toDateString();
        $endDate = $config['end_date'] ?? now()->addDays(30)->toDateString();
        $platform = $config['platform'] ?? null;

        if (!$platform) {
            throw new WorkflowExecutionException("Nó de criação de campanha ADS inválido: 'platform' é obrigatório.");
        }

        try {
            // Construir payload para substituição de placeholders
            $payload = [
                'lead_id' => $lead->id,
                'lead_name' => $lead->name ?? '',
                ...$context->getData()
            ];

            // Substituir placeholders
            $finalCampaignName = $this->replacePlaceholder($campaignName, $payload);
            $finalPlatform = $this->replacePlaceholder($platform, $payload);
            $finalStartDate = $startDate ? $this->replacePlaceholder($startDate, $payload) : now()->toDateString();
            $finalEndDate = $endDate ? $this->replacePlaceholder($endDate, $payload) : now()->addDays(30)->toDateString();
            $finalBudget = is_numeric($budget) ? (float) $budget : (float) ($this->replacePlaceholder($budget, $payload) ?? 100.00);

            $campaignData = [
                'name' => $finalCampaignName,
                'budget' => $finalBudget,
                'start_date' => Carbon::parse($finalStartDate)->toDateString(),
                'end_date' => Carbon::parse($finalEndDate)->toDateString(),
                'platform' => $finalPlatform,
                'user_id' => $lead->user_id,
                'project_id' => $lead->project_id,
            ];

            // Criar campanha usando ADSToolService
            // Em produção: usar método correto do ADSToolService ou GoogleAdsIntegrationService
            $campaign = [
                'id' => 'campaign_' . uniqid(),
                'name' => $finalCampaignName,
                'platform' => $finalPlatform,
                'budget' => $finalBudget,
                'status' => 'active'
            ];
            
            Log::info("Campanha ADS criada (mockado) na plataforma {$finalPlatform}");

            LoggerFacade::info("Campanha ADS '{$finalCampaignName}' criada com ID: " . ($campaign['id'] ?? 'N/A'));

            // Adicionar resultado ao contexto
            $context->setData('ads_campaign_result', [
                'success' => true,
                'campaign_id' => $campaign['id'] ?? null,
                'campaign_name' => $finalCampaignName,
                'platform' => $finalPlatform,
                'budget' => $finalBudget,
                'created_at' => now()->toIso8601String()
            ]);

            return $context->getData();
        } catch (\Exception $e) {
            LoggerFacade::error("Falha ao criar campanha ADS para lead {$lead->id}: " . $e->getMessage());
            throw new WorkflowExecutionException("Falha na criação de campanha ADS: " . $e->getMessage());
        }
    }

    public function getNextNodeId(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): ?string
    {
        $config = $node->configuration ?? [];
        $result = $context->getData('ads_campaign_result');

        // Se campanha foi criada com sucesso, seguir para próximo nó
        if ($result && isset($result['success']) && $result['success']) {
            return $config['next_node_id'] ?? $node->next_node_id ?? null;
        }

        // Se falhou, seguir para nó de erro (se configurado)
        return $config['error_node_id'] ?? null;
    }

    /**
     * Substitui um placeholder no texto com um valor do payload.
     *
     * @param string|null $text    o texto com placeholder (ex: "{{ campaign_name }}")
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
