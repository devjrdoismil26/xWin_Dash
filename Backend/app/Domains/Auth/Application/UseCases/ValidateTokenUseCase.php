<?php

namespace App\Domains\Auth\Application\UseCases;

use App\Domains\Auth\Application\Queries\ValidateTokenQuery;
use App\Domains\Auth\Application\Handlers\ValidateTokenHandler;
use App\Domains\Auth\Application\Services\AuthApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;

class ValidateTokenUseCase
{
    public function __construct(
        private ValidateTokenHandler $validateTokenHandler,
        private AuthApplicationService $applicationService,
        private CrossModuleValidationService $validationService
    ) {
    }

    public function execute(ValidateTokenQuery $query): array
    {
        try {
            // Executar query via handler
            $result = $this->validateTokenHandler->handle($query);

            if (!$result) {
                return [
                    'success' => false,
                    'message' => 'Token inválido ou expirado'
                ];
            }

            Log::info('Token validated successfully', [
                'user_id' => $result['user']['id']
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Token válido'
            ];
        } catch (\Exception $e) {
            Log::error('Error validating token', [
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao validar token: ' . $e->getMessage()
            ];
        }
    }
}
