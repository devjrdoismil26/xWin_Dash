<?php

namespace App\Domains\Universe\Application\Handlers;

use App\Domains\Universe\Application\Queries\GetUniverseTemplateQuery;
use App\Domains\Universe\Domain\Repositories\UniverseTemplateRepositoryInterface;
use App\Domains\Universe\Domain\Services\UniverseTemplateService;
use Illuminate\Support\Facades\Log;

class GetUniverseTemplateHandler
{
    public function __construct(
        private UniverseTemplateRepositoryInterface $universeTemplateRepository,
        private UniverseTemplateService $universeTemplateService
    ) {
    }

    public function handle(GetUniverseTemplateQuery $query): ?array
    {
        try {
            // Buscar template
            $universeTemplate = $this->universeTemplateRepository->findById($query->templateId);

            if (!$universeTemplate) {
                return null;
            }

            // Validar acesso do usuário (templates públicos ou do próprio usuário)
            if (!$universeTemplate->is_public && $universeTemplate->user_id !== $query->userId) {
                throw new \Exception('Usuário não tem permissão para visualizar este template');
            }

            // Enriquecer dados se solicitado
            $templateData = $universeTemplate->toArray();

            if ($query->includeInstances) {
                $templateData['instances'] = $this->universeTemplateService->getTemplateInstances($universeTemplate, $query->instancesLimit ?? 10);
            }

            if ($query->includeUsage) {
                $templateData['usage_stats'] = $this->universeTemplateService->getTemplateUsageStats($universeTemplate);
            }

            Log::info('Universe template retrieved successfully', [
                'template_id' => $query->templateId,
                'user_id' => $query->userId
            ]);

            return $templateData;
        } catch (\Exception $e) {
            Log::error('Error retrieving universe template', [
                'template_id' => $query->templateId,
                'user_id' => $query->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }
}
