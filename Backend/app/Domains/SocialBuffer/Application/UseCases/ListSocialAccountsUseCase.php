<?php

namespace App\Domains\SocialBuffer\Application\UseCases;

use App\Domains\SocialBuffer\Application\Queries\ListSocialAccountsQuery;
use App\Domains\SocialBuffer\Application\Handlers\ListSocialAccountsHandler;
use App\Domains\SocialBuffer\Application\Services\SocialBufferApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;

class ListSocialAccountsUseCase
{
    public function __construct(
        private ListSocialAccountsHandler $listSocialAccountsHandler,
        private SocialBufferApplicationService $applicationService,
        private CrossModuleValidationService $validationService
    ) {
    }

    public function execute(ListSocialAccountsQuery $query): array
    {
        try {
            // Validar permissões cross-module
            $this->validationService->validateUserAccess($query->userId, 'socialbuffer', 'list_social_accounts');

            // Executar query via handler
            $result = $this->listSocialAccountsHandler->handle($query);

            Log::info('Social accounts listed successfully', [
                'user_id' => $query->userId,
                'count' => count($result['data'] ?? [])
            ]);

            return [
                'success' => true,
                'data' => $result['data'] ?? [],
                'pagination' => $result['pagination'] ?? null,
                'message' => 'Contas sociais listadas com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error listing social accounts', [
                'user_id' => $query->userId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao listar contas sociais: ' . $e->getMessage()
            ];
        }
    }
}
