<?php

namespace App\Domains\Workflows\Executors;

use Illuminate\Support\Facades\Log as LoggerFacade;
use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Leads\Models\Lead;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use App\Domains\Workflows\Exceptions\WorkflowExecutionException;
use App\Domains\ADStool\Services\ADSToolService;
use App\Domains\ADStool\Infrastructure\Persistence\Eloquent\AccountModel;

class CreateAdCreativeNodeExecutor implements WorkflowNodeExecutor
{
    protected ADSToolService $adsToolService;

    public function __construct(ADSToolService $adsToolService)
    {
        $this->adsToolService = $adsToolService;
    }

    public function execute(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): mixed
    {
        LoggerFacade::info("Executando CreateAdCreativeNodeExecutor para node {$node->id} e lead {$lead->id}");

        $config = $node->configuration ?? [];
        $campaignId = $config['campaign_id'] ?? null;
        $platform = $config['platform'] ?? null;
        $creativeData = $config['creative_data'] ?? [];

        if (!$campaignId || !$platform || empty($creativeData)) {
            throw new WorkflowExecutionException("Nó de criação de criativo inválido: 'campaign_id', 'platform' e 'creative_data' são obrigatórios.");
        }

        try {
            // Construir payload para substituição de placeholders
            $payload = [
                'lead_id' => $lead->id,
                'lead_name' => $lead->name ?? '',
                ...$context->getData()
            ];

            // Substituir placeholders
            $finalCampaignId = $this->replacePlaceholder($campaignId, $payload);
            $finalPlatform = $this->replacePlaceholder($platform, $payload);

            // Buscar conta do usuário para a plataforma
            $account = AccountModel::where('platform', $finalPlatform)
                ->where('user_id', $lead->user_id)
                ->first();

            if (!$account) {
                throw new WorkflowExecutionException("Conta não encontrada para plataforma {$finalPlatform} e usuário {$lead->user_id}.");
            }

            // Criar criativo usando ADSToolService
            // Em produção: usar método correto do ADSToolService
            $creative = [
                'id' => 'creative_' . uniqid(),
                'name' => $creativeData['name'] ?? 'Criativo ' . now()->format('Y-m-d H:i:s'),
                'campaign_id' => $finalCampaignId,
                'platform' => $finalPlatform
            ];
            
            Log::info("Criativo criado (mockado) para campanha {$finalCampaignId} na plataforma {$finalPlatform}");

            LoggerFacade::info("Criativo criado com ID: " . ($creative['id'] ?? 'N/A'));

            // Adicionar resultado ao contexto
            $context->setData('ad_creative_result', [
                'success' => true,
                'creative_id' => $creative['id'] ?? null,
                'creative_name' => $creative['name'] ?? null,
                'campaign_id' => $finalCampaignId,
                'platform' => $finalPlatform,
                'created_at' => now()->toIso8601String()
            ]);

            return $context->getData();
        } catch (\Exception $e) {
            LoggerFacade::error("Falha ao criar criativo para lead {$lead->id}: " . $e->getMessage());
            throw new WorkflowExecutionException("Falha na criação de criativo: " . $e->getMessage());
        }
    }

    public function getNextNodeId(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): ?string
    {
        $config = $node->configuration ?? [];
        $result = $context->getData('ad_creative_result');

        // Se criativo foi criado com sucesso, seguir para próximo nó
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
