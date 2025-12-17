<?php

namespace App\Domains\Leads\Services;

use App\Domains\Leads\Contracts\LeadServiceInterface;
use App\Domains\Leads\Domain\Lead;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;

/**
 * Serviço principal para leads
 *
 * Delega operações para serviços especializados
 */
class LeadService implements LeadServiceInterface
{
    protected LeadManagementService $leadManagementService;
    protected LeadStatusService $leadStatusService;

    public function __construct(
        LeadManagementService $leadManagementService,
        LeadStatusService $leadStatusService
    ) {
        $this->leadManagementService = $leadManagementService;
        $this->leadStatusService = $leadStatusService;
    }

    // ===== MANAGEMENT OPERATIONS =====

    /**
     * Cria um novo Lead.
     */
    public function createLead(array $data): Lead
    {
        try {
            return $this->leadManagementService->createLead($data);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadService::createLead', [
                'error' => $exception->getMessage(),
                'data' => $data
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém um Lead pelo seu ID.
     */
    public function getLeadById(int $id): ?Lead
    {
        try {
            return $this->leadManagementService->getLeadById($id);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadService::getLeadById', [
                'error' => $exception->getMessage(),
                'leadId' => $id
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém um Lead pelo email.
     */
    public function getLeadByEmail(string $email): ?Lead
    {
        try {
            return $this->leadManagementService->getLeadByEmail($email);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadService::getLeadByEmail', [
                'error' => $exception->getMessage(),
                'email' => $email
            ]);

            throw $exception;
        }
    }

    /**
     * Atualiza um Lead existente.
     */
    public function updateLead(int $id, array $data): Lead
    {
        try {
            return $this->leadManagementService->updateLead($id, $data);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadService::updateLead', [
                'error' => $exception->getMessage(),
                'leadId' => $id,
                'data' => $data
            ]);

            throw $exception;
        }
    }

    /**
     * Remove um Lead.
     */
    public function deleteLead(int $id): bool
    {
        try {
            return $this->leadManagementService->deleteLead($id);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadService::deleteLead', [
                'error' => $exception->getMessage(),
                'leadId' => $id
            ]);

            throw $exception;
        }
    }

    /**
     * Lista leads com filtros.
     */
    public function listLeads(array $filters = []): LengthAwarePaginator
    {
        try {
            return $this->leadManagementService->listLeads($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadService::listLeads', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Busca leads por termo.
     */
    public function searchLeads(string $term, array $filters = []): LengthAwarePaginator
    {
        try {
            return $this->leadManagementService->searchLeads($term, $filters);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadService::searchLeads', [
                'error' => $exception->getMessage(),
                'term' => $term,
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém leads por status.
     */
    public function getLeadsByStatus(string $status, array $filters = []): LengthAwarePaginator
    {
        try {
            return $this->leadManagementService->getLeadsByStatus($status, $filters);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadService::getLeadsByStatus', [
                'error' => $exception->getMessage(),
                'status' => $status,
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém leads por segmento.
     */
    public function getLeadsBySegment(int $segmentId, array $filters = []): LengthAwarePaginator
    {
        try {
            return $this->leadManagementService->getLeadsBySegment($segmentId, $filters);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadService::getLeadsBySegment', [
                'error' => $exception->getMessage(),
                'segmentId' => $segmentId,
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém leads por score.
     */
    public function getLeadsByScore(int $minScore, int $maxScore = null, array $filters = []): LengthAwarePaginator
    {
        try {
            return $this->leadManagementService->getLeadsByScore($minScore, $maxScore, $filters);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadService::getLeadsByScore', [
                'error' => $exception->getMessage(),
                'minScore' => $minScore,
                'maxScore' => $maxScore,
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
            return $this->leadManagementService->getLeadsCountByStatus();
        } catch (\Throwable $exception) {
            Log::error('Error in LeadService::getLeadsCountByStatus', [
                'error' => $exception->getMessage()
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém contagem de leads por segmento.
     */
    public function getLeadsCountBySegment(): array
    {
        try {
            return $this->leadManagementService->getLeadsCountBySegment();
        } catch (\Throwable $exception) {
            Log::error('Error in LeadService::getLeadsCountBySegment', [
                'error' => $exception->getMessage()
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém estatísticas gerais de leads.
     */
    public function getLeadsStatistics(): array
    {
        try {
            return $this->leadManagementService->getLeadsStatistics();
        } catch (\Throwable $exception) {
            Log::error('Error in LeadService::getLeadsStatistics', [
                'error' => $exception->getMessage()
            ]);

            throw $exception;
        }
    }

    /**
     * Verifica se lead existe.
     */
    public function leadExists(int $id): bool
    {
        try {
            return $this->leadManagementService->leadExists($id);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadService::leadExists', [
                'error' => $exception->getMessage(),
                'leadId' => $id
            ]);

            return false;
        }
    }

    /**
     * Verifica se lead existe por email.
     */
    public function leadExistsByEmail(string $email): bool
    {
        try {
            return $this->leadManagementService->leadExistsByEmail($email);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadService::leadExistsByEmail', [
                'error' => $exception->getMessage(),
                'email' => $email
            ]);

            return false;
        }
    }

    // ===== STATUS OPERATIONS =====

    /**
     * Atualiza o status de um lead.
     */
    public function updateLeadStatus(int $leadId, string $newStatus, ?string $reason = null): Lead
    {
        try {
            return $this->leadStatusService->updateLeadStatus($leadId, $newStatus, $reason);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadService::updateLeadStatus', [
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
            return $this->leadStatusService->qualifyLead($leadId, $reason);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadService::qualifyLead', [
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
            return $this->leadStatusService->disqualifyLead($leadId, $reason);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadService::disqualifyLead', [
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
            return $this->leadStatusService->convertLead($leadId, $reason);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadService::convertLead', [
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
            return $this->leadStatusService->loseLead($leadId, $reason);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadService::loseLead', [
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
            return $this->leadStatusService->contactLead($leadId, $reason);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadService::contactLead', [
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
            return $this->leadStatusService->negotiateLead($leadId, $reason);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadService::negotiateLead', [
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
            return $this->leadStatusService->followUpLead($leadId, $reason);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadService::followUpLead', [
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
            return $this->leadStatusService->canChangeStatus($leadId, $newStatus);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadService::canChangeStatus', [
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
            return $this->leadStatusService->getStatusHistory($leadId);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadService::getStatusHistory', [
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
            return $this->leadStatusService->getStatusStatistics();
        } catch (\Throwable $exception) {
            Log::error('Error in LeadService::getStatusStatistics', [
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
            return $this->leadStatusService->getConversionRateByStatus();
        } catch (\Throwable $exception) {
            Log::error('Error in LeadService::getConversionRateByStatus', [
                'error' => $exception->getMessage()
            ]);

            throw $exception;
        }
    }

    /**
     * Retorna todos os Leads paginados, conforme a interface.
     * Delega a chamada para o método listLeads.
     */
    public function getAllLeads(int $perPage = 15): LengthAwarePaginator
    {
        try {
            return $this->listLeads(['per_page' => $perPage]);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadService::getAllLeads', [
                'error' => $exception->getMessage(),
                'perPage' => $perPage
            ]);

            throw $exception;
        }
    }
}
