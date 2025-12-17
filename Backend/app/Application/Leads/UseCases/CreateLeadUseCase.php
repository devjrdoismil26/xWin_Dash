<?php

namespace App\Application\Leads\UseCases;

use App\Application\Leads\Commands\CreateLeadCommand;
use App\Domains\Leads\Services\LeadService;
use App\Domains\Leads\Services\ScoringService;
use App\Shared\Services\CrossModuleOrchestrationService;
use App\Shared\ValueObjects\Email;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

/**
 * UseCase para criação de leads com lógica de negócio completa
 * Implementa orquestração, scoring e integrações
 */
class CreateLeadUseCase
{
    protected LeadService $leadService;
    protected ScoringService $scoringService;
    protected CrossModuleOrchestrationService $orchestrationService;

    public function __construct(
        LeadService $leadService,
        ScoringService $scoringService,
        CrossModuleOrchestrationService $orchestrationService
    ) {
        $this->leadService = $leadService;
        $this->scoringService = $scoringService;
        $this->orchestrationService = $orchestrationService;
    }

    /**
     * Executa o caso de uso para criar um novo lead com lógica de negócio completa
     *
     * @param CreateLeadCommand $command
     * @return array
     */
    public function execute(CreateLeadCommand $command): array
    {
        try {
            DB::beginTransaction();

            // 1. Preparar dados do lead
            $leadData = $this->prepareLeadData($command);

            // 2. Criar lead no domínio
            $lead = $this->leadService->createLead($leadData);

            // 3. Aplicar scoring inicial
            $this->applyInitialScoring($lead, $command);

            // 4. Processar campos personalizados
            $this->processCustomFields($lead, $command->customFields);

            // 5. Orquestrar integrações
            $this->orchestrateIntegrations($lead, $command);

            // 6. Aplicar automações iniciais
            $this->applyInitialAutomations($lead, $command);

            // 7. Registrar atividade inicial
            $this->recordInitialActivity($lead, $command);

            DB::commit();

            Log::info("Lead criado com sucesso via UseCase", [
                'lead_id' => $lead->id,
                'email' => $lead->email,
                'score' => $lead->score,
                'source' => $lead->source
            ]);

            return [
                'lead' => $lead,
                'score' => $lead->score,
                'automations_triggered' => $this->getTriggeredAutomations($lead),
                'integrations_synced' => $this->getSyncedIntegrations($lead)
            ];

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Erro na criação de lead via UseCase", [
                'email' => $command->email,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    /**
     * Prepara dados do lead com validações e normalizações
     */
    private function prepareLeadData(CreateLeadCommand $command): array
    {
        // Validar e normalizar email
        $email = new Email($command->email);

        // Preparar dados base
        $leadData = [
            'name' => $command->name,
            'email' => $email->getValue(),
            'phone' => $command->phone,
            'source' => $command->source ?? 'website',
            'status' => 'new',
            'score' => $command->initialScore ?? 10,
            'created_at' => now(),
            'updated_at' => now(),
        ];

        // Adicionar dados específicos da fonte
        $leadData = array_merge($leadData, $this->getSourceSpecificData($command));

        // Adicionar metadados
        $leadData['metadata'] = [
            'created_via' => 'api',
            'user_agent' => request()->header('User-Agent'),
            'ip_address' => request()->ip(),
            'referrer' => request()->header('Referer'),
            'utm_source' => $command->utmSource ?? null,
            'utm_medium' => $command->utmMedium ?? null,
            'utm_campaign' => $command->utmCampaign ?? null,
        ];

        return $leadData;
    }

    /**
     * Retorna dados específicos da fonte
     */
    private function getSourceSpecificData(CreateLeadCommand $command): array
    {
        $sourceData = [];

        switch ($command->source) {
            case 'website':
                $sourceData['landing_page'] = $command->landingPage ?? null;
                $sourceData['form_id'] = $command->formId ?? null;
                break;

            case 'social_media':
                $sourceData['platform'] = $command->platform ?? null;
                $sourceData['post_id'] = $command->postId ?? null;
                break;

            case 'email_campaign':
                $sourceData['campaign_id'] = $command->campaignId ?? null;
                $sourceData['email_id'] = $command->emailId ?? null;
                break;

            case 'referral':
                $sourceData['referrer_id'] = $command->referrerId ?? null;
                $sourceData['referral_code'] = $command->referralCode ?? null;
                break;

            case 'event':
                $sourceData['event_id'] = $command->eventId ?? null;
                $sourceData['event_name'] = $command->eventName ?? null;
                break;
        }

        return $sourceData;
    }

    /**
     * Aplica scoring inicial ao lead
     */
    private function applyInitialScoring($lead, CreateLeadCommand $command): void
    {
        // Calcular score baseado na fonte e dados
        $initialScore = $this->calculateInitialScore($command);
        
        // Aplicar score usando o serviço de scoring
        $this->scoringService->updateLeadScore($lead->id, $initialScore, 'Score inicial baseado na fonte');

        // Recalcular score completo
        $fullScore = $this->scoringService->calculateLeadScore($lead);
        $this->scoringService->updateLeadScore($lead->id, $fullScore, 'Score completo calculado');

        // Atualizar lead com novo score
        $lead->score = $fullScore;
        $lead->save();
    }

    /**
     * Calcula score inicial baseado na fonte
     */
    private function calculateInitialScore(CreateLeadCommand $command): int
    {
        $sourceScores = [
            'referral' => 30,
            'event' => 25,
            'website' => 20,
            'social_media' => 15,
            'email_campaign' => 10,
            'cold_call' => 5,
        ];

        $baseScore = $sourceScores[$command->source] ?? 10;

        // Bônus por dados completos
        if ($command->phone) {
            $baseScore += 5;
        }

        if ($command->company) {
            $baseScore += 10;
        }

        return min($baseScore, 50); // Máximo 50 pontos iniciais
    }

    /**
     * Processa campos personalizados
     */
    private function processCustomFields($lead, ?array $customFields): void
    {
        if (!$customFields || empty($customFields)) {
            return;
        }

        // Validar campos personalizados
        $validatedFields = $this->validateCustomFields($customFields);

        // Salvar campos personalizados
        $lead->custom_fields = $validatedFields;
        $lead->save();

        // Aplicar scoring baseado em campos personalizados
        $this->applyCustomFieldScoring($lead, $validatedFields);
    }

    /**
     * Valida campos personalizados
     */
    private function validateCustomFields(array $customFields): array
    {
        $validatedFields = [];

        foreach ($customFields as $key => $value) {
            // Validar chave
            if (!preg_match('/^[a-zA-Z_][a-zA-Z0-9_]*$/', $key)) {
                Log::warning("Campo personalizado inválido ignorado", ['key' => $key]);
                continue;
            }

            // Validar valor
            if (is_string($value) && strlen($value) > 1000) {
                Log::warning("Valor de campo personalizado muito longo", ['key' => $key]);
                continue;
            }

            $validatedFields[$key] = $value;
        }

        return $validatedFields;
    }

    /**
     * Aplica scoring baseado em campos personalizados
     */
    private function applyCustomFieldScoring($lead, array $customFields): void
    {
        $bonusScore = 0;

        // Campos de alto valor
        $highValueFields = ['budget', 'company_size', 'decision_maker', 'timeline'];
        foreach ($highValueFields as $field) {
            if (isset($customFields[$field])) {
                $bonusScore += 10;
            }
        }

        // Campos específicos
        if (isset($customFields['budget']) && $customFields['budget'] > 10000) {
            $bonusScore += 15;
        }

        if (isset($customFields['company_size']) && $customFields['company_size'] > 100) {
            $bonusScore += 10;
        }

        if ($bonusScore > 0) {
            $this->scoringService->updateLeadScore($lead->id, $bonusScore, 'Bônus por campos personalizados');
        }
    }

    /**
     * Orquestra integrações com outros módulos
     */
    private function orchestrateIntegrations($lead, CreateLeadCommand $command): void
    {
        // Integração com Email Marketing
        $this->orchestrationService->addLeadToEmailList($lead, 'new_leads');

        // Integração com CRM
        $this->orchestrationService->syncLeadToCRM($lead);

        // Integração com Analytics
        $this->orchestrationService->trackLeadCreation($lead, $command->source);

        // Integração com Social Media (se aplicável)
        if ($command->source === 'social_media') {
            $this->orchestrationService->trackSocialMediaLead($lead, $command->platform);
        }
    }

    /**
     * Aplica automações iniciais
     */
    private function applyInitialAutomations($lead, CreateLeadCommand $command): void
    {
        // Automação de boas-vindas
        $this->orchestrationService->triggerWelcomeAutomation($lead);

        // Automação baseada na fonte
        $this->orchestrationService->triggerSourceBasedAutomation($lead, $command->source);

        // Automação de scoring
        if ($lead->score >= 70) {
            $this->orchestrationService->triggerHighValueLeadAutomation($lead);
        }

        // Automação de atribuição
        $this->orchestrationService->autoAssignLead($lead);
    }

    /**
     * Registra atividade inicial
     */
    private function recordInitialActivity($lead, CreateLeadCommand $command): void
    {
        $this->leadService->recordActivity($lead->id, [
            'type' => 'lead_created',
            'description' => "Lead criado via {$command->source}",
            'metadata' => [
                'source' => $command->source,
                'initial_score' => $lead->score,
                'custom_fields_count' => count($command->customFields ?? []),
                'automations_triggered' => true
            ]
        ]);
    }

    /**
     * Retorna automações disparadas
     */
    private function getTriggeredAutomations($lead): array
    {
        return [
            'welcome_email' => true,
            'source_based_automation' => true,
            'high_value_automation' => $lead->score >= 70,
            'auto_assignment' => true
        ];
    }

    /**
     * Retorna integrações sincronizadas
     */
    private function getSyncedIntegrations($lead): array
    {
        return [
            'email_marketing' => true,
            'crm' => true,
            'analytics' => true,
            'social_media' => $lead->source === 'social_media'
        ];
    }
}
