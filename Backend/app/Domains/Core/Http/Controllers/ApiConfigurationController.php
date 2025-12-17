<?php

namespace App\Domains\Core\Http\Controllers;

use App\Domains\Core\Services\ApiConfigurationService; // Supondo que este serviço exista
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class ApiConfigurationController extends Controller
{
    protected ApiConfigurationService $apiConfigurationService;

    public function __construct(ApiConfigurationService $apiConfigurationService)
    {
        $this->apiConfigurationService = $apiConfigurationService;
    }

    /**
     * Display a listing of the API configurations.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        // For now, expose configured providers (read-only)
        $configurations = [
            'whatsapp' => $this->apiConfigurationService->get('whatsapp'),
            'facebook_ads' => $this->apiConfigurationService->get('facebook_ads'),
            'google_ads' => $this->apiConfigurationService->get('google_ads'),
        ];
        return Response::json($configurations);
    }

    /**
     * Store a newly created API configuration in storage.
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'service_name' => 'required|string|unique:api_configurations,service_name',
            'api_key' => 'required|string',
            // Adicione outras regras de validação conforme necessário
        ]);

        // Not yet implemented: persist per-user or global API configurations
        return Response::json(['message' => 'Not implemented'], 501);
    }

    /**
     * Update the specified API configuration in storage.
     *
     * @param Request $request
     * @param int     $id
     *
     * @return JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $validatedData = $request->validate([
            'api_key' => 'sometimes|required|string',
            // Adicione outras regras de validação conforme necessário
        ]);

        // Not yet implemented
        return Response::json(['message' => 'Not implemented'], 501);
    }

    /**
     * Remove the specified API configuration from storage.
     *
     * @param int $id
     *
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        // Not yet implemented
        return Response::json(['message' => 'Not implemented'], 501);
    }
}
