<?php

namespace App\Domains\AI\Application\UseCases;

use App\Domains\AI\Application\Queries\ListChatbotsQuery;
use App\Domains\AI\Application\Handlers\ListChatbotsHandler;
use App\Domains\AI\Application\Services\AIApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;

class ListChatbotsUseCase
{
    public function __construct(
        private ListChatbotsHandler $listChatbotsHandler,
        private AIApplicationService $applicationService,
        private CrossModuleValidationService $validationService
    ) {
    }

    public function execute(ListChatbotsQuery $query): array
    {
        try {
            // Validar permissões cross-module
            $this->validationService->validateUserAccess(null, 'ai', 'list_chatbots');

            // Executar query via handler
            $result = $this->listChatbotsHandler->handle($query);

            Log::info('Chatbots listed successfully', [
                'count' => count($result['data'] ?? [])
            ]);

            return [
                'success' => true,
                'data' => $result['data'] ?? [],
                'pagination' => $result['pagination'] ?? null,
                'message' => 'Chatbots listados com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error listing chatbots', [
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao listar chatbots: ' . $e->getMessage()
            ];
        }
    }
}
