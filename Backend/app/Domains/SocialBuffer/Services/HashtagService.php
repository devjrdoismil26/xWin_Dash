<?php

namespace App\Domains\SocialBuffer\Services;

use App\Domains\SocialBuffer\Domain\HashtagGroup; // Supondo que a entidade de domínio exista
use App\Domains\SocialBuffer\Domain\HashtagGroupRepositoryInterface; // Supondo que o repositório exista
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;

class HashtagService
{
    protected HashtagGroupRepositoryInterface $hashtagGroupRepository;

    public function __construct(HashtagGroupRepositoryInterface $hashtagGroupRepository)
    {
        $this->hashtagGroupRepository = $hashtagGroupRepository;
    }

    /**
     * Cria um novo grupo de hashtags.
     *
     * @param int   $userId o ID do usuário criador
     * @param array $data   dados do grupo de hashtags (name, hashtags)
     *
     * @return HashtagGroup
     */
    public function createHashtagGroup(int $userId, array $data): HashtagGroup
    {
        $data['user_id'] = $userId;
        $hashtagGroup = $this->hashtagGroupRepository->create($data);
        Log::info("Grupo de hashtag criado: {$hashtagGroup->name} (ID: {$hashtagGroup->id}).");
        return $hashtagGroup;
    }

    /**
     * Obtém um grupo de hashtags pelo seu ID.
     *
     * @param int $id o ID do grupo de hashtags
     *
     * @return HashtagGroup|null
     */
    public function getHashtagGroupById(int $id): ?HashtagGroup
    {
        return $this->hashtagGroupRepository->find($id);
    }

    /**
     * Atualiza um grupo de hashtags existente.
     *
     * @param int   $id   o ID do grupo de hashtags
     * @param array $data dados para atualização
     *
     * @return HashtagGroup
     */
    public function updateHashtagGroup(int $id, array $data): HashtagGroup
    {
        $hashtagGroup = $this->hashtagGroupRepository->update($id, $data);
        Log::info("Grupo de hashtag atualizado: {$hashtagGroup->name} (ID: {$hashtagGroup->id}).");
        return $hashtagGroup;
    }

    /**
     * Deleta um grupo de hashtags pelo seu ID.
     *
     * @param int $id o ID do grupo de hashtags
     *
     * @return bool
     */
    public function deleteHashtagGroup(int $id): bool
    {
        $success = $this->hashtagGroupRepository->delete($id);
        if ($success) {
            Log::info("Grupo de hashtag ID: {$id} deletado com sucesso.");
        }
        return $success;
    }

    /**
     * Retorna todos os grupos de hashtags paginados para um usuário.
     *
     * @param int $userId  o ID do usuário
     * @param int $perPage número de itens por página
     *
     * @return LengthAwarePaginator
     */
    public function getAllHashtagGroups(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->hashtagGroupRepository->getAllPaginated($userId, $perPage);
    }
}
