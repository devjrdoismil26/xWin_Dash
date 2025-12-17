<?php

namespace App\Domains\SocialBuffer\Application\UseCases;

use App\Domains\SocialBuffer\Application\Queries\ListPostsQuery;
use App\Domains\SocialBuffer\Application\Handlers\ListPostsHandler;
use App\Domains\SocialBuffer\Application\Services\SocialBufferApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;

class ListPostsUseCase
{
    public function __construct(
        private ListPostsHandler $listPostsHandler,
        private SocialBufferApplicationService $applicationService,
        private CrossModuleValidationService $validationService
    ) {
    }

    public function execute(ListPostsQuery $query): array
    {
        try {
            // Validar permissões cross-module
            $this->validationService->validateUserAccess($query->userId, 'socialbuffer', 'list_posts');

            // Executar query via handler
            $result = $this->listPostsHandler->handle($query);

            Log::info('Posts listed successfully', [
                'user_id' => $query->userId,
                'count' => count($result['data'] ?? [])
            ]);

            return [
                'success' => true,
                'data' => $result['data'] ?? [],
                'pagination' => $result['pagination'] ?? null,
                'message' => 'Posts listados com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error listing posts', [
                'user_id' => $query->userId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao listar posts: ' . $e->getMessage()
            ];
        }
    }
}
