<?php

namespace App\Domains\Leads\Services;

use App\Domains\Leads\Contracts\LeadRepositoryInterface;
use App\Domains\Leads\Domain\Lead;
use App\Domains\Leads\Events\LeadCreated;
use App\Domains\Leads\Events\LeadDeleted;
use App\Domains\Leads\Events\LeadUpdated;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;

/**
 * Serviço especializado para gerenciamento de leads
 */
class LeadManagementService
{
    protected LeadRepositoryInterface $leadRepository;

    public function __construct(LeadRepositoryInterface $leadRepository)
    {
        $this->leadRepository = $leadRepository;
    }

    /**
     * Cria um novo Lead.
     */
    public function createLead(array $data): Lead
    {
        try {
            $lead = $this->leadRepository->create($data);
            LeadCreated::dispatch($lead);
            Log::info("Lead criado: {$lead->email}");
            return $lead;
        } catch (\Throwable $exception) {
            Log::error('Error in LeadManagementService::createLead', [
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
            return $this->leadRepository->find($id);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadManagementService::getLeadById', [
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
            return $this->leadRepository->findByEmail($email);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadManagementService::getLeadByEmail', [
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
            $lead = $this->leadRepository->update($id, $data);
            LeadUpdated::dispatch($lead);
            Log::info("Lead atualizado: {$lead->email}");
            return $lead;
        } catch (\Throwable $exception) {
            Log::error('Error in LeadManagementService::updateLead', [
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
            $lead = $this->leadRepository->find($id);
            if (!$lead) {
                return false;
            }

            $result = $this->leadRepository->delete($id);
            if ($result) {
                LeadDeleted::dispatch($lead);
                Log::info("Lead removido: {$lead->email}");
            }

            return $result;
        } catch (\Throwable $exception) {
            Log::error('Error in LeadManagementService::deleteLead', [
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
            return $this->leadRepository->paginate($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadManagementService::listLeads', [
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
            $filters['search'] = $term;
            return $this->leadRepository->paginate($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadManagementService::searchLeads', [
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
            $filters['status'] = $status;
            return $this->leadRepository->paginate($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadManagementService::getLeadsByStatus', [
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
            $filters['segment_id'] = $segmentId;
            return $this->leadRepository->paginate($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadManagementService::getLeadsBySegment', [
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
            $filters['min_score'] = $minScore;
            if ($maxScore !== null) {
                $filters['max_score'] = $maxScore;
            }
            return $this->leadRepository->paginate($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadManagementService::getLeadsByScore', [
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
            return $this->leadRepository->getCountByStatus();
        } catch (\Throwable $exception) {
            Log::error('Error in LeadManagementService::getLeadsCountByStatus', [
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
            return $this->leadRepository->getCountBySegment();
        } catch (\Throwable $exception) {
            Log::error('Error in LeadManagementService::getLeadsCountBySegment', [
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
            return [
                'total_leads' => $this->leadRepository->count(),
                'leads_by_status' => $this->getLeadsCountByStatus(),
                'leads_by_segment' => $this->getLeadsCountBySegment(),
                'average_score' => $this->leadRepository->getAverageScore(),
                'conversion_rate' => $this->leadRepository->getConversionRate(),
            ];
        } catch (\Throwable $exception) {
            Log::error('Error in LeadManagementService::getLeadsStatistics', [
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
            return $this->leadRepository->exists($id);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadManagementService::leadExists', [
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
            return $this->leadRepository->existsByEmail($email);
        } catch (\Throwable $exception) {
            Log::error('Error in LeadManagementService::leadExistsByEmail', [
                'error' => $exception->getMessage(),
                'email' => $email
            ]);

            return false;
        }
    }
}
