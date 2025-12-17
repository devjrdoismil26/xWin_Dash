<?php

namespace App\Domains\ADStool\Events;

use App\Domains\ADStool\DTOs\CampaignPerformanceUpdateDTO;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Evento disparado quando os dados de desempenho de uma campanha são atualizados.
 *
 * Este evento é acionado após a sincronização de métricas de uma plataforma externa,
 * carregando um DTO com os novos dados de desempenho. Listeners podem usar isso
 * para re-calcular estatísticas ou verificar se algum alerta de desempenho deve ser gerado.
 */
class CampaignPerformanceUpdated
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var CampaignPerformanceUpdateDTO os dados da atualização de desempenho
     */
    public CampaignPerformanceUpdateDTO $performanceData;

    /**
     * Create a new event instance.
     *
     * @param CampaignPerformanceUpdateDTO $performanceData
     */
    public function __construct(CampaignPerformanceUpdateDTO $performanceData)
    {
        $this->performanceData = $performanceData;
    }
}
