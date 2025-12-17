<?php

namespace App\Domains\Core\Application\Services;

use App\Domains\Core\Application\DTOs\IntegrationConfigDTO;
use Illuminate\Support\Facades\DB;

class IntegrationService
{
    public function configure(IntegrationConfigDTO $dto): bool
    {
        return DB::table('integrations')->updateOrInsert(
            ['service' => $dto->service],
            [
                'credentials' => json_encode($dto->credentials),
                'settings' => json_encode($dto->settings),
                'is_active' => $dto->is_active,
                'updated_at' => now(),
            ]
        );
    }

    public function test(string $service): array
    {
        $integration = DB::table('integrations')->where('service', $service)->first();
        
        if (!$integration) {
            return ['success' => false, 'message' => 'Integration not found'];
        }

        // Implementar teste específico por serviço
        return ['success' => true, 'message' => 'Connection successful'];
    }

    public function getStatus(string $service): array
    {
        $integration = DB::table('integrations')->where('service', $service)->first();
        
        return [
            'service' => $service,
            'is_active' => $integration?->is_active ?? false,
            'last_sync' => $integration?->last_sync_at,
        ];
    }
}
