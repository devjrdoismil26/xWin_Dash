<?php

namespace App\Domains\Leads\Services;

use App\Domains\Leads\Domain\LeadHistory; // Supondo que a entidade de domínio exista
use App\Domains\Leads\Domain\LeadHistoryRepositoryInterface; // Supondo que o repositório exista
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class LeadHistoryService
{
    protected LeadHistoryRepositoryInterface $leadHistoryRepository;

    public function __construct(LeadHistoryRepositoryInterface $leadHistoryRepository)
    {
        $this->leadHistoryRepository = $leadHistoryRepository;
    }

    /**
     * Registra uma nova atividade no histórico de um Lead.
     *
     * @param int    $leadId
     * @param string $eventType
     * @param string $description
     * @param array  $properties
     *
     * @return LeadHistory
     */
    public function recordActivity(int $leadId, string $eventType, string $description, array $properties = []): LeadHistory
    {
        Log::info("Registrando atividade para Lead ID: {$leadId} - Tipo: {$eventType}");

        return $this->leadHistoryRepository->create([
            'lead_id' => $leadId,
            'event_type' => $eventType,
            'description' => $description,
            'properties' => $properties,
            'causer_id' => Auth::id(), // Opcional: ID do usuário que causou a atividade
        ]);
    }

    /**
     * Obtém o histórico de atividades para um Lead específico.
     *
     * @param int $leadId
     * @param int $perPage
     *
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getLeadHistory(int $leadId, int $perPage = 15)
    {
        // Assumindo que o repositório tem um método para paginação ou que a paginação é feita aqui
        // Por simplicidade, retornando um array direto do repositório
        return $this->leadHistoryRepository->getByLeadId($leadId);
    }

    /**
     * Obtém uma entrada de histórico pelo seu ID.
     *
     * @param int $historyId
     *
     * @return LeadHistory|null
     */
    public function getHistoryEntryById(int $historyId): ?LeadHistory
    {
        return $this->leadHistoryRepository->find($historyId);
    }
}
