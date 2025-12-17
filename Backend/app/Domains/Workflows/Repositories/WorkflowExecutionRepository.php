<?php

namespace App\Domains\Workflows\Repositories;

use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowExecutionModel;
use Illuminate\Database\Eloquent\Collection;

class WorkflowExecutionRepository
{
    /**
     * Busca todas as execuções de workflow para um dado usuário.
     *
     * @param string $userId o ID do usuário
     *
     * @return Collection<WorkflowExecutionModel> uma coleção de execuções de workflow
     */
    public function findAllByUserId(string $userId): Collection
    {
        return WorkflowExecutionModel::where('user_id', $userId)->get();
    }

    // Outros métodos de repositório (save, find, delete, etc.)
}
