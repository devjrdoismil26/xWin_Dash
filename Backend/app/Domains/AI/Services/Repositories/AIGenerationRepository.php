<?php

namespace App\Domains\AI\Repositories;

use App\Domains\AI\Models\AIGeneration;
use Illuminate\Database\Eloquent\Collection;

class AIGenerationRepository
{
    /**
     * Busca todas as gerações de AI para um dado usuário.
     *
     * @param string $userId o ID do usuário
     *
     * @return Collection<int, AIGeneration> uma coleção de gerações de AI
     */
    public function findAllByUserId(string $userId): Collection
    {
        return AIGeneration::where('user_id', $userId)->get();
    }
}
