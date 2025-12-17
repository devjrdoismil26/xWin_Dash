<?php

namespace App\Application\Leads\Handlers;

use App\Application\Leads\Commands\CreateLeadCommand;
use App\Application\Leads\UseCases\CreateLeadUseCase;
use App\Shared\Exceptions\BusinessRuleException;
use App\Shared\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

/**
 * Handler para o comando CreateLeadCommand
 * Implementa o padrão CQRS com validações e orquestração
 */
class CreateLeadHandler
{
    private CreateLeadUseCase $createLeadUseCase;
    private CrossModuleValidationService $validationService;

    public function __construct(
        CreateLeadUseCase $createLeadUseCase,
        CrossModuleValidationService $validationService
    ) {
        $this->createLeadUseCase = $createLeadUseCase;
        $this->validationService = $validationService;
    }

    /**
     * Manipula o comando de criação de lead
     *
     * @param CreateLeadCommand $command
     * @return array
     * @throws BusinessRuleException
     */
    public function handle(CreateLeadCommand $command): array
    {
        try {
            DB::beginTransaction();

            // 1. Validações de negócio
            $this->validateBusinessRules($command);

            // 2. Verificações de duplicação
            $this->checkForDuplicates($command);

            // 3. Aplicar regras de negócio
            $this->applyBusinessRules($command);

            // 4. Executar caso de uso
            $lead = $this->createLeadUseCase->execute($command);

            // 5. Pós-processamento
            $this->postProcessLead($lead);

            DB::commit();

            Log::info("Lead criado com sucesso via Handler", [
                'lead_id' => $lead->id,
                'email' => $command->email,
                'source' => $command->source
            ]);

            return [
                'success' => true,
                'lead' => $lead,
                'message' => 'Lead criado com sucesso'
            ];

        } catch (BusinessRuleException $e) {
            DB::rollBack();
            Log::warning("Falha na criação de lead - Regra de negócio", [
                'email' => $command->email,
                'error' => $e->getMessage()
            ]);
            throw $e;

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Erro inesperado na criação de lead", [
                'email' => $command->email,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw new BusinessRuleException("Erro interno na criação de lead: " . $e->getMessage());
        }
    }

    /**
     * Valida regras de negócio específicas
     */
    private function validateBusinessRules(CreateLeadCommand $command): void
    {
        // Validar email
        if (!filter_var($command->email, FILTER_VALIDATE_EMAIL)) {
            throw BusinessRuleException::operationNotAllowed(
                'create_lead',
                'Email inválido'
            );
        }

        // Validar domínio de email
        $emailDomain = substr(strrchr($command->email, "@"), 1);
        $blockedDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com'];
        if (in_array($emailDomain, $blockedDomains)) {
            throw BusinessRuleException::operationNotAllowed(
                'create_lead',
                'Domínio de email temporário não permitido'
            );
        }

        // Validar fonte
        $validSources = ['website', 'referral', 'social_media', 'email_campaign', 'cold_call', 'event'];
        if ($command->source && !in_array($command->source, $validSources)) {
            throw BusinessRuleException::operationNotAllowed(
                'create_lead',
                'Fonte inválida'
            );
        }

        // Validar campos obrigatórios
        if (empty($command->name) || strlen($command->name) < 2) {
            throw BusinessRuleException::operationNotAllowed(
                'create_lead',
                'Nome deve ter pelo menos 2 caracteres'
            );
        }
    }

    /**
     * Verifica duplicações
     */
    private function checkForDuplicates(CreateLeadCommand $command): void
    {
        // Verificar se já existe lead com este email
        $existingLead = $this->validationService->findLeadByEmail($command->email);
        if ($existingLead) {
            throw BusinessRuleException::operationNotAllowed(
                'create_lead',
                'Já existe um lead com este email'
            );
        }

        // Verificar se já existe lead com este telefone (se fornecido)
        if ($command->phone) {
            $existingPhoneLead = $this->validationService->findLeadByPhone($command->phone);
            if ($existingPhoneLead) {
                throw BusinessRuleException::operationNotAllowed(
                    'create_lead',
                    'Já existe um lead com este telefone'
                );
            }
        }
    }

    /**
     * Aplica regras de negócio
     */
    private function applyBusinessRules(CreateLeadCommand $command): void
    {
        // Normalizar dados
        $command->name = trim(ucwords(strtolower($command->name)));
        $command->email = strtolower(trim($command->email));
        
        if ($command->phone) {
            $command->phone = $this->normalizePhone($command->phone);
        }

        // Aplicar score inicial baseado na fonte
        $command->initialScore = $this->calculateInitialScore($command);
    }

    /**
     * Pós-processamento do lead criado
     */
    private function postProcessLead($lead): void
    {
        // Disparar eventos de integração
        $this->validationService->triggerLeadCreatedEvents($lead);

        // Aplicar automações iniciais
        $this->validationService->applyInitialAutomations($lead);

        // Notificar equipe se necessário
        if ($lead->score >= 70) {
            $this->validationService->notifyHighValueLead($lead);
        }
    }

    /**
     * Normaliza número de telefone
     */
    private function normalizePhone(string $phone): string
    {
        // Remove caracteres não numéricos
        $phone = preg_replace('/[^0-9]/', '', $phone);
        
        // Adiciona código do país se necessário
        if (strlen($phone) === 11 && substr($phone, 0, 1) !== '5') {
            $phone = '55' . $phone;
        }
        
        return $phone;
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

        return $sourceScores[$command->source] ?? 10;
    }
}