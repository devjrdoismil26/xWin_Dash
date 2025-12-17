<?php

namespace App\Application\SocialBuffer\UseCases;

use App\Application\SocialBuffer\Commands\GetSchedulesCommand;
use App\Domains\SocialBuffer\Models\Schedule;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class GetSchedulesUseCase
{
    public function execute(GetSchedulesCommand $command): LengthAwarePaginator
    {
        $query = Schedule::query()->with(['post', 'socialAccount']);

        $filters = $command->filters;

        if (isset($filters['status']) && $filters['status'] !== '') {
            $query->where('status', $filters['status']);
        }

        // Adicione outros filtros conforme necessário (ex: por data, por conta social)

        return $query; // Paginação padrão de 15 itens por página
    }
}
