<?php

namespace App\Domains\Leads\Activities;

use App\Domains\Leads\Models\Lead;
use Workflow\Activity;

class CheckEngagementActivity extends Activity
{
    /**
     * Verifica e retorna os dados de engajamento de um lead.
     *
     * @param Lead $lead o lead a ser verificado
     *
     * @return array Dados de engajamento (ex: { 'emails_opened': 5, 'links_clicked': 2, 'last_activity_days_ago': 10, 'score': 75 })
     */
    public function execute(Lead $lead): array
    {
        // Contar e-mails abertos e cliques
        $emailsOpened = $lead->emails()->whereNotNull('opened_at')->count();
        $linksClicked = $lead->emails()->whereNotNull('clicked_at')->count();

        // Calcular dias desde a última atividade
        $lastActivityDaysAgo = null;
        if ($lead->last_activity_at) {
            $lastActivityDaysAgo = $lead->last_activity_at->diffInDays(now());
        }

        return [
            'emails_opened' => $emailsOpened,
            'links_clicked' => $linksClicked,
            'last_activity_days_ago' => $lastActivityDaysAgo,
            'score' => $lead->score, // Usando o campo 'score' diretamente do modelo Lead
        ];
    }
}
