<?php

namespace App\Domains\SocialBuffer\Application\UseCases;

use App\Domains\SocialBuffer\Application\Queries\GetPostQuery;
use App\Domains\SocialBuffer\Application\Handlers\GetPostHandler;
use App\Domains\SocialBuffer\Application\Services\SocialBufferApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;

class GetPostUseCase
{
    public function __construct(
        private GetPostHandler $getPostHandler,
        private SocialBufferApplicationService $applicationService,
        private CrossModuleValidationService $validationService
    ) {
    }

    public function execute(GetPostQuery $query): array
    {
        try {
            // Validar permissões cross-module
            $this->validationService->validateUserAccess($query->userId, 'socialbuffer', 'view_post');

            // Executar query via handler
            $result = $this->getPostHandler->handle($query);

            if (!$result) {
                return [
                    'success' => false,
                    'message' => 'Post não encontrado'
                ];
            }

            Log::info('Post retrieved successfully', [
                'post_id' => $query->postId,
                'user_id' => $query->userId
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Post recuperado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error retrieving post', [
                'post_id' => $query->postId,
                'user_id' => $query->userId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao recuperar post: ' . $e->getMessage()
            ];
        }
    }
}
