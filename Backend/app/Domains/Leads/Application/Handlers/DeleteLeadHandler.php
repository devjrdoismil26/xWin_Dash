<?php

namespace App\Domains\Leads\Application\Handlers;

use App\Domains\Leads\Application\Commands\DeleteLeadCommand;
use App\Domains\Leads\Domain\Repositories\LeadRepositoryInterface;
use App\Domains\Leads\Domain\Services\LeadService;
use Illuminate\Support\Facades\Log;

class DeleteLeadHandler
{
    public function __construct(
        private LeadRepositoryInterface $leadRepository,
        private LeadService $leadService
    ) {
    }

    public function handle(DeleteLeadCommand $command): array
    {
        try {
            // Buscar o lead existente
            $lead = $this->leadRepository->findById($command->leadId);

            if (!$lead) {
                throw new \Exception('Lead não encontrado');
            }

            // Validar dados do comando
            $this->validateCommand($command);

            // Verificar se há dados associados
            $hasAssociatedData = $this->leadService->hasAssociatedData($lead);

            if ($hasAssociatedData && !$command->forceDelete) {
                throw new \Exception('Não é possível excluir lead com dados associados. Use forceDelete=true para forçar a exclusão.');
            }

            // Limpar dados associados se necessário
            if ($command->forceDelete) {
                $this->leadService->cleanupAssociatedData($lead);
            }

            // Excluir o lead
            $this->leadRepository->delete($command->leadId);

            Log::info('Lead deleted successfully', [
                'lead_id' => $command->leadId
            ]);

            return [
                'message' => 'Lead excluído com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error deleting lead', [
                'lead_id' => $command->leadId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(DeleteLeadCommand $command): void
    {
        if (empty($command->leadId)) {
            throw new \InvalidArgumentException('ID do lead é obrigatório');
        }
    }
}
