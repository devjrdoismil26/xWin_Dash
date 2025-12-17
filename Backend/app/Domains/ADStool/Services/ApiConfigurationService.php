<?php

namespace App\Domains\ADStool\Services;

use App\Domains\ADStool\Models\ApiSettingModel;
use Illuminate\Support\Facades\Crypt;

/**
 * Serviço para gerenciar o armazenamento e a recuperação de configurações de API.
 */
class ApiConfigurationService
{
    /**
     * Salva ou atualiza a configuração de API para um usuário e uma plataforma.
     *
     * @param int    $userId
     * @param string $platform
     * @param array  $credentials
     *
     * @return ApiSettingModel
     */
    /**
     * @param array<string, mixed> $credentials
     */
    public function saveConfiguration(int $userId, string $platform, array $credentials): ApiSettingModel
    {
        // Criptografa as credenciais antes de salvar no banco de dados
        $jsonCredentials = json_encode($credentials);
        if ($jsonCredentials === false) {
            throw new \InvalidArgumentException('Invalid credentials format');
        }
        $encryptedCredentials = Crypt::encryptString($jsonCredentials);

        return \App\Domains\ADStool\Models\ApiSettingModel::updateOrCreate(
            [
                'user_id' => $userId,
                'platform' => $platform,
            ],
            [
                'credentials' => $encryptedCredentials,
            ],
        );
    }

    /**
     * Obtém a configuração de API para um usuário e plataforma.
     *
     * @param int    $userId
     * @param string $platform
     *
     * @return array<string, mixed>|null
     */
    public function getConfigurationForUser(int $userId, string $platform): ?array
    {
        $apiSetting = ApiSettingModel::where('user_id', $userId)
            ->where('platform', $platform)
            ->first();

        if (!$apiSetting) {
            return null;
        }

        // Descriptografa as credenciais ao recuperá-las
        try {
            return json_decode(Crypt::decryptString($apiSetting->credentials), true);
        } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
            // Tratar erro de descriptografia, talvez as credenciais estejam corrompidas
            return null;
        }
    }

    /**
     * Remove a configuração de API para um usuário e plataforma.
     *
     * @param int    $userId
     * @param string $platform
     *
     * @return bool
     */
    public function deleteConfiguration(int $userId, string $platform): bool
    {
        return ApiSettingModel::where('user_id', $userId)
            ->where('platform', $platform)
            ->delete();
    }
}
