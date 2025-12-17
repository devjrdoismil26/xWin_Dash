<?php

namespace App\Domains\Leads\Application\Handlers;

use App\Domains\Leads\Application\Queries\GetLeadQuery;
use App\Domains\Leads\Domain\Repositories\LeadRepositoryInterface;
use App\Domains\Leads\Domain\Services\LeadService;
use Illuminate\Support\Facades\Log;

class GetLeadHandler
{
    public function __construct(
        private LeadRepositoryInterface $leadRepository,
        private LeadService $leadService
    ) {
    }

    public function handle(GetLeadQuery $query): ?array
    {
        try {
            // Validar dados da query
            $this->validateQuery($query);

            // Buscar o lead
            $lead = $this->leadRepository->findById($query->leadId);

            if (!$lead) {
                return null;
            }

            // Enriquecer com dados adicionais se solicitado
            $result = $lead->toArray();

            if ($query->includeActivities) {
                $result['activities'] = $this->leadService->getLeadActivities($lead);
            }

            if ($query->includeConversations) {
                $result['conversations'] = $this->leadService->getLeadConversations($lead);
            }

            if ($query->includeScoreHistory) {
                $result['score_history'] = $this->leadService->getLeadScoreHistory($lead);
            }

            Log::info('Lead retrieved successfully', [
                'lead_id' => $query->leadId
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error('Error retrieving lead', [
                'lead_id' => $query->leadId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateQuery(GetLeadQuery $query): void
    {
        if (empty($query->leadId)) {
            throw new \InvalidArgumentException('ID do lead é obrigatório');
        }
    }
}
