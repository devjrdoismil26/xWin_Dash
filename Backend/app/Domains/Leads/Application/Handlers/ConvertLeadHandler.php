<?php

namespace App\Domains\Leads\Application\Handlers;

use App\Domains\Leads\Application\Commands\ConvertLeadCommand;
use App\Domains\Leads\Domain\Repositories\LeadRepositoryInterface;
use App\Domains\Leads\Domain\Services\LeadService;
use App\Domains\Leads\Domain\Services\LeadConversionService;
use Illuminate\Support\Facades\Log;

class ConvertLeadHandler
{
    public function __construct(
        private LeadRepositoryInterface $leadRepository,
        private LeadService $leadService,
        private LeadConversionService $leadConversionService
    ) {
    }

    public function handle(ConvertLeadCommand $command): array
    {
        try {
            // Buscar o lead existente
            $lead = $this->leadRepository->findById($command->leadId);

            if (!$lead) {
                throw new \Exception('Lead não encontrado');
            }

            // Validar dados do comando
            $this->validateCommand($command);

            // Verificar se o lead já foi convertido
            if ($lead->status === 'converted') {
                throw new \Exception('Lead já foi convertido');
            }

            // Converter o lead
            $conversionResult = $this->leadConversionService->convertLead([
                'lead' => $lead,
                'conversion_type' => $command->conversionType,
                'converted_to_id' => $command->convertedToId,
                'notes' => $command->notes
            ]);

            // Atualizar status do lead
            $updatedLead = $this->leadService->updateLeadStatus($lead, 'converted');

            // Salvar no repositório
            $savedLead = $this->leadRepository->save($updatedLead);

            // Registrar atividade de conversão
            $this->leadService->logActivity(
                $savedLead,
                'converted',
                "Lead convertido para {$command->conversionType}",
                $command->notes
            );

            Log::info('Lead converted successfully', [
                'lead_id' => $command->leadId,
                'conversion_type' => $command->conversionType
            ]);

            return [
                'lead' => $savedLead->toArray(),
                'conversion' => $conversionResult,
                'message' => 'Lead convertido com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error converting lead', [
                'lead_id' => $command->leadId,
                'conversion_type' => $command->conversionType,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(ConvertLeadCommand $command): void
    {
        if (empty($command->leadId)) {
            throw new \InvalidArgumentException('ID do lead é obrigatório');
        }

        if (empty($command->conversionType)) {
            throw new \InvalidArgumentException('Tipo de conversão é obrigatório');
        }

        $validTypes = ['customer', 'opportunity', 'contact'];
        if (!in_array($command->conversionType, $validTypes)) {
            throw new \InvalidArgumentException('Tipo de conversão inválido');
        }
    }
}
