<?php

namespace App\Domains\EmailMarketing\Application\UseCases;

use App\Domains\EmailMarketing\Domain\EmailCampaign;
use App\Domains\EmailMarketing\Application\Commands\SendEmailCampaignCommand;
use App\Domains\EmailMarketing\Application\Handlers\SendEmailCampaignHandler;
use App\Domains\EmailMarketing\Application\Services\EmailMarketingApplicationService;
use App\Shared\Services\CrossModuleValidationService;
use App\Shared\Services\CrossModuleEventDispatcher;
use App\Shared\Events\EmailCampaignSentEvent;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

/**
 * Use Case para envio de campanhas de email
 *
 * Orquestra o envio de uma campanha de email,
 * incluindo validações, processamento e eventos.
 */
class SendEmailCampaignUseCase
{
    private SendEmailCampaignHandler $handler;
    private EmailMarketingApplicationService $applicationService;
    private CrossModuleValidationService $validationService;
    private CrossModuleEventDispatcher $eventDispatcher;

    public function __construct(
        SendEmailCampaignHandler $handler,
        EmailMarketingApplicationService $applicationService,
        CrossModuleValidationService $validationService,
        CrossModuleEventDispatcher $eventDispatcher
    ) {
        $this->handler = $handler;
        $this->applicationService = $applicationService;
        $this->validationService = $validationService;
        $this->eventDispatcher = $eventDispatcher;
    }

    /**
     * Executa o use case de envio de campanha de email
     */
    public function execute(SendEmailCampaignCommand $command): array
    {
        try {
            Log::info('Starting email campaign sending use case', [
                'campaign_id' => $command->getCampaignId(),
                'user_id' => $command->getUserId()
            ]);

            // Validar comando
            $validationErrors = $this->validateCommand($command);
            if (!empty($validationErrors)) {
                return [
                    'success' => false,
                    'errors' => $validationErrors,
                    'message' => 'Dados do envio inválidos'
                ];
            }

            // Executar em transação
            return DB::transaction(function () use ($command) {
                // Buscar campanha
                $campaign = $this->applicationService->getCampaignById($command->getCampaignId());
                if (!$campaign) {
                    return [
                        'success' => false,
                        'errors' => ['Campanha não encontrada'],
                        'message' => 'Campanha não encontrada'
                    ];
                }

                // Validar regras de negócio cross-module
                $crossModuleErrors = $this->validateCrossModuleRules($campaign, $command->getUserId());
                if (!empty($crossModuleErrors)) {
                    return [
                        'success' => false,
                        'errors' => $crossModuleErrors,
                        'message' => 'Regras de negócio violadas'
                    ];
                }

                // Processar envio
                $result = $this->handler->handle($command);

                // Executar ações pós-envio
                $this->executePostSendingActions($campaign, $command, $result);

                // Disparar evento de domínio
                $this->dispatchDomainEvent($campaign, $command, $result);

                Log::info('Email campaign sent successfully', [
                    'campaign_id' => $campaign->getId(),
                    'user_id' => $command->getUserId(),
                    'recipients_count' => $result['recipients_count'] ?? 0
                ]);

                return [
                    'success' => true,
                    'data' => [
                        'campaign_id' => $campaign->getId(),
                        'recipients_count' => $result['recipients_count'] ?? 0,
                        'sent_at' => now()->toISOString(),
                        'status' => 'sent'
                    ],
                    'message' => 'Campanha de email enviada com sucesso'
                ];
            });
        } catch (\Throwable $exception) {
            Log::error('Error in SendEmailCampaignUseCase', [
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString(),
                'campaign_id' => $command->getCampaignId(),
                'user_id' => $command->getUserId()
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante envio da campanha'],
                'message' => 'Falha ao enviar campanha de email'
            ];
        }
    }

    /**
     * Valida o comando de envio
     */
    private function validateCommand(SendEmailCampaignCommand $command): array
    {
        $errors = [];

        if ($command->getCampaignId() <= 0) {
            $errors[] = 'ID da campanha é obrigatório';
        }

        if ($command->getUserId() <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        return $errors;
    }

    /**
     * Valida regras cross-module
     */
    private function validateCrossModuleRules(EmailCampaign $campaign, int $userId): array
    {
        try {
            // Verificar se a campanha pertence ao usuário
            if ($campaign->getUserId() !== $userId) {
                return ['Campanha não pertence ao usuário'];
            }

            // Verificar se a campanha pode ser enviada
            if (!$campaign->canBeSent()) {
                return ['Campanha não pode ser enviada no status atual'];
            }

            // Validar listas de email
            $listValidationErrors = $this->validateEmailLists($campaign);
            if (!empty($listValidationErrors)) {
                return $listValidationErrors;
            }

            // Validar limites do usuário
            $limitErrors = $this->validateUserLimits($userId);
            if (!empty($limitErrors)) {
                return $limitErrors;
            }

            return [];
        } catch (\Throwable $exception) {
            Log::error('Error validating cross-module rules for email campaign sending', [
                'error' => $exception->getMessage(),
                'campaign_id' => $campaign->getId(),
                'user_id' => $userId
            ]);

            return ['Erro durante validação cross-module'];
        }
    }

    /**
     * Valida listas de email
     */
    private function validateEmailLists(EmailCampaign $campaign): array
    {
        $errors = [];

        foreach ($campaign->getEmailListIds() as $listId) {
            $emailList = $this->applicationService->getEmailListById($listId);

            if (!$emailList) {
                $errors[] = "Lista de email ID {$listId} não encontrada";
                continue;
            }

            if (!$emailList->isActive()) {
                $errors[] = "Lista de email ID {$listId} não está ativa";
                continue;
            }

            if ($emailList->getActiveSubscriberCount() < 1) {
                $errors[] = "Lista de email ID {$listId} não possui assinantes ativos";
            }
        }

        return $errors;
    }

    /**
     * Valida limites do usuário
     */
    private function validateUserLimits(int $userId): array
    {
        $errors = [];

        // Verificar limite de envios diários
        $dailySendsCount = $this->applicationService->getDailySendsCount($userId);
        $maxDailySends = $this->applicationService->getUserMaxDailySends($userId);

        if ($dailySendsCount >= $maxDailySends) {
            $errors[] = "Usuário excedeu o limite de envios diários ({$maxDailySends})";
        }

        // Verificar limite de envios mensais
        $monthlySendsCount = $this->applicationService->getMonthlySendsCount($userId);
        $maxMonthlySends = $this->applicationService->getUserMaxMonthlySends($userId);

        if ($monthlySendsCount >= $maxMonthlySends) {
            $errors[] = "Usuário excedeu o limite de envios mensais ({$maxMonthlySends})";
        }

        return $errors;
    }

    /**
     * Executa ações pós-envio
     */
    private function executePostSendingActions(EmailCampaign $campaign, SendEmailCampaignCommand $command, array $result): void
    {
        try {
            // Atualizar status da campanha
            $campaign->markAsSent();
            $this->applicationService->updateCampaignStatus($campaign->getId(), 'sent');

            // Configurar analytics pós-envio
            $this->applicationService->setupPostSendingAnalytics($campaign, $result);

            // Configurar tracking pós-envio
            $this->applicationService->setupPostSendingTracking($campaign, $result);

            // Configurar monitoramento de bounces
            $this->applicationService->setupBounceMonitoring($campaign);

            // Configurar monitoramento de aberturas
            $this->applicationService->setupOpenTracking($campaign);

            // Configurar monitoramento de cliques
            $this->applicationService->setupClickTracking($campaign);
        } catch (\Throwable $exception) {
            Log::error('Error executing post-sending actions for email campaign', [
                'error' => $exception->getMessage(),
                'campaign_id' => $campaign->getId()
            ]);
        }
    }

    /**
     * Dispara evento de domínio
     */
    private function dispatchDomainEvent(EmailCampaign $campaign, SendEmailCampaignCommand $command, array $result): void
    {
        try {
            $event = new EmailCampaignSentEvent(
                campaignId: $campaign->getId(),
                campaignName: $campaign->getName(),
                userId: $command->getUserId(),
                projectId: $campaign->getProjectId(),
                campaignType: $campaign->getType(),
                metadata: [
                    'recipients_count' => $result['recipients_count'] ?? 0,
                    'email_list_ids' => $campaign->getEmailListIds(),
                    'subject' => $campaign->getSubject(),
                    'source' => 'use_case',
                    'sent_at' => now()->toISOString()
                ]
            );

            $this->eventDispatcher->dispatch($event);
        } catch (\Throwable $exception) {
            Log::error('Error dispatching email campaign sent event', [
                'error' => $exception->getMessage(),
                'campaign_id' => $campaign->getId()
            ]);
        }
    }

    /**
     * Obtém estatísticas do use case
     */
    public function getStats(): array
    {
        return [
            'use_case' => 'SendEmailCampaignUseCase',
            'description' => 'Envio de campanhas de email',
            'version' => '1.0.0',
            'timestamp' => now()->toISOString()
        ];
    }
}
