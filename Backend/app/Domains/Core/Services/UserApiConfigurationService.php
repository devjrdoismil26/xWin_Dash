<?php

namespace App\Domains\Core\Services;

use App\Domains\Core\Models\UserApiConfiguration; // Supondo que este model exista
use Illuminate\Support\Collection;

class UserApiConfigurationService
{
    /**
     * Cria uma nova configuração de API para um usuário.
     *
     * @param string   $userId
     * @param array $data
     *
     * @return UserApiConfiguration
     */
    public function createConfiguration(string $userId, array $data): UserApiConfiguration
    {
        return UserApiConfiguration::create(array_merge($data, ['user_id' => $userId]));
    }

    /**
     * Obtém todas as configurações de API para um usuário.
     *
     * @param string $userId
     *
     * @return \Illuminate\Support\Collection
     */
    public function getConfigurationsForUser(string $userId): \Illuminate\Support\Collection
    {
        return UserApiConfiguration::where('user_id', $userId)->get();
    }

    /**
     * Atualiza uma configuração de API existente para um usuário.
     *
     * @param string   $userId
     * @param int   $configurationId
     * @param array $data
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function updateConfiguration(string $userId, int $configurationId, array $data): ?\Illuminate\Database\Eloquent\Model
    {
        $configuration = UserApiConfiguration::where('user_id', $userId)->find($configurationId);
        if ($configuration) {
            $configuration->update($data);
        }
        return $configuration;
    }

    /**
     * Deleta uma configuração de API para um usuário.
     *
     * @param string $userId
     * @param int $configurationId
     *
     * @return bool
     */
    public function deleteConfiguration(string $userId, int $configurationId): bool
    {
        $configuration = UserApiConfiguration::where('user_id', $userId)->find($configurationId);
        if ($configuration) {
            return (bool) $configuration->delete();
        }
        return false;
    }
}
