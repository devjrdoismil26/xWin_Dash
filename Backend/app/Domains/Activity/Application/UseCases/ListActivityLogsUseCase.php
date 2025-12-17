<?php

namespace App\Domains\Activity\Application\UseCases;

use App\Domains\Activity\Application\Queries\ListActivityLogsQuery;
use App\Domains\Activity\Application\Handlers\ListActivityLogsHandler;
use App\Domains\Activity\Application\Services\ActivityApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;

class ListActivityLogsUseCase
{
    public function __construct(
        private ListActivityLogsHandler $listActivityLogsHandler,
        private ActivityApplicationService $applicationService,
        private CrossModuleValidationService $validationService
    ) {
    }

    public function execute(ListActivityLogsQuery $query): array
    {
        try {
            // Validar permissões cross-module
            $this->validationService->validateUserAccess(null, 'activity', 'list_logs');

            // Executar query via handler
            $result = $this->listActivityLogsHandler->handle($query);

            Log::info('Activity logs listed successfully', [
                'count' => count($result['data'] ?? [])
            ]);

            return [
                'success' => true,
                'data' => $result['data'] ?? [],
                'pagination' => $result['pagination'] ?? null,
                'message' => 'Logs de atividade listados com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error listing activity logs', [
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao listar logs de atividade: ' . $e->getMessage()
            ];
        }
    }
}
