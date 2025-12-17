<?php

namespace App\Domains\ADStool\Services;

use App\Domains\ADStool\Contracts\ADSCampaignRepositoryInterface;
use App\Domains\ADStool\DTOs\CampaignCreatedEventDTO;
use App\Domains\ADStool\DTOs\CampaignCreationDTO;
use App\Domains\ADStool\DTOs\UpdateCampaignDTO;
use App\Domains\ADStool\Events\CampaignCreated;
use App\Domains\ADStool\Exceptions\CampaignNotFoundException;
use App\Domains\ADStool\Models\ADSCampaign;
use Illuminate\Support\Facades\Auth;

/**
 * Serviço para gerenciar a lógica de negócio de Campanhas de Anúncios.
 */
class CampaignService
{
    /**
     * @var ADSCampaignRepositoryInterface
     */
    protected ADSCampaignRepositoryInterface $campaignRepository;

    /**
     * @param ADSCampaignRepositoryInterface $campaignRepository
     */
    public function __construct(ADSCampaignRepositoryInterface $campaignRepository)
    {
        $this->campaignRepository = $campaignRepository;
    }

    /**
     * Cria uma nova campanha.
     *
     * @param CampaignCreationDTO $dto
     *
     * @return ADSCampaign
     */
    public function createCampaign(CampaignCreationDTO $dto): ADSCampaign
    {
        $data = $dto->toArray();
        $data['user_id'] = Auth::id();

        $campaign = $this->campaignRepository->create($data);

        // Dispara um evento para notificar outras partes do sistema
        CampaignCreated::dispatch(CampaignCreatedEventDTO::fromModel($campaign));

        return $campaign;
    }

    /**
     * Atualiza uma campanha existente.
     *
     * @param int               $campaignId
     * @param UpdateCampaignDTO|array $data
     *
     * @return ADSCampaign
     */
    public function updateCampaign(int $campaignId, $data): ADSCampaign
    {
        if ($data instanceof UpdateCampaignDTO) {
            return $this->campaignRepository->update((string) $campaignId, $data->toArray());
        }

        return $this->campaignRepository->update((string) $campaignId, $data);
    }

    /**
     * Obtém uma campanha pelo ID.
     *
     * @param int $campaignId
     *
     * @return ADSCampaign|null
     */
    public function getCampaignById(int $campaignId): ?ADSCampaign
    {
        return $this->campaignRepository->find((string) $campaignId);
    }

    /**
     * Atualiza uma campanha com dados da plataforma externa (ex: ID externo).
     *
     * @param int   $campaignId
     * @param array $platformData
     *
     * @return ADSCampaign
     */
    /**
     * @param array<string, mixed> $platformData
     */
    public function updateCampaignWithPlatformData(int $campaignId, array $platformData): ADSCampaign
    {
        $updateData = [
            'platform_campaign_id' => $platformData['id'],
            'platform_status' => $platformData['status'],
        ];
        return $this->campaignRepository->update((string) $campaignId, $updateData);
    }

    /**
     * Marca uma campanha como falha, por exemplo, se a criação na API externa falhou.
     *
     * @param int    $campaignId
     * @param string $errorMessage
     */
    public function markCampaignAsFailed(int $campaignId, string $errorMessage): void
    {
        $this->campaignRepository->update((string) $campaignId, [
            'status' => 'FAILED',
            'sync_status' => 'failed',
            'error_message' => $errorMessage,
        ]);
    }

    /**
     * Obtém resumo de analytics para um usuário.
     */
    public function getAnalyticsSummaryForUser(int $userId): \App\Domains\ADStool\DTOs\AnalyticsSummaryDTO
    {
        // Implementação básica - pode ser expandida
        return new \App\Domains\ADStool\DTOs\AnalyticsSummaryDTO(
            impressions: 0,
            clicks: 0,
            cost: 0.0,
            conversions: 0
        );
    }

    /**
     * Deleta uma campanha.
     *
     * @param int $campaignId
     *
     * @return bool
     */
    public function deleteCampaign(int $campaignId): bool
    {
        $campaign = $this->campaignRepository->find((string) $campaignId);

        if (!$campaign) {
            throw new CampaignNotFoundException("Campanha com ID {$campaignId} não encontrada.");
        }

        return $this->campaignRepository->delete((string) $campaignId);
    }

    /**
     * Obtém campanhas recentes para um usuário.
     *
     * @param int $userId
     * @param int $limit
     * @return array<int, mixed>
     */
    public function getRecentCampaignsForUser(int $userId, int $limit = 5): array
    {
        // Implementação básica - pode ser expandida
        return [];
    }

    /**
     * Obtém campanhas para um usuário com filtros
     *
     * @param int $userId
     * @param array $filters
     * @return \Illuminate\Support\Collection
     */
    public function getCampaignsForUser(int $userId, array $filters = []): \Illuminate\Support\Collection
    {
        $query = $this->campaignRepository->findByUserId($userId);

        // Aplicar filtros se fornecidos
        if (isset($filters['status'])) {
            $query = $query->where('status', $filters['status']);
        }

        if (isset($filters['platform'])) {
            $query = $query->where('platform', $filters['platform']);
        }

        if (isset($filters['search'])) {
            $query = $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        return $query;
    }

    /**
     * Pausar uma campanha
     *
     * @param int $campaignId
     * @return bool
     */
    public function pauseCampaign(int $campaignId): bool
    {
        return $this->campaignRepository->update((string) $campaignId, [
            'status' => 'PAUSED',
            'sync_status' => 'pending'
        ]);
    }

    /**
     * Retomar uma campanha
     *
     * @param int $campaignId
     * @return bool
     */
    public function resumeCampaign(int $campaignId): bool
    {
        return $this->campaignRepository->update((string) $campaignId, [
            'status' => 'ACTIVE',
            'sync_status' => 'pending'
        ]);
    }

    /**
     * Atualizar orçamento de uma campanha
     *
     * @param int $campaignId
     * @param float $dailyBudget
     * @return bool
     */
    public function updateCampaignBudget(int $campaignId, float $dailyBudget): bool
    {
        return $this->campaignRepository->update((string) $campaignId, [
            'daily_budget' => $dailyBudget,
            'sync_status' => 'pending'
        ]);
    }

    /**
     * Obter analytics de uma campanha
     *
     * @param int $campaignId
     * @return array
     */
    public function getCampaignAnalytics(int $campaignId): array
    {
        $campaign = $this->campaignRepository->find((string) $campaignId);

        if (!$campaign) {
            throw new CampaignNotFoundException("Campanha com ID {$campaignId} não encontrada.");
        }

        // Dados simulados para desenvolvimento
        // Em produção, isso viria da API do Google Ads
        return [
            'campaign_id' => $campaignId,
            'impressions' => rand(1000, 10000),
            'clicks' => rand(50, 500),
            'cost' => round(rand(100, 1000) / 100, 2),
            'conversions' => rand(5, 50),
            'ctr' => round(rand(200, 800) / 100, 2),
            'cpc' => round(rand(50, 300) / 100, 2),
            'conversion_rate' => round(rand(100, 500) / 100, 2),
            'period' => 'last_30_days',
            'last_updated' => now()->toISOString()
        ];
    }

    /**
     * Sincronizar campanha com plataforma externa
     *
     * @param int $campaignId
     * @return bool
     */
    public function syncCampaignWithPlatform(int $campaignId): bool
    {
        $campaign = $this->campaignRepository->find((string) $campaignId);

        if (!$campaign) {
            throw new CampaignNotFoundException("Campanha com ID {$campaignId} não encontrada.");
        }

        // Marcar como sincronizando
        $this->campaignRepository->update((string) $campaignId, [
            'sync_status' => 'syncing'
        ]);

        // Aqui seria feita a sincronização real com a plataforma
        // Por enquanto, apenas simular sucesso
        return $this->campaignRepository->update((string) $campaignId, [
            'sync_status' => 'synced',
            'last_sync_at' => now()
        ]);
    }
}
