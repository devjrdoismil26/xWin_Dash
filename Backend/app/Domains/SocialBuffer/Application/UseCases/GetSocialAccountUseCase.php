<?php

namespace App\Domains\SocialBuffer\Application\UseCases;

use App\Domains\SocialBuffer\Application\Queries\GetSocialAccountQuery;
use App\Domains\SocialBuffer\Application\Handlers\GetSocialAccountHandler;
use App\Domains\SocialBuffer\Application\Services\SocialBufferApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;

class GetSocialAccountUseCase
{
    public function __construct(
        private GetSocialAccountHandler $getSocialAccountHandler,
        private SocialBufferApplicationService $applicationService,
        private CrossModuleValidationService $validationService
    ) {
    }

    public function execute(GetSocialAccountQuery $query): array
    {
        try {
            // Validar permissões cross-module
            $this->validationService->validateUserAccess($query->userId, 'socialbuffer', 'view_social_account');

            // Executar query via handler
            $result = $this->getSocialAccountHandler->handle($query);

            if (!$result) {
                return [
                    'success' => false,
                    'message' => 'Conta social não encontrada'
                ];
            }

            Log::info('Social account retrieved successfully', [
                'account_id' => $query->accountId,
                'user_id' => $query->userId
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Conta social recuperada com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error retrieving social account', [
                'account_id' => $query->accountId,
                'user_id' => $query->userId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao recuperar conta social: ' . $e->getMessage()
            ];
        }
    }
}
