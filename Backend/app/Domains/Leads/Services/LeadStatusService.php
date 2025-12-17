<?php

namespace App\Domains\Leads\Services;

use App\Domains\Leads\Contracts\LeadRepositoryInterface;
use App\Domains\Leads\Domain\Lead;
use App\Domains\Leads\Events\LeadStatusChanged;
use Illuminate\Support\Facades\Log;

/**
 * Serviço especializado para gerenciamento de status de leads
 */
class LeadStatusService
{
    protected LeadRepositoryInterface $leadRepository;

    public function __construct(LeadRepositoryInterface $leadRepository)
    {
        $this->leadRepository = $leadRepository;
    }

    /**
     * Atualiza o status de um lead.
     */
    public function updateLeadStatus(int $leadId, string $newStatus, ?string $reason = null): Lead
    {
        try {
            $lead = $this->leadRepository->find($leadId);
            if (!$lead) {
                throw new \Exception("Lead não encontrado: {$leadId}");
            }

            $oldStatus = $lead->status;

            $lead = $this->leadRepository->update($leadId, [
                'status' => $newStatus,
                'status_reason' => $reason,
                'status_updated_at' => now()
            ]);

            LeadStatusChanged::dispatch($lead, $oldStatus, $newStatus);
            Log::info("Status do lead atualizado: {$lead->email} de {$oldStatus} para {$newStatus}");

            return $lead;
        } catch (\Throwable $exception) {
            Log::error('Error in LeadStatusService::updateLeadStatus', [
                'error' => $exception->getMessage(),
                'leadId' => $leadId,
                'newStatus' => $newStatus,
                'reason' => $reason
            ]);

            throw $exception;
        }
    }

    /**
     * Marca lead como qualificado.
     */
    public function qualifyLead(int $leadId, ?string $reason = null): Lead
    {
        try {
            return $this->updateLeadStatus($leadId, 'qualified', $reason);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadStatusService::qualifyLead', [
                'error' => $exception->getMessage(),
                'leadId' => $leadId,
                'reason' => $reason
            ]);

            throw $exception;
        }
    }

    /**
     * Marca lead como não qualificado.
     */
    public function disqualifyLead(int $leadId, ?string $reason = null): Lead
    {
        try {
            return $this->updateLeadStatus($leadId, 'disqualified', $reason);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadStatusService::disqualifyLead', [
                'error' => $exception->getMessage(),
                'leadId' => $leadId,
                'reason' => $reason
            ]);

            throw $exception;
        }
    }

    /**
     * Marca lead como convertido.
     */
    public function convertLead(int $leadId, ?string $reason = null): Lead
    {
        try {
            return $this->updateLeadStatus($leadId, 'converted', $reason);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadStatusService::convertLead', [
                'error' => $exception->getMessage(),
                'leadId' => $leadId,
                'reason' => $reason
            ]);

            throw $exception;
        }
    }

    /**
     * Marca lead como perdido.
     */
    public function loseLead(int $leadId, ?string $reason = null): Lead
    {
        try {
            return $this->updateLeadStatus($leadId, 'lost', $reason);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadStatusService::loseLead', [
                'error' => $exception->getMessage(),
                'leadId' => $leadId,
                'reason' => $reason
            ]);

            throw $exception;
        }
    }

    /**
     * Marca lead como em contato.
     */
    public function contactLead(int $leadId, ?string $reason = null): Lead
    {
        try {
            return $this->updateLeadStatus($leadId, 'contacted', $reason);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadStatusService::contactLead', [
                'error' => $exception->getMessage(),
                'leadId' => $leadId,
                'reason' => $reason
            ]);

            throw $exception;
        }
    }

    /**
     * Marca lead como em negociação.
     */
    public function negotiateLead(int $leadId, ?string $reason = null): Lead
    {
        try {
            return $this->updateLeadStatus($leadId, 'negotiating', $reason);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadStatusService::negotiateLead', [
                'error' => $exception->getMessage(),
                'leadId' => $leadId,
                'reason' => $reason
            ]);

            throw $exception;
        }
    }

    /**
     * Marca lead como em follow-up.
     */
    public function followUpLead(int $leadId, ?string $reason = null): Lead
    {
        try {
            return $this->updateLeadStatus($leadId, 'follow_up', $reason);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadStatusService::followUpLead', [
                'error' => $exception->getMessage(),
                'leadId' => $leadId,
                'reason' => $reason
            ]);

            throw $exception;
        }
    }

    /**
     * Verifica se lead pode ter status alterado.
     */
    public function canChangeStatus(int $leadId, string $newStatus): bool
    {
        try {
            $lead = $this->leadRepository->find($leadId);
            if (!$lead) {
                return false;
            }

            $currentStatus = $lead->status;

            // Regras de transição de status
            $allowedTransitions = [
                'new' => ['qualified', 'disqualified', 'contacted', 'lost'],
                'qualified' => ['contacted', 'negotiating', 'converted', 'lost', 'follow_up'],
                'contacted' => ['qualified', 'negotiating', 'converted', 'lost', 'follow_up'],
                'negotiating' => ['converted', 'lost', 'follow_up'],
                'follow_up' => ['qualified', 'contacted', 'negotiating', 'converted', 'lost'],
                'converted' => [], // Status final
                'lost' => [], // Status final
                'disqualified' => [], // Status final
            ];

            return in_array($newStatus, $allowedTransitions[$currentStatus] ?? []);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadStatusService::canChangeStatus', [
                'error' => $exception->getMessage(),
                'leadId' => $leadId,
                'newStatus' => $newStatus
            ]);

            return false;
        }
    }

    /**
     * Obtém histórico de mudanças de status.
     */
    public function getStatusHistory(int $leadId): array
    {
        try {
            return $this->leadRepository->getStatusHistory($leadId);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadStatusService::getStatusHistory', [
                'error' => $exception->getMessage(),
                'leadId' => $leadId
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém estatísticas de status.
     */
    public function getStatusStatistics(): array
    {
        try {
            return $this->leadRepository->getStatusStatistics();
        } catch (\Throwable $exception) {
            Log::error('Error in LeadStatusService::getStatusStatistics', [
                'error' => $exception->getMessage()
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém leads por status.
     */
    public function getLeadsByStatus(string $status, array $filters = []): array
    {
        try {
            $filters['status'] = $status;
            return $this->leadRepository->getByFilters($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadStatusService::getLeadsByStatus', [
                'error' => $exception->getMessage(),
                'status' => $status,
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém contagem de leads por status.
     */
    public function getLeadsCountByStatus(): array
    {
        try {
            return $this->leadRepository->getCountByStatus();
        } catch (\Throwable $exception) {
            Log::error('Error in LeadStatusService::getLeadsCountByStatus', [
                'error' => $exception->getMessage()
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém taxa de conversão por status.
     */
    public function getConversionRateByStatus(): array
    {
        try {
            $statusCounts = $this->getLeadsCountByStatus();
            $totalLeads = array_sum($statusCounts);

            if ($totalLeads === 0) {
                return [];
            }

            $conversionRates = [];
            foreach ($statusCounts as $status => $count) {
                $conversionRates[$status] = ($count / $totalLeads) * 100;
            }

            return $conversionRates;
        } catch (\Throwable $exception) {
            Log::error('Error in LeadStatusService::getConversionRateByStatus', [
                'error' => $exception->getMessage()
            ]);

            throw $exception;
        }
    }
}
