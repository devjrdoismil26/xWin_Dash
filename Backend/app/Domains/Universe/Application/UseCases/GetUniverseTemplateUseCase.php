<?php

namespace App\Domains\Universe\Application\UseCases;

use App\Domains\Universe\Application\Queries\GetUniverseTemplateQuery;
use App\Domains\Universe\Application\Handlers\GetUniverseTemplateHandler;
use App\Domains\Universe\Domain\Services\CrossModuleValidationServiceInterface;
use Illuminate\Support\Facades\Log;

class GetUniverseTemplateUseCase
{
    public function __construct(
        private GetUniverseTemplateHandler $getHandler,
        private CrossModuleValidationServiceInterface $crossModuleValidator
    ) {
    }

    public function execute(GetUniverseTemplateQuery $query): array
    {
        try {
            // Validar query
            if (!$query->isValid()) {
                return [
                    'success' => false,
                    'errors' => $query->getValidationErrors(),
                    'message' => 'Dados inválidos para busca do template'
                ];
            }

            // Validar permissões cross-module
            $permissionValidation = $this->crossModuleValidator->validateUniverseTemplateAccess($query);
            if (!$permissionValidation['valid']) {
                return [
                    'success' => false,
                    'errors' => $permissionValidation['errors'],
                    'message' => 'Acesso negado ao template'
                ];
            }

            // Executar busca
            $template = $this->getHandler->handle($query);

            Log::info('Universe Template retrieved successfully via Use Case', [
                'template_id' => $query->templateId,
                'user_id' => $query->userId
            ]);

            return [
                'success' => true,
                'message' => 'Template obtido com sucesso',
                'data' => $template
            ];
        } catch (\Throwable $exception) {
            Log::error('Error in GetUniverseTemplateUseCase', [
                'error' => $exception->getMessage(),
                'template_id' => $query->templateId,
                'user_id' => $query->userId
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante obtenção do template'],
                'message' => 'Falha ao obter template'
            ];
        }
    }
}
