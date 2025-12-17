<?php

namespace App\Domains\ADStool\Http\Controllers;

use App\Domains\ADStool\Services\ADSToolService;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdtoolPageController extends Controller
{
    protected ADSToolService $adsToolService;

    public function __construct(ADSToolService $adsToolService)
    {
        $this->adsToolService = $adsToolService;
    }

    /**
     * Carrega os dados para a página principal do dashboard de anúncios.
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function __invoke(Request $request): \Illuminate\Http\JsonResponse
    {
        $userId = Auth::id();
        if ($userId === null) {
            abort(401, 'Unauthenticated');
        }
        $dashboardData = $this->adsToolService->getDashboardData((int) $userId);

        // Em um projeto com Inertia.js, seria algo como:
        // return inertia('Adtool/Dashboard', ['data' => $dashboardData->toArray()]);

        // Para uma API JSON pura:
        return new \Illuminate\Http\JsonResponse($dashboardData->toArray());
    }
}
