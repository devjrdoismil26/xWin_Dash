<?php

namespace App\Domains\Media\Http\Controllers;

use App\Domains\Media\Application\Actions\OrganizeMediaAction;
use App\Domains\Media\Models\MediaFolder;
use App\Domains\Media\Policies\FolderPolicy;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class FolderController extends Controller
{
    public function __construct(
        private OrganizeMediaAction $organizeAction
    ) {}

    /**
     * IMPL-012: Implementação real com Eloquent e filtro de projeto
     * AUTH-016: Adicionada autorização
     */
    public function index(): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', MediaFolder::class);
        
        $projectId = session('selected_project_id');
        $userId = auth()->id();

        // SECURITY: Buscar pastas do usuário filtradas por projeto
        $query = MediaFolder::where('created_by', $userId);
        if ($projectId) {
            $query->where('project_id', $projectId);
        }

        $folders = $query->orderBy('name')
            ->get()
            ->map(function($folder) {
                return [
                    'id' => $folder->id,
                    'name' => $folder->name,
                    'slug' => $folder->slug,
                    'description' => $folder->description,
                    'parent_id' => $folder->parent_id,
                    'is_public' => $folder->is_public,
                    'files_count' => $folder->files()->count(),
                    'created_at' => $folder->created_at->toISOString(),
                    'updated_at' => $folder->updated_at->toISOString(),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $folders,
        ]);
    }

    /**
     * IMPL-012: Implementação real com Eloquent e filtro de projeto
     * AUTH-016: Adicionada autorização
     */
    public function store(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('create', MediaFolder::class);
        
        $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|string',
            'description' => 'nullable|string',
            'is_public' => 'nullable|boolean',
        ]);

        $projectId = session('selected_project_id');
        $userId = auth()->id();

        // SECURITY: Criar pasta com project_id
        $folder = MediaFolder::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'parent_id' => $request->parent_id,
            'created_by' => $userId,
            'project_id' => $projectId,
            'is_public' => $request->is_public ?? false,
        ]);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $folder->id,
                'name' => $folder->name,
                'slug' => $folder->slug,
                'parent_id' => $folder->parent_id,
                'created_at' => $folder->created_at->toISOString(),
            ],
        ], 201);
    }

    /**
     * IMPL-012: Implementação real com Eloquent e filtro de projeto
     * AUTH-016: Adicionada autorização
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'name' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'is_public' => 'nullable|boolean',
        ]);

        $projectId = session('selected_project_id');
        $userId = auth()->id();

        // SECURITY: Verificar ownership e projeto
        $folder = MediaFolder::where('id', $id)
            ->where('created_by', $userId);
        if ($projectId) {
            $folder->where('project_id', $projectId);
        }
        $folder = $folder->firstOrFail();
        
        // SECURITY: Verificar autorização
        $this->authorize('update', $folder);

        $updateData = [];
        if ($request->has('name')) {
            $updateData['name'] = $request->name;
            $updateData['slug'] = Str::slug($request->name);
        }
        if ($request->has('description')) {
            $updateData['description'] = $request->description;
        }
        if ($request->has('is_public')) {
            $updateData['is_public'] = $request->is_public;
        }

        $folder->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Folder updated successfully',
            'data' => [
                'id' => $folder->id,
                'name' => $folder->name,
                'updated_at' => $folder->updated_at->toISOString(),
            ],
        ]);
    }

    /**
     * IMPL-012: Implementação real com Eloquent e filtro de projeto
     * AUTH-016: Adicionada autorização
     */
    public function destroy(string $id): JsonResponse
    {
        $projectId = session('selected_project_id');
        $userId = auth()->id();

        // SECURITY: Verificar ownership e projeto
        $folder = MediaFolder::where('id', $id)
            ->where('created_by', $userId);
        if ($projectId) {
            $folder->where('project_id', $projectId);
        }
        $folder = $folder->firstOrFail();
        
        // SECURITY: Verificar autorização
        $this->authorize('delete', $folder);

        $folder->delete();

        return response()->json([
            'success' => true,
            'message' => 'Folder deleted successfully',
        ]);
    }

    public function move(Request $request): JsonResponse
    {
        $request->validate([
            'media_id' => 'required|string',
            'folder_id' => 'required|string',
        ]);

        $this->organizeAction->execute($request->media_id, $request->folder_id);

        return response()->json([
            'success' => true,
            'message' => 'Media moved successfully',
        ]);
    }
}
