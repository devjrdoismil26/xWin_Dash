<?php

namespace App\Domains\EmailMarketing\Application\Services;

use App\Domains\EmailMarketing\Application\Commands\CreateEmailCampaignCommand;
use App\Domains\EmailMarketing\Application\Commands\UpdateEmailCampaignCommand;
use App\Domains\EmailMarketing\Application\Services\EmailMarketingApplicationService;
use App\Shared\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;

/**
 * ✅ Email Campaign Validation Service
 *
 * Serviço especializado para validação de campanhas de email
 * Responsável por validar campanhas antes da criação/atualização
 */
class EmailCampaignValidationService
{
    public function __construct(
        private EmailMarketingApplicationService $applicationService,
        private CrossModuleValidationService $validationService
    ) {
    }

    /**
     * Validar comando de criação de campanha
     */
    public function validateCreateCommand(CreateEmailCampaignCommand $command): array
    {
        $errors = [];

        try {
            // Validar dados básicos
            $basicErrors = $this->validateBasicData($command);
            $errors = array_merge($errors, $basicErrors);

            // Validar lista de email
            $listErrors = $this->validateEmailList($command);
            $errors = array_merge($errors, $listErrors);

            // Validar limites do usuário
            $limitErrors = $this->validateUserLimits($command);
            $errors = array_merge($errors, $limitErrors);

            // Validar conteúdo
            $contentErrors = $this->validateContent($command);
            $errors = array_merge($errors, $contentErrors);

            // Validar agendamento
            $scheduleErrors = $this->validateSchedule($command);
            $errors = array_merge($errors, $scheduleErrors);

            // Validar integrações
            $integrationErrors = $this->validateIntegrations($command);
            $errors = array_merge($errors, $integrationErrors);

            return [
                'valid' => empty($errors),
                'errors' => $errors
            ];
        } catch (\Exception $e) {
            Log::error('Erro na validação de comando de criação: ' . $e->getMessage(), [
                'command' => $command->toArray()
            ]);

            return [
                'valid' => false,
                'errors' => ['Validation error: ' . $e->getMessage()]
            ];
        }
    }

    /**
     * Validar comando de atualização de campanha
     */
    public function validateUpdateCommand(UpdateEmailCampaignCommand $command): array
    {
        $errors = [];

        try {
            // Validar existência da campanha
            $campaign = $this->applicationService->getEmailCampaign($command->getCampaignId(), $command->getUserId());
            if (!$campaign) {
                $errors[] = 'Campaign not found';
                return ['valid' => false, 'errors' => $errors];
            }

            // Validar dados básicos
            $basicErrors = $this->validateBasicDataForUpdate($command);
            $errors = array_merge($errors, $basicErrors);

            // Validar lista de email
            $listErrors = $this->validateEmailListForUpdate($command);
            $errors = array_merge($errors, $listErrors);

            // Validar conteúdo
            $contentErrors = $this->validateContentForUpdate($command);
            $errors = array_merge($errors, $contentErrors);

            // Validar agendamento
            $scheduleErrors = $this->validateScheduleForUpdate($command);
            $errors = array_merge($errors, $scheduleErrors);

            return [
                'valid' => empty($errors),
                'errors' => $errors
            ];
        } catch (\Exception $e) {
            Log::error('Erro na validação de comando de atualização: ' . $e->getMessage(), [
                'command' => $command->toArray()
            ]);

            return [
                'valid' => false,
                'errors' => ['Validation error: ' . $e->getMessage()]
            ];
        }
    }

    /**
     * Validar dados básicos
     */
    private function validateBasicData(CreateEmailCampaignCommand $command): array
    {
        $errors = [];

        // Validar nome
        if (empty(trim($command->getName()))) {
            $errors[] = 'Campaign name is required';
        } elseif (strlen($command->getName()) > 255) {
            $errors[] = 'Campaign name cannot exceed 255 characters';
        }

        // Validar assunto
        if (empty(trim($command->getSubject()))) {
            $errors[] = 'Campaign subject is required';
        } elseif (strlen($command->getSubject()) > 255) {
            $errors[] = 'Campaign subject cannot exceed 255 characters';
        }

        // Validar tipo
        $validTypes = ['regular', 'automated', 'welcome', 'nurturing', 'promotional'];
        if (!in_array($command->getType(), $validTypes)) {
            $errors[] = 'Invalid campaign type';
        }

        // Validar prioridade
        $validPriorities = ['low', 'medium', 'high', 'urgent'];
        if (!in_array($command->getPriority(), $validPriorities)) {
            $errors[] = 'Invalid campaign priority';
        }

        return $errors;
    }

    /**
     * Validar dados básicos para atualização
     */
    private function validateBasicDataForUpdate(UpdateEmailCampaignCommand $command): array
    {
        $errors = [];

        // Validar nome se fornecido
        if ($command->getName() !== null) {
            if (empty(trim($command->getName()))) {
                $errors[] = 'Campaign name cannot be empty';
            } elseif (strlen($command->getName()) > 255) {
                $errors[] = 'Campaign name cannot exceed 255 characters';
            }
        }

        // Validar assunto se fornecido
        if ($command->getSubject() !== null) {
            if (empty(trim($command->getSubject()))) {
                $errors[] = 'Campaign subject cannot be empty';
            } elseif (strlen($command->getSubject()) > 255) {
                $errors[] = 'Campaign subject cannot exceed 255 characters';
            }
        }

        // Validar tipo se fornecido
        if ($command->getType() !== null) {
            $validTypes = ['regular', 'automated', 'welcome', 'nurturing', 'promotional'];
            if (!in_array($command->getType(), $validTypes)) {
                $errors[] = 'Invalid campaign type';
            }
        }

        return $errors;
    }

    /**
     * Validar lista de email
     */
    private function validateEmailList(CreateEmailCampaignCommand $command): array
    {
        $errors = [];

        if ($command->getEmailListId() === null) {
            $errors[] = 'Email list is required';
            return $errors;
        }

        try {
            $emailList = $this->applicationService->getEmailList($command->getEmailListId(), $command->getUserId());

            if (!$emailList) {
                $errors[] = 'Email list not found';
            } elseif (!$emailList->canBeUsedInCampaigns()) {
                $errors[] = 'Email list cannot be used in campaigns';
            } elseif ($emailList->getMetrics()->getActiveSubscriberCount() === 0) {
                $errors[] = 'Email list has no active subscribers';
            }
        } catch (\Exception $e) {
            $errors[] = 'Error validating email list: ' . $e->getMessage();
        }

        return $errors;
    }

    /**
     * Validar lista de email para atualização
     */
    private function validateEmailListForUpdate(UpdateEmailCampaignCommand $command): array
    {
        $errors = [];

        if ($command->getEmailListId() !== null) {
            try {
                $emailList = $this->applicationService->getEmailList($command->getEmailListId(), $command->getUserId());

                if (!$emailList) {
                    $errors[] = 'Email list not found';
                } elseif (!$emailList->canBeUsedInCampaigns()) {
                    $errors[] = 'Email list cannot be used in campaigns';
                }
            } catch (\Exception $e) {
                $errors[] = 'Error validating email list: ' . $e->getMessage();
            }
        }

        return $errors;
    }

    /**
     * Validar limites do usuário
     */
    private function validateUserLimits(CreateEmailCampaignCommand $command): array
    {
        $errors = [];

        try {
            $userCampaigns = $this->applicationService->getUserEmailCampaigns($command->getUserId());
            $activeCampaigns = array_filter($userCampaigns, fn($campaign) => $campaign['status'] === 'active');

            // Verificar limite de campanhas ativas
            if (count($activeCampaigns) >= 10) { // Limite configurável
                $errors[] = 'Maximum number of active campaigns reached';
            }

            // Verificar limite de campanhas por dia
            $todayCampaigns = array_filter($userCampaigns, function ($campaign) {
                return date('Y-m-d', strtotime($campaign['created_at'])) === date('Y-m-d');
            });

            if (count($todayCampaigns) >= 5) { // Limite configurável
                $errors[] = 'Maximum number of campaigns per day reached';
            }
        } catch (\Exception $e) {
            $errors[] = 'Error validating user limits: ' . $e->getMessage();
        }

        return $errors;
    }

    /**
     * Validar conteúdo
     */
    private function validateContent(CreateEmailCampaignCommand $command): array
    {
        $errors = [];

        // Validar conteúdo HTML
        if (empty(trim($command->getContent()))) {
            $errors[] = 'Campaign content is required';
        } elseif (strlen($command->getContent()) < 50) {
            $errors[] = 'Campaign content is too short (minimum 50 characters)';
        } elseif (strlen($command->getContent()) > 100000) {
            $errors[] = 'Campaign content is too long (maximum 100,000 characters)';
        }

        // Validar conteúdo de texto
        if ($command->getTextContent() !== null) {
            if (strlen($command->getTextContent()) > 50000) {
                $errors[] = 'Text content is too long (maximum 50,000 characters)';
            }
        }

        // Validar links
        $linkErrors = $this->validateLinks($command->getContent());
        $errors = array_merge($errors, $linkErrors);

        return $errors;
    }

    /**
     * Validar conteúdo para atualização
     */
    private function validateContentForUpdate(UpdateEmailCampaignCommand $command): array
    {
        $errors = [];

        // Validar conteúdo HTML se fornecido
        if ($command->getContent() !== null) {
            if (empty(trim($command->getContent()))) {
                $errors[] = 'Campaign content cannot be empty';
            } elseif (strlen($command->getContent()) < 50) {
                $errors[] = 'Campaign content is too short (minimum 50 characters)';
            } elseif (strlen($command->getContent()) > 100000) {
                $errors[] = 'Campaign content is too long (maximum 100,000 characters)';
            }
        }

        // Validar conteúdo de texto se fornecido
        if ($command->getTextContent() !== null) {
            if (strlen($command->getTextContent()) > 50000) {
                $errors[] = 'Text content is too long (maximum 50,000 characters)';
            }
        }

        return $errors;
    }

    /**
     * Validar agendamento
     */
    private function validateSchedule(CreateEmailCampaignCommand $command): array
    {
        $errors = [];

        if ($command->getScheduledAt() !== null) {
            $scheduledAt = new \DateTime($command->getScheduledAt());
            $now = new \DateTime();

            if ($scheduledAt <= $now) {
                $errors[] = 'Scheduled time must be in the future';
            }

            // Verificar se não está muito longe no futuro (ex: 1 ano)
            $maxDate = (new \DateTime())->add(new \DateInterval('P1Y'));
            if ($scheduledAt > $maxDate) {
                $errors[] = 'Scheduled time cannot be more than 1 year in the future';
            }
        }

        return $errors;
    }

    /**
     * Validar agendamento para atualização
     */
    private function validateScheduleForUpdate(UpdateEmailCampaignCommand $command): array
    {
        $errors = [];

        if ($command->getScheduledAt() !== null) {
            $scheduledAt = new \DateTime($command->getScheduledAt());
            $now = new \DateTime();

            if ($scheduledAt <= $now) {
                $errors[] = 'Scheduled time must be in the future';
            }
        }

        return $errors;
    }

    /**
     * Validar integrações
     */
    private function validateIntegrations(CreateEmailCampaignCommand $command): array
    {
        $errors = [];

        // Validar integração com leads se especificada
        if ($command->getLeadSegmentId() !== null) {
            try {
                $this->validationService->validateLeadSegment($command->getLeadSegmentId(), $command->getUserId());
            } catch (\Exception $e) {
                $errors[] = 'Invalid lead segment: ' . $e->getMessage();
            }
        }

        // Validar integração com workflows se especificada
        if ($command->getWorkflowId() !== null) {
            try {
                $this->validationService->validateWorkflow($command->getWorkflowId(), $command->getUserId());
            } catch (\Exception $e) {
                $errors[] = 'Invalid workflow: ' . $e->getMessage();
            }
        }

        return $errors;
    }

    /**
     * Validar links no conteúdo
     */
    private function validateLinks(string $content): array
    {
        $errors = [];

        // Extrair links do conteúdo HTML
        preg_match_all('/<a[^>]+href=["\']([^"\']+)["\'][^>]*>/i', $content, $matches);
        $links = $matches[1] ?? [];

        foreach ($links as $link) {
            // Validar se é um link válido
            if (!filter_var($link, FILTER_VALIDATE_URL)) {
                $errors[] = "Invalid link found: {$link}";
            }

            // Validar se não é um link suspeito
            if (strpos($link, 'javascript:') === 0 || strpos($link, 'data:') === 0) {
                $errors[] = "Suspicious link found: {$link}";
            }
        }

        return $errors;
    }
}
