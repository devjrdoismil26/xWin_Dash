<?php

namespace App\Domains\Universe\Http\Controllers;

use App\Domains\Universe\Application\Services\UniverseInstanceService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

/**
 * Controller simplificado para instâncias do Universe
 * Focado em performance e simplicidade
 */
class UniverseInstanceController extends Controller
{
    protected UniverseInstanceService $universeInstanceService;

    public function __construct(UniverseInstanceService $universeInstanceService)
    {
        $this->universeInstanceService = $universeInstanceService;
    }

    /**
     * Lista instâncias com paginação e filtros
     */
    public function index(Request $request): JsonResponse
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $filters = $request->only([
            'per_page', 'page', 'status', 'search', 
            'sort_by', 'sort_direction', 'project_id'
        ]);

        $result = $this->universeInstanceService->list($filters);

        return response()->json([
            'success' => true,
            'data' => $result->items(),
            'pagination' => [
                'current_page' => $result->currentPage(),
                'last_page' => $result->lastPage(),
                'per_page' => $result->perPage(),
                'total' => $result->total()
            ]
        ]);
    }

    /**
     * Cria uma nova instância
     */
    public function store(Request $request): JsonResponse
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'project_id' => 'nullable|uuid|exists:projects,id',
            'template_id' => 'nullable|uuid|exists:universe_templates,id',
            'is_active' => 'nullable|boolean',
            'is_default' => 'nullable|boolean',
            'modules_config' => 'nullable|array',
            'connections_config' => 'nullable|array',
            'layout_config' => 'nullable|array',
            'theme_config' => 'nullable|array',
            'metadata' => 'nullable|array'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();
        $data['user_id'] = Auth::id();

        $result = $this->universeInstanceService->create($data);

        if ($result['success']) {
            return response()->json($result, 201);
        }

        return response()->json($result, 400);
    }

    /**
     * Exibe uma instância específica
     */
    public function show(string $id): JsonResponse
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $result = $this->universeInstanceService->find($id);

        if ($result['success']) {
            return response()->json($result);
        }

        return response()->json($result, 404);
    }

    /**
     * Atualiza uma instância
     */
    public function update(Request $request, string $id): JsonResponse
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'is_default' => 'nullable|boolean',
            'modules_config' => 'nullable|array',
            'connections_config' => 'nullable|array',
            'layout_config' => 'nullable|array',
            'theme_config' => 'nullable|array',
            'metadata' => 'nullable|array'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        $result = $this->universeInstanceService->update($id, $data);

        if ($result['success']) {
            return response()->json($result);
        }

        return response()->json($result, 400);
    }

    /**
     * Exclui uma instância
     */
    public function destroy(string $id): JsonResponse
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $result = $this->universeInstanceService->delete($id);

        if ($result['success']) {
            return response()->json($result);
        }

        return response()->json($result, 400);
    }

    /**
     * Duplica uma instância
     */
    public function duplicate(string $id): JsonResponse
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $result = $this->universeInstanceService->duplicate($id);

        if ($result['success']) {
            return response()->json($result, 201);
        }

        return response()->json($result, 400);
    }

    /**
     * Lista instâncias por projeto
     */
    public function byProject(string $projectId): JsonResponse
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $instances = $this->universeInstanceService->getByProject($projectId);

        return response()->json([
            'success' => true,
            'data' => $instances
        ]);
    }

    /**
     * Obtém estatísticas
     */
    public function stats(): JsonResponse
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $result = $this->universeInstanceService->getStats();

        return response()->json($result);
    }
}