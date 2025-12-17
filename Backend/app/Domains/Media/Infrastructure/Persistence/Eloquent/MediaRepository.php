<?php

namespace App\Domains\Media\Infrastructure\Persistence\Eloquent;

use App\Domains\Media\Contracts\MediaRepositoryInterface;
use App\Domains\Media\Models\Media as MediaModel;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class MediaRepository implements MediaRepositoryInterface
{
    protected MediaModel $model;

    public function __construct(MediaModel $model)
    {
        $this->model = $model;
    }

    /**
     * Encontra um arquivo de mídia pelo seu ID.
     */
    public function find(string $id): ?MediaModel
    {
        return $this->model->find($id);
    }

    /**
     * Retorna todos os arquivos de mídia.
     */
    public function all(array $columns = ['*']): Collection
    {
        return $this->model->select($columns)->get();
    }

    /**
     * Retorna arquivos de mídia paginados.
     */
    public function paginate(int $perPage = 15, array $columns = ['*']): LengthAwarePaginator
    {
        return $this->model->select($columns)->paginate($perPage);
    }

    /**
     * Cria um novo arquivo de mídia.
     */
    public function create(array $data): MediaModel
    {
        return $this->model->create($data);
    }

    /**
     * Atualiza um arquivo de mídia existente.
     */
    public function update(string $id, array $data): MediaModel
    {
        $media = $this->find($id);
        if (!$media) {
            throw new \RuntimeException("Media not found.");
        }
        $media->update($data);
        return $media;
    }

    /**
     * Deleta um arquivo de mídia pelo seu ID.
     */
    public function delete(string $id): bool
    {
        return $this->model->destroy($id) > 0;
    }

    /**
     * Encontra arquivos de mídia por pasta.
     */
    public function findByFolder(string $folderId): Collection
    {
        return $this->model->where('folder_id', $folderId)->get();
    }

    /**
     * Encontra arquivos de mídia por tipo.
     */
    public function findByType(string $type): Collection
    {
        return $this->model->where('mime_type', 'like', $type . '%')->get();
    }

    /**
     * Encontra arquivos de mídia por projeto.
     */
    public function findByProject(string $projectId): Collection
    {
        return $this->model->where('project_id', $projectId)->get();
    }
}
