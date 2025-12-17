<?php

namespace App\Domains\Integrations\Services;

use App\Domains\Integrations\Domain\ApiCredential; // Supondo que a entidade de domínio exista
use App\Domains\Integrations\Domain\ApiCredentialRepositoryInterface; // Supondo que a interface do repositório exista
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;

class CredentialService
{
    protected ApiCredentialRepositoryInterface $repository;

    public function __construct(ApiCredentialRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Cria e armazena uma nova credencial de API.
     *
     * @param array $data dados da credencial (incluindo 'name', 'platform', 'credentials', 'user_id')
     *
     * @return ApiCredential
     *
     * @throws \Exception se a criação falhar
     */
    public function createCredential(array $data): ApiCredential
    {
        Log::info("Criando credencial de API para plataforma: {$data['platform']}.");
        try {
            $encryptedCredentials = $this->encryptCredentials($data['credentials']);
            $data['credentials'] = $encryptedCredentials;
            $credential = $this->repository->create($data);
            return $credential;
        } catch (\Exception $e) {
            Log::error("Falha ao criar credencial de API: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Busca uma credencial de API pelo ID e a retorna descriptografada.
     *
     * @param int $id o ID da credencial
     *
     * @return ApiCredential|null
     */
    public function getCredential(int $id): ?ApiCredential
    {
        $credential = $this->repository->find($id);
        if ($credential) {
            $credential->credentials = $this->decryptCredentials($credential->credentials);
        }
        return $credential;
    }

    /**
     * Atualiza uma credencial de API existente.
     *
     * @param int   $id   o ID da credencial a ser atualizada
     * @param array $data os dados a serem atualizados
     *
     * @return ApiCredential
     *
     * @throws \Exception se a atualização falhar
     */
    public function updateCredential(int $id, array $data): ApiCredential
    {
        Log::info("Atualizando credencial de API ID: {$id}.");
        try {
            if (isset($data['credentials'])) {
                $data['credentials'] = $this->encryptCredentials($data['credentials']);
            }
            $credential = $this->repository->update($id, $data);
            $credential->credentials = $this->decryptCredentials($credential->credentials); // Retorna descriptografado
            return $credential;
        } catch (\Exception $e) {
            Log::error("Falha ao atualizar credencial de API ID: {$id}: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Deleta uma credencial de API.
     *
     * @param int $id o ID da credencial a ser deletada
     *
     * @return bool
     */
    public function deleteCredential(int $id): bool
    {
        Log::info("Deletando credencial de API ID: {$id}.");
        return $this->repository->delete($id);
    }

    /**
     * Criptografa os dados da credencial.
     *
     * @param array $credentials
     *
     * @return array
     */
    protected function encryptCredentials(array $credentials): array
    {
        $encrypted = [];
        foreach ($credentials as $key => $value) {
            $encrypted[$key] = Crypt::encryptString($value);
        }
        return $encrypted;
    }

    /**
     * Descriptografa os dados da credencial.
     *
     * @param array $encryptedCredentials
     *
     * @return array
     */
    protected function decryptCredentials(array $encryptedCredentials): array
    {
        $decrypted = [];
        foreach ($encryptedCredentials as $key => $value) {
            $decrypted[$key] = Crypt::decryptString($value);
        }
        return $decrypted;
    }
}
