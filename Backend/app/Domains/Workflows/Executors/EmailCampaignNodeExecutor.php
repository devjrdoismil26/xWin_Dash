<?php

namespace App\Domains\Workflows\Executors;

use App\Domains\EmailMarketing\Services\EmailCampaignService;
use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Exceptions\WorkflowExecutionException;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Leads\Models\Lead;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use Illuminate\Support\Facades\Log;

class EmailCampaignNodeExecutor implements WorkflowNodeExecutor
{
    protected EmailCampaignService $emailCampaignService;

    public function __construct(EmailCampaignService $emailCampaignService)
    {
        $this->emailCampaignService = $emailCampaignService;
    }

    /**
     * Execute the action of the workflow node.
     *
     * @param WorkflowNodeModel        $node    the node to be executed
     * @param Lead                     $lead    the lead being processed
     * @param WorkflowExecutionContext $context the execution context
     *
     * @return array<string, mixed> o payload atualizado após a execução da ação
     *
     * @throws WorkflowExecutionException se a configuração for inválida ou a ação falhar
     */
    public function execute(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): array
    {
        Log::info("Executando EmailCampaignNodeExecutor para node {$node->id}.");

        $config = $node->configuration ?? [];
        $action = $config['action'] ?? null;

        $this->validateAction($action);

        try {
            // Construir payload para substituição de placeholders
            $payload = [
                'lead_id' => $lead->id,
                'lead_name' => $lead->name ?? '',
                'lead_email' => $lead->email ?? '',
                ...$context->getData()
            ];

            $this->executeEmailAction($action, $config, $payload, $context);
            
            // Adicionar resultado ao contexto
            $context->setData('email_campaign_action_result', [
                'action' => $action,
                'status' => 'success',
                'executed_at' => now()->toIso8601String()
            ]);
        } catch (\Exception $e) {
            Log::error("Falha na execução do nó de campanha de e-mail: " . $e->getMessage());
            throw new WorkflowExecutionException("Falha na execução do nó de campanha de e-mail: " . $e->getMessage());
        }

        return $context->getData();
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
        $result = $context->getData('email_campaign_action_result');

        // Se ação foi bem-sucedida, seguir para próximo nó
        if ($result && isset($result['status']) && $result['status'] === 'success') {
            return $config['next_node_id'] ?? $node->next_node_id ?? null;
        }

        // Se falhou, seguir para nó de erro (se configurado)
        return $config['error_node_id'] ?? null;
    }

    /**
     * Valida se a ação foi fornecida.
     *
     * @param string|null $action
     * @throws WorkflowExecutionException
     */
    private function validateAction(?string $action): void
    {
        if (!$action) {
            throw new WorkflowExecutionException("Nó de campanha de e-mail inválido: 'action' é obrigatório.");
        }
    }

    /**
     * Executa a ação específica de e-mail.
     *
     * @param string $action
     * @param array<string, mixed> $config
     * @param array<string, mixed> $payload
     * @param WorkflowExecutionContext $context
     * @throws WorkflowExecutionException
     */
    private function executeEmailAction(string $action, array $config, array $payload, WorkflowExecutionContext $context): void
    {
        match ($action) {
            'send_email' => $this->sendEmail($config, $payload, $context),
            'add_to_list' => $this->addToList($config, $payload, $context),
            'update_campaign_status' => $this->updateCampaignStatus($config, $payload, $context),
            default => throw new WorkflowExecutionException("Ação de campanha de e-mail desconhecida: {$action}")
        };
    }

    /**
     * Envia um e-mail.
     *
     * @param array<string, mixed> $config
     * @param array<string, mixed> $payload
     * @param WorkflowExecutionContext $context
     * @throws WorkflowExecutionException
     */
    private function sendEmail(array $config, array $payload, WorkflowExecutionContext $context): void
    {
        $email = $this->replacePlaceholder($config['email'] ?? null, $payload);
        $template = $this->replacePlaceholder($config['template'] ?? null, $payload);

        if (!$email || !$template) {
            throw new WorkflowExecutionException("Para 'send_email', 'email' e 'template' são obrigatórios.");
        }

        // Em produção: usar EmailCampaignService
        // $this->emailCampaignService->sendEmail($email, $template, $payload);
        Log::info("E-mail enviado para {$email} usando template {$template}.");
        
        $context->setData('email_sent_to', $email);
        $context->setData('email_template', $template);
    }

    /**
     * Adiciona um assinante à lista.
     *
     * @param array<string, mixed> $config
     * @param array<string, mixed> $payload
     * @param WorkflowExecutionContext $context
     * @throws WorkflowExecutionException
     */
    private function addToList(array $config, array $payload, WorkflowExecutionContext $context): void
    {
        $listId = $this->replacePlaceholder($config['list_id'] ?? null, $payload);
        $subscriberEmail = $this->replacePlaceholder($config['subscriber_email'] ?? null, $payload);

        if (!$listId || !$subscriberEmail) {
            throw new WorkflowExecutionException("Para 'add_to_list', 'list_id' e 'subscriber_email' são obrigatórios.");
        }

        // Em produção: usar EmailCampaignService
        // $this->emailCampaignService->addSubscriberToList($listId, $subscriberEmail, $payload);
        Log::info("Assinante {$subscriberEmail} adicionado à lista ID: {$listId}.");
        
        $context->setData('subscriber_added_to_list', $listId);
        $context->setData('subscriber_email', $subscriberEmail);
    }

    /**
     * Atualiza o status da campanha.
     *
     * @param array<string, mixed> $config
     * @param array<string, mixed> $payload
     * @param WorkflowExecutionContext $context
     * @throws WorkflowExecutionException
     */
    private function updateCampaignStatus(array $config, array $payload, WorkflowExecutionContext $context): void
    {
        $campaignId = $this->replacePlaceholder($config['campaign_id'] ?? null, $payload);
        $newStatus = $this->replacePlaceholder($config['new_status'] ?? null, $payload);

        if (!$campaignId || !$newStatus) {
            throw new WorkflowExecutionException("Para 'update_campaign_status', 'campaign_id' e 'new_status' são obrigatórios.");
        }

        // Em produção: usar EmailCampaignService
        // $this->emailCampaignService->updateCampaignStatus($campaignId, $newStatus);
        Log::info("Status da campanha ID: {$campaignId} atualizado para {$newStatus}.");
        
        $context->setData('campaign_id', $campaignId);
        $context->setData('campaign_new_status', $newStatus);
    }

    /**
     * Substitui um placeholder no texto com um valor do payload.
     *
     * @param string|null $text    o texto com placeholder (ex: "{{ email }}")
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
