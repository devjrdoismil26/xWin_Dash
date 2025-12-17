<?php

namespace App\Domains\Core\Http\Controllers;

use App\Domains\Core\Application\Actions\ConfigureIntegrationAction;
use App\Domains\Core\Application\DTOs\IntegrationConfigDTO;
use App\Domains\Core\Application\Services\IntegrationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class IntegrationController extends Controller
{
    public function __construct(
        private IntegrationService $integrationService,
        private ConfigureIntegrationAction $configureAction
    ) {}

    public function index(): JsonResponse
    {
        $integrations = \DB::table('integrations')->get();

        return response()->json([
            'success' => true,
            'data' => $integrations,
        ]);
    }

    public function configure(Request $request): JsonResponse
    {
        $request->validate([
            'service' => 'required|string',
            'credentials' => 'required|array',
            'settings' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        try {
            $dto = new IntegrationConfigDTO(
                service: $request->service,
                credentials: $request->credentials,
                settings: $request->settings ?? [],
                is_active: $request->is_active ?? true
            );

            $this->configureAction->execute($dto);

            return response()->json([
                'success' => true,
                'message' => 'Integration configured successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function test(string $service): JsonResponse
    {
        $result = $this->integrationService->test($service);

        return response()->json([
            'success' => $result['success'],
            'message' => $result['message'],
        ]);
    }
}
