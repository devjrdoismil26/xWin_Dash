<?php

namespace App\Domains\Aura\Filters;

use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraChatModel;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class AuraChatFilter
{
    protected Request $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * @param Builder<AuraChatModel> $query
     * @return Builder<AuraChatModel>
     */
    public function apply(Builder $query): Builder
    {
        return $query->when($this->request->has('connection_id'), function ($query) {
            return $query->where('aura_connection_id', $this->request->input('connection_id'));
        })
        ->when($this->request->has('status'), function ($query) {
            return $query->where('status', $this->request->input('status'));
        });
    }
}
