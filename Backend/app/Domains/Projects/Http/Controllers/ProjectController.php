<?php

namespace App\Domains\Projects\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Domains\Projects\Models\Project;
use App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ProjectController extends Controller
{
    // ===== CRUD OPERATIONS =====
    
    /**
     * AUTH-022: Adicionada autorização
     */
    public function index(Request $request)
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', ProjectModel::class);
        
        $query = Project::where('owner_id', Auth::id());
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        
        $projects = $query->orderBy('updated_at', 'desc')->get();
        
        return response()->json($projects);
    }

    /**
     * AUTH-022: Adicionada autorização
     */
    public function show($id)
    {
        $project = Project::where('id', $id)
            ->where('owner_id', Auth::id())
            ->firstOrFail();
        
        // SECURITY: Verificar autorização
        $this->authorize('view', ProjectModel::findOrFail($id));
            
        return response()->json($project);
    }

    /**
     * AUTH-022: Adicionada autorização
     */
    public function store(Request $request)
    {
        // SECURITY: Verificar autorização
        $this->authorize('create', ProjectModel::class);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:active,inactive,archived',
            'mode' => 'nullable|in:normal,universe',
            'modules' => 'nullable|array'
        ]);

        $project = Project::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'owner_id' => Auth::id(),
            'status' => $validated['status'] ?? 'active',
            'mode' => $validated['mode'] ?? 'normal',
            'modules' => $validated['modules'] ?? [],
            'settings' => []
        ]);

        return response()->json($project, 201);
    }

    /**
     * AUTH-022: Adicionada autorização
     */
    public function update(Request $request, $id)
    {
        $project = Project::where('id', $id)
            ->where('owner_id', Auth::id())
            ->firstOrFail();
        
        // SECURITY: Verificar autorização
        $this->authorize('update', ProjectModel::findOrFail($id));

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:active,inactive,archived',
            'mode' => 'sometimes|in:normal,universe',
            'modules' => 'nullable|array'
        ]);

        $project->update($validated);

        return response()->json($project);
    }

    /**
     * AUTH-022: Adicionada autorização
     */
    public function destroy($id)
    {
        $project = Project::where('id', $id)
            ->where('owner_id', Auth::id())
            ->firstOrFail();
        
        // SECURITY: Verificar autorização
        $this->authorize('delete', ProjectModel::findOrFail($id));

        $project->delete();

        return response()->json(['message' => 'Project deleted successfully']);
    }

    // ===== PROJECT SELECTION =====

    /**
     * Set the active project for the current session.
     * 
     * SECURITY FIX (SEC-011): Método implementado para permitir seleção de projeto ativo.
     * Verifica se o usuário é owner ou membro do projeto antes de ativar.
     *
     * @param Request $request
     * @param string $id Project ID
     * @return \Illuminate\Http\JsonResponse
     */
    public function setActiveProject(Request $request, $id)
    {
        $userId = Auth::id();
        
        // Buscar projeto onde o usuário é owner OU membro
        $project = Project::where('id', $id)
            ->where(function ($query) use ($userId) {
                $query->where('owner_id', $userId)
                    ->orWhereHas('members', function ($q) use ($userId) {
                        $q->where('user_id', $userId);
                    });
            })
            ->first();

        if (!$project) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found or access denied.',
            ], 404);
        }

        // Verificar se o projeto está ativo
        if ($project->status === 'archived') {
            return response()->json([
                'success' => false,
                'message' => 'Cannot select an archived project.',
            ], 400);
        }

        // Salvar na sessão
        session(['selected_project_id' => $project->id]);
        session(['selected_project_name' => $project->name]);
        session(['selected_project_mode' => $project->mode ?? 'normal']);

        // Registrar atividade
        DB::table('project_activities')->insert([
            'project_id' => $project->id,
            'user_id' => $userId,
            'action' => 'project_selected',
            'description' => 'Project selected as active',
            'metadata' => json_encode(['ip' => $request->ip()]),
            'created_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Project set as active successfully.',
            'data' => [
                'project' => [
                    'id' => $project->id,
                    'name' => $project->name,
                    'description' => $project->description,
                    'status' => $project->status,
                    'mode' => $project->mode ?? 'normal',
                    'modules' => $project->modules ?? [],
                ],
            ],
        ]);
    }

    /**
     * Get the currently active project from session.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getActiveProject()
    {
        $projectId = session('selected_project_id');

        if (!$projectId) {
            return response()->json([
                'success' => false,
                'message' => 'No active project selected.',
                'data' => null,
            ]);
        }

        $project = Project::find($projectId);

        if (!$project) {
            // Limpar sessão se projeto não existe mais
            session()->forget(['selected_project_id', 'selected_project_name', 'selected_project_mode']);
            
            return response()->json([
                'success' => false,
                'message' => 'Active project no longer exists.',
                'data' => null,
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'project' => [
                    'id' => $project->id,
                    'name' => $project->name,
                    'description' => $project->description,
                    'status' => $project->status,
                    'mode' => $project->mode ?? 'normal',
                    'modules' => $project->modules ?? [],
                ],
            ],
        ]);
    }

    /**
     * Select a project (alias for setActiveProject for compatibility).
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function selectProject(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|string',
        ]);

        return $this->setActiveProject($request, $validated['project_id']);
    }

    /**
     * Switch to a different project.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function switchProject(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|string',
        ]);

        return $this->setActiveProject($request, $validated['project_id']);
    }

    /**
     * Clear the active project from session.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function clearActiveProject()
    {
        session()->forget(['selected_project_id', 'selected_project_name', 'selected_project_mode']);

        return response()->json([
            'success' => true,
            'message' => 'Active project cleared.',
        ]);
    }

    // ===== PROJECT ACTIONS =====

    public function duplicate($id)
    {
        $project = Project::where('id', $id)
            ->where('owner_id', Auth::id())
            ->firstOrFail();

        $newProject = $project->replicate();
        $newProject->name = $project->name . ' (Copy)';
        $newProject->save();

        return response()->json($newProject, 201);
    }

    public function archive($id)
    {
        $project = Project::where('id', $id)
            ->where('owner_id', Auth::id())
            ->firstOrFail();

        $project->update(['status' => 'archived']);

        return response()->json($project);
    }

    public function restore($id)
    {
        $project = Project::where('id', $id)
            ->where('owner_id', Auth::id())
            ->firstOrFail();

        $project->update(['status' => 'active']);

        return response()->json($project);
    }

    public function transferOwnership(Request $request, $id)
    {
        $validated = $request->validate([
            'new_owner_id' => 'required|exists:users,id'
        ]);

        $project = Project::where('id', $id)
            ->where('owner_id', Auth::id())
            ->firstOrFail();

        $project->update(['owner_id' => $validated['new_owner_id']]);

        return response()->json($project);
    }

    // ===== MEMBER MANAGEMENT =====

    /**
     * IMPL-013: Refatorado para usar ProjectMember Model (Eloquent)
     */
    public function getMembers($id)
    {
        $project = Project::where('id', $id)
            ->where('owner_id', Auth::id())
            ->firstOrFail();

        $members = \App\Domains\Projects\Models\ProjectMember::where('project_id', $id)
            ->with('user:id,name,email')
            ->get()
            ->map(function($member) {
                return [
                    'id' => $member->user->id,
                    'name' => $member->user->name,
                    'email' => $member->user->email,
                    'role' => $member->role,
                    'permissions' => $member->permissions,
                    'joined_at' => $member->joined_at?->toISOString(),
                    'created_at' => $member->created_at->toISOString(),
                ];
            });

        return response()->json($members);
    }

    /**
     * IMPL-013: Refatorado para usar ProjectMember Model (Eloquent)
     */
    public function addMember(Request $request, $id)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'required|in:owner,admin,member,viewer'
        ]);

        // Verificar se já é membro
        $existing = \App\Domains\Projects\Models\ProjectMember::where('project_id', $id)
            ->where('user_id', $validated['user_id'])
            ->first();

        if ($existing) {
            return response()->json(['message' => 'User is already a member'], 400);
        }

        $member = \App\Domains\Projects\Models\ProjectMember::create([
            'project_id' => $id,
            'user_id' => $validated['user_id'],
            'role' => $validated['role'],
            'invited_by' => Auth::id(),
            'invited_at' => now(),
            'joined_at' => now(),
        ]);

        return response()->json([
            'message' => 'Member added successfully',
            'data' => [
                'id' => $member->id,
                'user_id' => $member->user_id,
                'role' => $member->role,
            ]
        ], 201);
    }

    /**
     * IMPL-013: Refatorado para usar ProjectMember Model (Eloquent)
     */
    public function updateMember(Request $request, $id, $userId)
    {
        $validated = $request->validate([
            'role' => 'required|in:owner,admin,member,viewer'
        ]);

        $member = \App\Domains\Projects\Models\ProjectMember::where('project_id', $id)
            ->where('user_id', $userId)
            ->firstOrFail();

        $member->update(['role' => $validated['role']]);

        return response()->json([
            'message' => 'Member updated successfully',
            'data' => [
                'id' => $member->id,
                'user_id' => $member->user_id,
                'role' => $member->role,
            ]
        ]);
    }

    /**
     * IMPL-013: Refatorado para usar ProjectMember Model (Eloquent)
     */
    public function removeMember($id, $userId)
    {
        $member = \App\Domains\Projects\Models\ProjectMember::where('project_id', $id)
            ->where('user_id', $userId)
            ->firstOrFail();

        $member->delete();

        return response()->json(['message' => 'Member removed successfully']);
    }

    // ===== ACTIVITIES =====

    /**
     * IMPL-014: Refatorado para usar ProjectActivity Model (Eloquent)
     */
    public function getActivities($id)
    {
        $activities = \App\Domains\Projects\Models\ProjectActivity::where('project_id', $id)
            ->with('user:id,name,email')
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get()
            ->map(function($activity) {
                return [
                    'id' => $activity->id,
                    'action' => $activity->action,
                    'description' => $activity->description,
                    'entity_type' => $activity->entity_type,
                    'entity_id' => $activity->entity_id,
                    'user' => [
                        'id' => $activity->user->id,
                        'name' => $activity->user->name,
                        'email' => $activity->user->email,
                    ],
                    'metadata' => $activity->metadata,
                    'old_values' => $activity->old_values,
                    'new_values' => $activity->new_values,
                    'created_at' => $activity->created_at->toISOString(),
                ];
            });

        return response()->json($activities);
    }

    /**
     * IMPL-014: Refatorado para usar ProjectActivity Model (Eloquent)
     */
    public function recordActivity(Request $request, $id)
    {
        $validated = $request->validate([
            'action' => 'required|string',
            'description' => 'required|string',
            'entity_type' => 'nullable|string',
            'entity_id' => 'nullable|string',
            'metadata' => 'nullable|array',
            'old_values' => 'nullable|array',
            'new_values' => 'nullable|array',
        ]);

        $activity = \App\Domains\Projects\Models\ProjectActivity::create([
            'project_id' => $id,
            'user_id' => Auth::id(),
            'action' => $validated['action'],
            'description' => $validated['description'],
            'entity_type' => $validated['entity_type'] ?? null,
            'entity_id' => $validated['entity_id'] ?? null,
            'metadata' => $validated['metadata'] ?? [],
            'old_values' => $validated['old_values'] ?? null,
            'new_values' => $validated['new_values'] ?? null,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'message' => 'Activity recorded',
            'data' => [
                'id' => $activity->id,
                'action' => $activity->action,
                'description' => $activity->description,
                'created_at' => $activity->created_at->toISOString(),
            ]
        ], 201);
    }

    // ===== STATISTICS =====

    public function getStats()
    {
        $userId = Auth::id();
        
        $stats = [
            'total_projects' => Project::where('owner_id', $userId)->count(),
            'active_projects' => Project::where('owner_id', $userId)->where('status', 'active')->count(),
            'inactive_projects' => Project::where('owner_id', $userId)->where('status', 'inactive')->count(),
            'archived_projects' => Project::where('owner_id', $userId)->where('status', 'archived')->count(),
            'recent_projects' => Project::where('owner_id', $userId)->orderBy('updated_at', 'desc')->limit(5)->get()
        ];

        return response()->json($stats);
    }

    // ===== BULK OPERATIONS =====

    public function bulkUpdate(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'updates' => 'required|array'
        ]);

        Project::whereIn('id', $validated['ids'])
            ->where('owner_id', Auth::id())
            ->update($validated['updates']);

        return response()->json(['message' => 'Projects updated successfully']);
    }

    public function bulkDelete(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array'
        ]);

        Project::whereIn('id', $validated['ids'])
            ->where('owner_id', Auth::id())
            ->delete();

        return response()->json(['message' => 'Projects deleted successfully']);
    }

    public function bulkArchive(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array'
        ]);

        Project::whereIn('id', $validated['ids'])
            ->where('owner_id', Auth::id())
            ->update(['status' => 'archived']);

        return response()->json(['message' => 'Projects archived successfully']);
    }

    // ===== UNIVERSE METHODS =====

    /**
     * SEC-014: Create Universe instance for a project
     * 
     * Renders the Universe creation interface
     */
    public function createUniverse()
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', ProjectModel::class);
        
        return \Inertia\Inertia::render('Projects/Universe/pages/CreateUniverse');
    }

    /**
     * SEC-015: Universe Workspace
     * 
     * Renders the Universe workspace interface
     */
    public function universeWorkspace()
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', ProjectModel::class);
        
        $projectId = session('selected_project_id');
        
        if (!$projectId) {
            return redirect()->route('projects.index')
                ->with('error', 'Nenhum projeto selecionado');
        }
        
        return \Inertia\Inertia::render('Projects/Universe/pages/Workspace', [
            'projectId' => $projectId
        ]);
    }
}