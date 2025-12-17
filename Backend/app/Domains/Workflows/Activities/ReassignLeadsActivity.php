<?php

namespace App\Domains\Workflows\Activities;

use App\Domains\Leads\Models\Lead;
use Illuminate\Support\Facades\Log as LoggerFacade;
use Workflow\Activity;

class ReassignLeadsActivity extends Activity
{
    /**
     * Reatribui os leads de um usuário para um usuário padrão ou nulo.
     *
     * @param string $userId o ID do usuário cujos leads serão reatribuídos
     */
    public function execute(string $userId): void
    {
        // LÓGICA DE EXEMPLO:
        // Encontrar todos os leads atribuídos ao usuário e reatribuí-los.
        // Você pode ter um usuário padrão para leads não atribuídos ou simplesmente definir como nulo.
        $leads = Lead::where('assigned_to', $userId)->get();

        foreach ($leads as $lead) {
            try {
                $lead->update([
                    'assigned_to' => null, // Reatribui para nulo
                ]);
                LoggerFacade::info("Lead {$lead->id} reatribuído para o usuário {$userId}.");
            } catch (\Exception $e) {
                LoggerFacade::error("Falha ao reatribuir lead {$lead
                    ->id} para o usuário {$userId}: " . $e->getMessage());
            }
        }
    }

    /**
     * A compensação para reatribuição de leads é complexa e geralmente não é implementada.
     * Reverter a reatribuição exigiria armazenar o ID do usuário original, o que pode
     * violar políticas de privacidade.
     */
    public function compensate(string $userId): void
    {
        LoggerFacade::warning("Compensação para ReassignLeadsActivity não implementada para usuário {$userId}.");
    }
}
