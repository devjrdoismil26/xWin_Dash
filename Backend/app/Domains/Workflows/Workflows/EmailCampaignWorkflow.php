<?php

namespace App\Domains\Workflows\Workflows;

use App\Domains\EmailMarketing\Services\EmailCampaignService; // Supondo que a entidade de domínio Workflow exista
use App\Domains\Workflows\Domain\Workflow; // Supondo que este serviço exista
use Illuminate\Support\Facades\Log;

class EmailCampaignWorkflow extends Workflow
{
    protected EmailCampaignService $emailCampaignService;

    public function __construct(EmailCampaignService $emailCampaignService)
    {
        $this->emailCampaignService = $emailCampaignService;
        parent::__construct(); // Chamar o construtor da classe pai
    }

    /**
     * Define a estrutura e os passos do workflow de campanha de e-mail.
     *
     * @return array
     */
    protected function defineWorkflow(): array
    {
        return [
            'start' => [
                'action' => 'send_initial_email',
                'next' => 'wait_for_open',
            ],
            'wait_for_open' => [
                'condition' => 'email_opened',
                'true' => 'send_follow_up_email',
                'false' => 'send_re_engagement_email',
            ],
            'send_initial_email' => [
                'action' => 'send_email',
                'parameters' => ['template' => 'welcome_campaign', 'subject' => 'Bem-vindo!'],
                'next' => 'wait_for_open',
            ],
            'send_follow_up_email' => [
                'action' => 'send_email',
                'parameters' => ['template' => 'follow_up_campaign', 'subject' => 'Não perca!'],
                'next' => 'end',
            ],
            'send_re_engagement_email' => [
                'action' => 'send_email',
                'parameters' => ['template' => 're_engagement_campaign', 'subject' => 'Sentimos sua falta!'],
                'next' => 'end',
            ],
            'end' => [
                'action' => 'complete_workflow',
            ],
        ];
    }

    /**
     * Executa uma ação específica do workflow.
     *
     * @param string $action     o nome da ação a ser executada
     * @param array  $parameters parâmetros para a ação
     *
     * @return mixed o resultado da ação
     */
    protected function executeAction(string $action, array $parameters = []): mixed
    {
        Log::info("Executando ação de workflow de campanha de e-mail: {$action}");

        switch ($action) {
            case 'send_email':
                // Supondo que o emailCampaignService tem um método para enviar e-mails com base em template
                // $this->emailCampaignService->sendTemplatedEmail($this->lead, $parameters['template'], $parameters['subject']);
                Log::info("E-mail '{$parameters['template']}' enviado.");
                return true;
            case 'complete_workflow':
                Log::info("Workflow de campanha de e-mail concluído.");
                return true;
            default:
                throw new \Exception("Ação de workflow desconhecida: {$action}");
        }
    }

    /**
     * Avalia uma condição específica do workflow.
     *
     * @param string $condition o nome da condição a ser avaliada
     * @param array  $data      dados para avaliação da condição
     *
     * @return bool o resultado da avaliação
     */
    protected function evaluateCondition(string $condition, array $data = []): bool
    {
        Log::info("Avaliando condição de workflow de campanha de e-mail: {$condition}");

        switch ($condition) {
            case 'email_opened':
                // Supondo que $data contém informações sobre o e-mail aberto
                return ($data['email_opened'] ?? false) && ($data['email_type'] ?? '') === 'welcome';
            default:
                throw new \Exception("Condição de workflow desconhecida: {$condition}");
        }
    }
}
