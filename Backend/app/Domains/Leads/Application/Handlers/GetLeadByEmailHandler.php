<?php

namespace App\Domains\Leads\Application\Handlers;

use App\Domains\Leads\Application\Queries\GetLeadByEmailQuery;
use App\Domains\Leads\Domain\Repositories\LeadRepositoryInterface;
use App\Domains\Leads\Domain\Services\LeadService;
use Illuminate\Support\Facades\Log;

class GetLeadByEmailHandler
{
    public function __construct(
        private LeadRepositoryInterface $leadRepository,
        private LeadService $leadService
    ) {
    }

    public function handle(GetLeadByEmailQuery $query): ?array
    {
        try {
            // Validar dados da query
            $this->validateQuery($query);

            // Buscar o lead por email
            $lead = $this->leadRepository->findByEmail($query->email);

            if (!$lead) {
                return null;
            }

            // Enriquecer com dados adicionais se solicitado
            $result = $lead->toArray();

            if ($query->includeActivities) {
                $result['activities'] = $this->leadService->getLeadActivities($lead);
            }

            Log::info('Lead retrieved by email successfully', [
                'email' => $query->email
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error('Error retrieving lead by email', [
                'email' => $query->email,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateQuery(GetLeadByEmailQuery $query): void
    {
        if (empty($query->email)) {
            throw new \InvalidArgumentException('Email é obrigatório');
        }

        if (!filter_var($query->email, FILTER_VALIDATE_EMAIL)) {
            throw new \InvalidArgumentException('Email inválido');
        }
    }
}
