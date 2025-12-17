<?php

namespace App\Domains\Universe\Http\Controllers;

use App\Domains\Universe\Services\UniverseManagementService;
use App\Domains\Universe\Application\Services\UniverseApplicationService;
use App\Domains\Universe\Models\UniverseInstance;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response as ResponseFacade;

/**
 * UniverseController
 * 
 * SECURITY FIX (AUTH-001): Implementada autorização em todos os métodos usando Policies
 */
class UniverseController extends Controller
{
    protected UniverseManagementService $universeManagementService;
    protected UniverseApplicationService $universeApplicationService;

    public function __construct(
        UniverseManagementService $universeManagementService,
        UniverseApplicationService $universeApplicationService
    ) {
        $this->universeManagementService = $universeManagementService;
        $this->universeApplicationService = $universeApplicationService;
    }

    /**
     * Display a listing of Universe instances.
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização para listar instâncias
        $this->authorize('viewAny', UniverseInstance::class);

        $filters = [
            'per_page' => $request->get('per_page', 15),
            'page' => $request->get('page', 1),
            'status' => $request->get('status'),
            'search' => $request->get('search'),
            'sort_by' => $request->get('sort_by', 'created_at'),
            'sort_direction' => $request->get('sort_direction', 'desc')
        ];

        $result = $this->universeApplicationService->listUniverseInstances(Auth::id(), $filters);

        if (!$result['success']) {
            return ResponseFacade::json($result, 400);
        }

        return ResponseFacade::json($result['data']);
    }

    /**
     * Store a newly created Universe instance in storage.
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização para criar instância
        $this->authorize('create', UniverseInstance::class);

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'configuration' => 'nullable|array',
            'template_id' => 'nullable|string',
            'parent_instance_id' => 'nullable|string'
        ]);

        $data = array_merge($validatedData, [
            'user_id' => Auth::id(),
            'project_id' => session('selected_project_id'),
        ]);
        
        $result = $this->universeApplicationService->createUniverseInstance($data);

        if (!$result['success']) {
            return ResponseFacade::json($result, 400);
        }

        return ResponseFacade::json($result['data'], 201);
    }

    /**
     * Display the specified Universe instance.
     *
     * @param string $id
     *
     * @return JsonResponse
     */
    public function show(string $id): JsonResponse
    {
        $instance = $this->universeManagementService->getInstanceById($id);
        
        if (!$instance) {
            return ResponseFacade::json(['message' => 'Universe instance not found.'], 404);
        }

        // SECURITY: Verificar autorização para visualizar
        $this->authorize('view', $instance);

        return ResponseFacade::json($instance);
    }

    /**
     * Update the specified Universe instance in storage.
     *
     * @param Request $request
     * @param string  $id
     *
     * @return JsonResponse
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $instance = $this->universeManagementService->getInstanceById($id);
        
        if (!$instance) {
            return ResponseFacade::json(['message' => 'Universe instance not found.'], 404);
        }

        // SECURITY: Verificar autorização para atualizar
        $this->authorize('update', $instance);

        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|required|string|in:active,inactive,suspended',
            'configuration' => 'nullable|array',
        ]);

        $data = array_merge($validatedData, [
            'instance_id' => $id,
            'user_id' => Auth::id()
        ]);

        $result = $this->universeApplicationService->updateUniverseInstance($id, $data);

        if (!$result['success']) {
            return ResponseFacade::json($result, 404);
        }

        return ResponseFacade::json($result['data']);
    }

    /**
     * Remove the specified Universe instance from storage.
     *
     * @param string $id
     *
     * @return JsonResponse
     */
    public function destroy(string $id): JsonResponse
    {
        $instance = $this->universeManagementService->getInstanceById($id);
        
        if (!$instance) {
            return ResponseFacade::json(['message' => 'Universe instance not found.'], 404);
        }

        // SECURITY: Verificar autorização para deletar
        $this->authorize('delete', $instance);

        $result = $this->universeApplicationService->deleteUniverseInstance($id, Auth::id());

        if (!$result['success']) {
            return ResponseFacade::json($result, 404);
        }

        return ResponseFacade::json($result);
    }

    // ===== MÉTODOS ESPECÍFICOS DO UNIVERSE =====

    public function start(string $id): JsonResponse
    {
        $instance = $this->universeManagementService->getInstanceById($id);
        
        if (!$instance) {
            return ResponseFacade::json(['message' => 'Universe instance not found.'], 404);
        }

        // SECURITY: Verificar autorização para atualizar (start é uma atualização de status)
        $this->authorize('update', $instance);

        $success = $this->universeManagementService->startInstance($id);
        if (!$success) {
            return ResponseFacade::json(['message' => 'Failed to start universe instance.'], 400);
        }
        return ResponseFacade::json(['message' => 'Universe instance started successfully.']);
    }

    public function stop(string $id): JsonResponse
    {
        $instance = $this->universeManagementService->getInstanceById($id);
        
        if (!$instance) {
            return ResponseFacade::json(['message' => 'Universe instance not found.'], 404);
        }

        // SECURITY: Verificar autorização para atualizar
        $this->authorize('update', $instance);

        $success = $this->universeManagementService->stopInstance($id);
        if (!$success) {
            return ResponseFacade::json(['message' => 'Failed to stop universe instance.'], 400);
        }
        return ResponseFacade::json(['message' => 'Universe instance stopped successfully.']);
    }

    public function save(string $id, Request $request): JsonResponse
    {
        $instance = $this->universeManagementService->getInstanceById($id);
        
        if (!$instance) {
            return ResponseFacade::json(['message' => 'Universe instance not found.'], 404);
        }

        // SECURITY: Verificar autorização para atualizar
        $this->authorize('update', $instance);

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string|max:1000',
            'configuration' => 'sometimes|array',
        ]);

        $success = $this->universeManagementService->saveInstance($id, $data);
        if (!$success) {
            return ResponseFacade::json(['message' => 'Failed to save universe instance.'], 400);
        }
        return ResponseFacade::json(['message' => 'Universe instance saved successfully.']);
    }

    public function duplicate(string $id): JsonResponse
    {
        $instance = $this->universeManagementService->getInstanceById($id);
        
        if (!$instance) {
            return ResponseFacade::json(['message' => 'Universe instance not found.'], 404);
        }

        // SECURITY: Verificar autorização para duplicar
        $this->authorize('duplicate', $instance);

        $newInstance = $this->universeManagementService->duplicateInstance($id);
        if (!$newInstance) {
            return ResponseFacade::json(['message' => 'Failed to duplicate universe instance.'], 400);
        }
        return ResponseFacade::json(['data' => $newInstance, 'message' => 'Universe instance duplicated successfully.']);
    }

    // ===== SNAPSHOTS =====

    public function getSnapshots(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização para ver instâncias
        $this->authorize('viewAny', UniverseInstance::class);

        $snapshots = $this->universeManagementService->getSnapshots($request->all());
        return ResponseFacade::json(['data' => $snapshots]);
    }

    public function createSnapshot(Request $request): JsonResponse
    {
        $data = $request->validate([
            'universe_id' => 'required|string',
            'name' => 'required|string|max:255',
            'description' => 'sometimes|string|max:1000',
        ]);

        $instance = $this->universeManagementService->getInstanceById($data['universe_id']);
        
        if (!$instance) {
            return ResponseFacade::json(['message' => 'Universe instance not found.'], 404);
        }

        // SECURITY: Verificar autorização para gerenciar snapshots
        $this->authorize('manageSnapshots', $instance);

        $snapshot = $this->universeManagementService->createSnapshot($data);
        if (!$snapshot) {
            return ResponseFacade::json(['message' => 'Failed to create snapshot.'], 400);
        }
        return ResponseFacade::json(['data' => $snapshot, 'message' => 'Snapshot created successfully.']);
    }

    public function getSnapshot(string $id): JsonResponse
    {
        $snapshot = $this->universeManagementService->getSnapshot($id);
        if (!$snapshot) {
            return ResponseFacade::json(['message' => 'Snapshot not found.'], 404);
        }

        // Buscar instância associada para verificar autorização
        if (isset($snapshot['universe_id'])) {
            $instance = $this->universeManagementService->getInstanceById($snapshot['universe_id']);
            if ($instance) {
                $this->authorize('view', $instance);
            }
        }

        return ResponseFacade::json(['data' => $snapshot]);
    }

    public function restoreSnapshot(string $id): JsonResponse
    {
        $snapshot = $this->universeManagementService->getSnapshot($id);
        if (!$snapshot) {
            return ResponseFacade::json(['message' => 'Snapshot not found.'], 404);
        }

        // SECURITY: Verificar autorização para gerenciar snapshots
        if (isset($snapshot['universe_id'])) {
            $instance = $this->universeManagementService->getInstanceById($snapshot['universe_id']);
            if ($instance) {
                $this->authorize('manageSnapshots', $instance);
            }
        }

        $success = $this->universeManagementService->restoreSnapshot($id);
        if (!$success) {
            return ResponseFacade::json(['message' => 'Failed to restore snapshot.'], 400);
        }
        return ResponseFacade::json(['message' => 'Snapshot restored successfully.']);
    }

    public function deleteSnapshot(string $id): JsonResponse
    {
        $snapshot = $this->universeManagementService->getSnapshot($id);
        if (!$snapshot) {
            return ResponseFacade::json(['message' => 'Snapshot not found.'], 404);
        }

        // SECURITY: Verificar autorização para gerenciar snapshots
        if (isset($snapshot['universe_id'])) {
            $instance = $this->universeManagementService->getInstanceById($snapshot['universe_id']);
            if ($instance) {
                $this->authorize('manageSnapshots', $instance);
            }
        }

        $success = $this->universeManagementService->deleteSnapshot($id);
        if (!$success) {
            return ResponseFacade::json(['message' => 'Snapshot not found.'], 404);
        }
        return ResponseFacade::json(['message' => 'Snapshot deleted successfully.']);
    }

    // ===== TEMPLATES =====

    public function getTemplates(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização para ver templates
        $this->authorize('viewAny', UniverseInstance::class);

        $templates = $this->universeManagementService->getTemplates($request->all());
        return ResponseFacade::json(['data' => $templates]);
    }

    public function createTemplate(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização para criar
        $this->authorize('create', UniverseInstance::class);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'sometimes|string|max:1000',
            'template_data' => 'required|array',
            'category' => 'sometimes|string|max:100',
            'parent_template_id' => 'sometimes|string'
        ]);

        $data['user_id'] = Auth::id();
        $data['project_id'] = session('selected_project_id');
        
        $result = $this->universeApplicationService->createUniverseTemplate($data);

        if (!$result['success']) {
            return ResponseFacade::json($result, 400);
        }

        return ResponseFacade::json($result['data']);
    }

    public function getTemplate(string $id): JsonResponse
    {
        $template = $this->universeManagementService->getTemplate($id);
        if (!$template) {
            return ResponseFacade::json(['message' => 'Template not found.'], 404);
        }

        // Templates públicos podem ser vistos por todos que têm viewAny
        $this->authorize('viewAny', UniverseInstance::class);

        return ResponseFacade::json(['data' => $template]);
    }

    public function updateTemplate(Request $request, string $id): JsonResponse
    {
        $template = $this->universeManagementService->getTemplate($id);
        if (!$template) {
            return ResponseFacade::json(['message' => 'Template not found.'], 404);
        }

        // SECURITY: Apenas owner ou admin pode editar template
        $userId = Auth::id();
        if (isset($template['user_id']) && $template['user_id'] !== $userId) {
            $this->authorize('update', new UniverseInstance(['user_id' => $template['user_id']]));
        }

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string|max:1000',
            'template_data' => 'sometimes|array',
            'category' => 'sometimes|string|max:100',
        ]);

        $template = $this->universeManagementService->updateTemplate($id, $data);
        if (!$template) {
            return ResponseFacade::json(['message' => 'Template not found.'], 404);
        }
        return ResponseFacade::json(['data' => $template, 'message' => 'Template updated successfully.']);
    }

    public function deleteTemplate(string $id): JsonResponse
    {
        $template = $this->universeManagementService->getTemplate($id);
        if (!$template) {
            return ResponseFacade::json(['message' => 'Template not found.'], 404);
        }

        // SECURITY: Apenas owner ou admin pode deletar template
        $userId = Auth::id();
        if (isset($template['user_id']) && $template['user_id'] !== $userId) {
            $this->authorize('delete', new UniverseInstance(['user_id' => $template['user_id']]));
        }

        $success = $this->universeManagementService->deleteTemplate($id);
        if (!$success) {
            return ResponseFacade::json(['message' => 'Template not found.'], 404);
        }
        return ResponseFacade::json(['message' => 'Template deleted successfully.']);
    }

    // ===== CANVAS E BLOCKS =====

    public function getCanvas(string $id): JsonResponse
    {
        $instance = $this->universeManagementService->getInstanceById($id);
        if (!$instance) {
            return ResponseFacade::json(['message' => 'Universe instance not found.'], 404);
        }

        // SECURITY: Verificar autorização para visualizar
        $this->authorize('view', $instance);

        $canvas = $this->universeManagementService->getCanvas($id);
        return ResponseFacade::json(['data' => $canvas]);
    }

    public function updateCanvas(Request $request, string $id): JsonResponse
    {
        $instance = $this->universeManagementService->getInstanceById($id);
        if (!$instance) {
            return ResponseFacade::json(['message' => 'Universe instance not found.'], 404);
        }

        // SECURITY: Verificar autorização para atualizar
        $this->authorize('update', $instance);

        $data = $request->validate([
            'canvas_data' => 'required|array',
            'version' => 'sometimes|string',
        ]);

        $success = $this->universeManagementService->updateCanvas($id, $data);
        if (!$success) {
            return ResponseFacade::json(['message' => 'Failed to update canvas.'], 400);
        }
        return ResponseFacade::json(['message' => 'Canvas updated successfully.']);
    }

    public function createBlock(Request $request, string $id): JsonResponse
    {
        $instance = $this->universeManagementService->getInstanceById($id);
        if (!$instance) {
            return ResponseFacade::json(['message' => 'Universe instance not found.'], 404);
        }

        // SECURITY: Verificar autorização para atualizar
        $this->authorize('update', $instance);

        $data = $request->validate([
            'type' => 'required|string|max:100',
            'position' => 'required|array',
            'properties' => 'required|array',
            'parent_id' => 'sometimes|string',
        ]);

        $block = $this->universeManagementService->createBlock($id, $data);
        if (!$block) {
            return ResponseFacade::json(['message' => 'Failed to create block.'], 400);
        }
        return ResponseFacade::json(['data' => $block, 'message' => 'Block created successfully.']);
    }

    public function updateBlock(Request $request, string $id, string $blockId): JsonResponse
    {
        $instance = $this->universeManagementService->getInstanceById($id);
        if (!$instance) {
            return ResponseFacade::json(['message' => 'Universe instance not found.'], 404);
        }

        // SECURITY: Verificar autorização para atualizar
        $this->authorize('update', $instance);

        $data = $request->validate([
            'type' => 'sometimes|string|max:100',
            'position' => 'sometimes|array',
            'properties' => 'sometimes|array',
        ]);

        $block = $this->universeManagementService->updateBlock($id, $blockId, $data);
        if (!$block) {
            return ResponseFacade::json(['message' => 'Block not found.'], 404);
        }
        return ResponseFacade::json(['data' => $block, 'message' => 'Block updated successfully.']);
    }

    public function deleteBlock(string $id, string $blockId): JsonResponse
    {
        $instance = $this->universeManagementService->getInstanceById($id);
        if (!$instance) {
            return ResponseFacade::json(['message' => 'Universe instance not found.'], 404);
        }

        // SECURITY: Verificar autorização para atualizar
        $this->authorize('update', $instance);

        $success = $this->universeManagementService->deleteBlock($id, $blockId);
        if (!$success) {
            return ResponseFacade::json(['message' => 'Block not found.'], 404);
        }
        return ResponseFacade::json(['message' => 'Block deleted successfully.']);
    }

    // ===== ACTIVITIES =====

    public function getActivities(string $id, Request $request): JsonResponse
    {
        $instance = $this->universeManagementService->getInstanceById($id);
        if (!$instance) {
            return ResponseFacade::json(['message' => 'Universe instance not found.'], 404);
        }

        // SECURITY: Verificar autorização para visualizar
        $this->authorize('view', $instance);

        $activities = $this->universeManagementService->getActivities($id, $request->all());
        return ResponseFacade::json(['data' => $activities]);
    }

    public function createActivity(Request $request, string $id): JsonResponse
    {
        $instance = $this->universeManagementService->getInstanceById($id);
        if (!$instance) {
            return ResponseFacade::json(['message' => 'Universe instance not found.'], 404);
        }

        // SECURITY: Verificar autorização para atualizar
        $this->authorize('update', $instance);

        $data = $request->validate([
            'type' => 'required|string|max:100',
            'description' => 'required|string|max:1000',
            'metadata' => 'sometimes|array',
        ]);

        $activity = $this->universeManagementService->createActivity($id, $data);
        if (!$activity) {
            return ResponseFacade::json(['message' => 'Failed to create activity.'], 400);
        }
        return ResponseFacade::json(['data' => $activity, 'message' => 'Activity created successfully.']);
    }

    // ===== STATS =====

    public function getStats(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização para ver instâncias
        $this->authorize('viewAny', UniverseInstance::class);

        $stats = $this->universeManagementService->getStats($request->all());
        return ResponseFacade::json(['data' => $stats]);
    }

    // ===== AI SUGGESTIONS =====

    public function getAISuggestions(Request $request, string $id): JsonResponse
    {
        $instance = $this->universeManagementService->getInstanceById($id);
        if (!$instance) {
            return ResponseFacade::json(['message' => 'Universe instance not found.'], 404);
        }

        // SECURITY: Verificar autorização para usar AI
        $this->authorize('useAI', $instance);

        $data = $request->validate([
            'context' => 'required|string|max:2000',
            'type' => 'required|string|in:blocks,connections,optimization',
        ]);

        $suggestions = $this->universeManagementService->getAISuggestions($id, $data);
        if (!$suggestions) {
            return ResponseFacade::json(['message' => 'Failed to get AI suggestions.'], 400);
        }
        return ResponseFacade::json(['data' => $suggestions]);
    }

    // ===== AUTOMATIONS =====

    public function runAutomation(Request $request, string $id, string $automationId): JsonResponse
    {
        $instance = $this->universeManagementService->getInstanceById($id);
        if (!$instance) {
            return ResponseFacade::json(['message' => 'Universe instance not found.'], 404);
        }

        // SECURITY: Verificar autorização para atualizar (executar automação modifica o estado)
        $this->authorize('update', $instance);

        $data = $request->validate([
            'parameters' => 'sometimes|array',
        ]);

        $result = $this->universeManagementService->runAutomation($id, $automationId, $data);
        if (!$result) {
            return ResponseFacade::json(['message' => 'Failed to run automation.'], 400);
        }
        return ResponseFacade::json(['data' => $result, 'message' => 'Automation executed successfully.']);
    }

    public function getAutomations(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização para ver instâncias
        $this->authorize('viewAny', UniverseInstance::class);

        $automations = $this->universeManagementService->getAutomations($request->all());
        return ResponseFacade::json(['data' => $automations]);
    }
}
