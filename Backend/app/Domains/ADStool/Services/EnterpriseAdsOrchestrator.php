<?php

namespace App\Domains\ADStool\Services;

/**
 * Serviço orquestrador de alto nível para fluxos de trabalho de anúncios complexos.
 *
 * Este serviço lida com estratégias de marketing que podem envolver múltiplas campanhas,
 * plataformas e regras de negócio, agindo como o maestro principal que delega
 * tarefas para serviços de nível inferior como o ADSToolService.
 */
class EnterpriseAdsOrchestrator
{
    /**
     * @var ADSToolService
     */
    protected ADSToolService $adsToolService;

    /**
     * @param ADSToolService $adsToolService
     */
    public function __construct(ADSToolService $adsToolService)
    {
        $this->adsToolService = $adsToolService;
    }

    /**
     * Exemplo de um método que orquestra um fluxo de trabalho complexo.
     * Lança uma campanha de reconhecimento de marca e, em seguida, uma campanha de tráfego.
     *
     * @param array<string, mixed> $strategyData
     *
     * @return array<string, mixed>
     */
    public function executeAwarenessAndTrafficStrategy(array $strategyData): array
    {
        $results = [];

        // 1. Criar a campanha de reconhecimento de marca no Facebook
        $awarenessDto = new \App\Domains\ADStool\DTOs\CreateADSCampaignDTO(
            $strategyData['name'] . ' - Awareness',
            'brand_awareness',
            'facebook',
            $strategyData['awareness_budget'],
            $strategyData['user_id'],
        );
        $results['awareness_campaign'] = $this->adsToolService->createNewCampaign($awarenessDto);

        // 2. Criar a campanha de tráfego no Google
        $trafficDto = new \App\Domains\ADStool\DTOs\CreateADSCampaignDTO(
            $strategyData['name'] . ' - Traffic',
            'traffic',
            'google',
            $strategyData['traffic_budget'],
            $strategyData['user_id'],
        );
        $results['traffic_campaign'] = $this->adsToolService->createNewCampaign($trafficDto);

        // Poderia haver lógica adicional aqui, como agendar jobs para monitorar o desempenho

        return $results;
    }
}
