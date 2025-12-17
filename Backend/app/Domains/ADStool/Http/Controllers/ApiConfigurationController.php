<?php

namespace App\Domains\ADStool\Http\Controllers;

use App\Domains\ADStool\Http\Requests\SaveApiConfigurationRequest;
use App\Domains\ADStool\Services\ApiConfigurationService;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ApiConfigurationController extends Controller
{
    protected ApiConfigurationService $apiConfigurationService;

    public function __construct(ApiConfigurationService $apiConfigurationService)
    {
        $this->apiConfigurationService = $apiConfigurationService;
    }

    /**
     * Salva a configuração da API para o usuário autenticado.
     *
     * @param SaveApiConfigurationRequest $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(SaveApiConfigurationRequest $request): \Illuminate\Http\JsonResponse
    {
        $validatedData = $request->validated();

        $userId = Auth::id();
        if ($userId === null) {
            abort(401, 'Unauthenticated');
        }

        $this->apiConfigurationService->saveConfiguration(
            (int) $userId,
            $validatedData['platform'],
            $validatedData['credentials'],
        );

        return new \Illuminate\Http\JsonResponse(['message' => 'Configuração da API salva com sucesso!']);
    }

    /**
     * Remove a configuração da API para uma plataforma.
     *
     * @param Request $request
     * @param string  $platform
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, string $platform): \Illuminate\Http\JsonResponse
    {
        $userId = Auth::id();
        if ($userId === null) {
            abort(401, 'Unauthenticated');
        }
        $this->apiConfigurationService->deleteConfiguration((int) $userId, $platform);

        return new \Illuminate\Http\JsonResponse(['message' => 'Configuração da API removida com sucesso!']);
    }
}
