<?php

namespace App\Domains\Core\Http\Controllers;

use App\Domains\Core\Services\UserApiConfigurationService; // Supondo que este serviço exista
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;

class UserApiConfigurationController extends Controller
{
    protected UserApiConfigurationService $userApiConfigurationService;

    public function __construct(UserApiConfigurationService $userApiConfigurationService)
    {
        $this->userApiConfigurationService = $userApiConfigurationService;
    }

    /**
     * Display a listing of the user's API configurations.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $userId = Auth::id();
        $configurations = $this->userApiConfigurationService->getConfigurationsForUser($userId);
        return Response::json($configurations);
    }

    /**
     * Store a newly created user API configuration in storage.
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $userId = Auth::id();
        $validatedData = $request->validate([
            'service_name' => 'required|string',
            'api_key' => 'required|string',
            // Adicione outras regras de validação conforme necessário
        ]);

        $configuration = $this->userApiConfigurationService->createConfiguration($userId, $validatedData);
        return Response::json($configuration, 201);
    }

    /**
     * Update the specified user API configuration in storage.
     *
     * @param Request $request
     * @param int     $id
     *
     * @return JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $userId = Auth::id();
        $validatedData = $request->validate([
            'api_key' => 'sometimes|required|string',
            // Adicione outras regras de validação conforme necessário
        ]);

        $configuration = $this->userApiConfigurationService->updateConfiguration($userId, $id, $validatedData);
        if (!$configuration) {
            return Response::json(['message' => 'Configuration not found or unauthorized.'], 404);
        }
        return Response::json($configuration);
    }

    /**
     * Remove the specified user API configuration from storage.
     *
     * @param int $id
     *
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $userId = Auth::id();
        $success = $this->userApiConfigurationService->deleteConfiguration($userId, $id);
        if (!$success) {
            return Response::json(['message' => 'Configuration not found or unauthorized.'], 404);
        }
        return Response::json(['message' => 'Configuration deleted successfully.']);
    }
}
