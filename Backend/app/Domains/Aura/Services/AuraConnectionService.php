<?php

namespace App\Domains\Aura\Services;

use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraConnectionModel;
use App\Domains\Aura\Jobs\ConnectAuraConnectionJob;
use App\Domains\Aura\Jobs\DisconnectAuraConnectionJob;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class AuraConnectionService
{
    public function create(array $data): AuraConnectionModel
    {
        return AuraConnectionModel::create([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'connection_type' => $data['provider'] ?? 'api',
            'phone_number' => $data['phone_number'],
            'business_name' => $data['business_name'] ?? null,
            'status' => 'disconnected',
            'credentials' => $data['credentials'] ?? [],
            'settings' => $data['settings'] ?? [],
            'webhook_config' => $data['webhook_config'] ?? [],
            'project_id' => $data['project_id'] ?? auth()->user()->current_project_id,
            'created_by' => auth()->id(),
        ]);
    }

    public function connect(string $connectionId): array
    {
        $connection = AuraConnectionModel::findOrFail($connectionId);
        
        dispatch(new ConnectAuraConnectionJob($connectionId));

        return [
            'success' => true,
            'message' => 'Connection process started',
            'connection_id' => $connectionId,
        ];
    }

    public function disconnect(string $connectionId): array
    {
        $connection = AuraConnectionModel::findOrFail($connectionId);
        
        dispatch(new DisconnectAuraConnectionJob($connectionId));

        return [
            'success' => true,
            'message' => 'Disconnection process started',
            'connection_id' => $connectionId,
        ];
    }

    public function getConnections(?string $userId = null): Collection
    {
        // Cache de 2 minutos para listagem de conexões
        $cacheKey = "aura_connections_{$userId}";
        
        return Cache::remember($cacheKey, 120, function () use ($userId) {
            $query = AuraConnectionModel::query();
            
            if ($userId) {
                $query->where('user_id', $userId);
            }

            // Otimização: Eager loading de relacionamentos
            return $query->with(['user', 'project'])
                ->orderBy('created_at', 'desc')
                ->get();
        });
    }

    public function updateConfig(string $connectionId, array $config): bool
    {
        $connection = AuraConnectionModel::findOrFail($connectionId);
        return $connection->update(['settings' => array_merge($connection->settings ?? [], $config)]);
    }

    public function delete(string $connectionId): bool
    {
        $connection = AuraConnectionModel::findOrFail($connectionId);
        
        if ($connection->status === 'connected') {
            $this->disconnect($connectionId);
        }

        return $connection->delete();
    }
}
