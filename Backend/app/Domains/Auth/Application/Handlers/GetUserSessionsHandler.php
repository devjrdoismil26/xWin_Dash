<?php

namespace App\Domains\Auth\Application\Handlers;

use App\Domains\Auth\Application\Queries\GetUserSessionsQuery;
use App\Domains\Auth\Domain\Services\SessionService;
use Illuminate\Support\Facades\Log;

class GetUserSessionsHandler
{
    public function __construct(
        private SessionService $sessionService
    ) {
    }

    public function handle(GetUserSessionsQuery $query): array
    {
        try {
            // Validar dados da query
            $this->validateQuery($query);

            // Buscar sessões do usuário
            $sessions = $this->sessionService->getUserSessions(
                $query->userId,
                $query->activeOnly,
                $query->page,
                $query->perPage
            );

            Log::info('User sessions retrieved successfully', [
                'user_id' => $query->userId,
                'count' => count($sessions['data'] ?? [])
            ]);

            return $sessions;
        } catch (\Exception $e) {
            Log::error('Error retrieving user sessions', [
                'user_id' => $query->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateQuery(GetUserSessionsQuery $query): void
    {
        if (empty($query->userId)) {
            throw new \InvalidArgumentException('ID do usuário é obrigatório');
        }
    }
}
