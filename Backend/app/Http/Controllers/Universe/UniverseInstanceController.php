<?php

namespace App\Http\Controllers\Universe;

use App\Http\Controllers\Controller;
use App\Domains\Universe\Services\UniverseManagementService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UniverseInstanceController extends Controller
{
    public function __construct(
        private UniverseManagementService $service
    ) {}

    public function index(Request $request): JsonResponse
    {
        $instances = $this->service->getAllInstances(
            $request->user()->id,
            [
                'active' => $request->boolean('active'),
                'search' => $request->input('search'),
                'per_page' => $request->input('per_page', 15),
            ]
        );

        return response()->json($instances);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'template_id' => 'nullable|uuid|exists:universe_templates,id',
            'project_id' => 'nullable|uuid|exists:projects,id',
            'modules_config' => 'nullable|array',
            'blocks_config' => 'nullable|array',
        ]);

        $validated['user_id'] = $request->user()->id;

        $instance = $this->service->createInstance($validated);

        return response()->json($instance, 201);
    }

    public function show(string $id): JsonResponse
    {
        $instance = $this->service->getInstanceById($id);

        return response()->json($instance);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string|max:1000',
            'modules_config' => 'sometimes|array',
            'blocks_config' => 'sometimes|array',
            'canvas_state' => 'sometimes|array',
        ]);

        $instance = $this->service->updateInstance($id, $validated);

        return response()->json($instance);
    }

    public function destroy(string $id): JsonResponse
    {
        $this->service->deleteInstance($id);

        return response()->json(['message' => 'Instance deleted successfully']);
    }

    public function duplicate(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $instance = $this->service->duplicateInstance($id, $validated['name']);

        return response()->json($instance, 201);
    }
}
