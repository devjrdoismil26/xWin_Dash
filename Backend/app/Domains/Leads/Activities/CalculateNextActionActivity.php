<?php

namespace App\Domains\Leads\Activities;

use App\Domains\Leads\Models\Lead;
use App\Domains\Leads\Services\NurturingRuleService; // Assumindo um serviço para regras de nutrição
use Workflow\Activity;

class CalculateNextActionActivity extends Activity
{
    protected NurturingRuleService $nurturingRuleService;

    public function __construct(NurturingRuleService $nurturingRuleService)
    {
        $this->nurturingRuleService = $nurturingRuleService;
    }

    /**
     * Calcula a próxima ação a ser tomada para um lead com base em seu engajamento.
     *
     * @param Lead  $lead           o lead em questão
     * @param array $engagementData os dados de engajamento da activity anterior
     *
     * @return array|null a próxima ação a ser tomada (ex: { 'action': 'send_email', 'template_id': 123, 'delay': '3 days' }) ou null se nenhuma ação for necessária
     */
    public function execute(Lead $lead, array $engagementData): ?array
    {
        // Delega a lógica de decisão para um serviço de regras de nutrição.
        // Este serviço conteria as regras de negócio reais para determinar a próxima ação.
        return $this->nurturingRuleService->determineNextAction($lead, $engagementData);
    }

    /**
     * Lógica auxiliar para determinar o próximo template de e-mail na sequência.
     * Isso pode ser baseado em um campo no modelo Lead, ou em uma tabela de sequência de e-mails.
     *
     * @param Lead $lead
     *
     * @return int|null
     */
    private function getNextEmailTemplate(Lead $lead): ?int
    {
        // Este método agora é um placeholder, pois a lógica foi movida para NurturingRuleService
        return null;
    }
}
