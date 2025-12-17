<?php

namespace App\Domains\Universe\Application\Handlers;

use App\Domains\Universe\Application\Queries\GetUniverseInstanceQuery;
use App\Domains\Universe\Domain\Repositories\UniverseInstanceRepositoryInterface;
use App\Domains\Universe\Domain\Services\UniverseInstanceService;
use App\Domains\Universe\Domain\Services\UniverseAnalyticsService;
use Illuminate\Support\Facades\Log;

class GetUniverseInstanceHandler
{
    public function __construct(
        private UniverseInstanceRepositoryInterface $universeInstanceRepository,
        private UniverseInstanceService $universeInstanceService,
        private UniverseAnalyticsService $analyticsService
    ) {
    }

    public function handle(GetUniverseInstanceQuery $query): ?array
    {
        try {
            // Buscar instância
            $universeInstance = $this->universeInstanceRepository->findById($query->instanceId);

            if (!$universeInstance) {
                return null;
            }

            // Validar acesso do usuário
            if ($universeInstance->user_id !== $query->userId) {
                throw new \Exception('Usuário não tem permissão para visualizar esta instância');
            }

            // Enriquecer dados se solicitado
            $instanceData = $universeInstance->toArray();

            if ($query->includeAnalytics) {
                $instanceData['analytics'] = $this->analyticsService->getInstanceAnalytics($universeInstance);
            }

            if ($query->includePerformance) {
                $instanceData['performance'] = $this->analyticsService->getInstancePerformance($universeInstance);
            }

            if ($query->includeTemplate) {
                $instanceData['template'] = $this->universeInstanceService->getInstanceTemplate($universeInstance);
            }

            if ($query->includeSharing) {
                $instanceData['sharing'] = $this->universeInstanceService->getInstanceSharing($universeInstance);
            }

            Log::info('Universe instance retrieved successfully', [
                'instance_id' => $query->instanceId,
                'user_id' => $query->userId
            ]);

            return $instanceData;
        } catch (\Exception $e) {
            Log::error('Error retrieving universe instance', [
                'instance_id' => $query->instanceId,
                'user_id' => $query->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }
}
