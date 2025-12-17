<?php

namespace App\Domains\Media\Http\Controllers;

use App\Domains\Media\Application\Actions\BulkDeleteMediaAction;
use App\Domains\Media\Application\Actions\OptimizeMediaAction;
use App\Domains\Media\Application\Actions\OrganizeMediaAction;
use App\Domains\Media\Application\Actions\UploadMediaAction;
use App\Domains\Media\Application\DTOs\MediaOptimizationDTO;
use App\Domains\Media\Application\DTOs\MediaUploadDTO;
use App\Domains\Media\Infrastructure\Persistence\Eloquent\MediaFileModel;
use App\Domains\Media\Models\MediaFile;
use App\Domains\Media\Policies\MediaPolicy;
use App\Domains\Media\Services\MediaAIService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * MediaController
 * 
 * SECURITY FIX (AUTH-004): Implementada autorização e multi-tenancy
 */
class MediaController extends Controller
{
    public function __construct(
        private UploadMediaAction $uploadAction,
        private OrganizeMediaAction $organizeAction,
        private OptimizeMediaAction $optimizeAction,
        private BulkDeleteMediaAction $bulkDeleteAction,
        private MediaAIService $mediaAIService
    ) {}

    /**
     * Get current project ID for multi-tenancy
     */
    protected function getProjectId(): ?string
    {
        return session('selected_project_id');
    }

    /**
     * IMPL-010: Refatorado para usar MediaFileModel (Eloquent)
     * AUTH-011: Adicionada autorização
     */
    public function index(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', MediaFile::class);
        
        $projectId = $this->getProjectId();
        
        // SECURITY: Usar Model com BelongsToProject (filtro automático)
        $query = MediaFileModel::query();

        if ($request->folder_id) {
            $query->where('folder_id', $request->folder_id);
        }

        if ($request->type) {
            $query->where('mime_type', 'like', "{$request->type}%");
        }

        // Otimização: Cache de 3 minutos para listagem de mídia
        $cacheKey = 'media_list_' . md5($request->folder_id . $request->type . request()->get('page', 1));
        
        $media = Cache::remember($cacheKey, 180, function () use ($query) {
            // Otimização: Eager loading de relacionamentos
            return $query->with(['folder', 'user'])
                ->orderByDesc('created_at')
                ->paginate(20);
        });

        return response()->json([
            'success' => true,
            'data' => $media,
        ]);
    }

    /**
     * AUTH-011: Adicionada autorização
     */
    public function store(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('create', MediaFile::class);
        
        $request->validate([
            'file' => 'required|file|max:10240',
            'folder_id' => 'nullable|string',
            'alt_text' => 'nullable|string',
            'tags' => 'nullable|array',
        ]);

        $dto = new MediaUploadDTO(
            file: $request->file('file'),
            folder_id: $request->folder_id,
            alt_text: $request->alt_text,
            tags: $request->tags ?? [],
            is_public: $request->is_public ?? true,
            project_id: $this->getProjectId()
        );

        $media = $this->uploadAction->execute($dto);

        return response()->json([
            'success' => true,
            'data' => $media,
        ], 201);
    }

    /**
     * IMPL-010: Refatorado para usar MediaFileModel (Eloquent)
     * AUTH-011: Adicionada autorização
     */
    public function show(string $id): JsonResponse
    {
        // SECURITY: Usar Model com BelongsToProject (filtro automático)
        $media = MediaFileModel::findOrFail($id);
        
        // SECURITY: Verificar autorização
        $this->authorize('view', MediaFile::findOrFail($id));

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $media->id,
                'name' => $media->name,
                'file_name' => $media->file_name,
                'mime_type' => $media->mime_type,
                'path' => $media->path,
                'size' => $media->size,
                'folder_id' => $media->folder_id,
                'user_id' => $media->user_id,
                'project_id' => $media->project_id,
                'created_at' => $media->created_at->toISOString(),
                'updated_at' => $media->updated_at->toISOString(),
            ],
        ]);
    }

    /**
     * IMPL-010: Refatorado para usar MediaFileModel (Eloquent)
     * AUTH-011: Adicionada autorização
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'name' => 'nullable|string',
            'folder_id' => 'nullable|string',
        ]);

        // SECURITY: Usar Model com BelongsToProject (filtro automático)
        $media = MediaFileModel::findOrFail($id);
        
        // SECURITY: Verificar autorização
        $this->authorize('update', MediaFile::findOrFail($id));

        $media->update($request->only(['name', 'folder_id']));

        return response()->json([
            'success' => true,
            'message' => 'Media updated successfully',
            'data' => [
                'id' => $media->id,
                'name' => $media->name,
                'updated_at' => $media->updated_at->toISOString(),
            ],
        ]);
    }

    /**
     * IMPL-010: Refatorado para usar MediaFileModel (Eloquent)
     * AUTH-011: Adicionada autorização
     */
    public function destroy(string $id): JsonResponse
    {
        // SECURITY: Usar Model com BelongsToProject (filtro automático)
        $media = MediaFileModel::findOrFail($id);
        
        // SECURITY: Verificar autorização
        $this->authorize('delete', MediaFile::findOrFail($id));

        $this->bulkDeleteAction->execute([$id]);

        return response()->json([
            'success' => true,
            'message' => 'Media deleted successfully',
        ]);
    }

    /**
     * IMPL-010: Refatorado para usar MediaFileModel (Eloquent)
     * AUTH-011: Adicionada autorização
     */
    public function optimize(Request $request): JsonResponse
    {
        $request->validate([
            'media_id' => 'required|string',
            'quality' => 'nullable|integer|min:1|max:100',
            'format' => 'nullable|string',
        ]);

        // SECURITY: Usar Model com BelongsToProject (filtro automático)
        $media = MediaFileModel::findOrFail($request->media_id);
        
        // SECURITY: Verificar autorização
        $this->authorize('update', MediaFile::findOrFail($request->media_id));

        $dto = new MediaOptimizationDTO(
            media_id: $request->media_id,
            quality: $request->quality ?? 85,
            format: $request->format ?? 'webp'
        );

        $this->optimizeAction->execute($dto);

        return response()->json([
            'success' => true,
            'message' => 'Media optimized successfully',
        ]);
    }

    /**
     * IMPL-010: Refatorado para usar MediaFileModel (Eloquent)
     * AUTH-011: Adicionada autorização
     */
    public function bulkDelete(Request $request): JsonResponse
    {
        $request->validate([
            'media_ids' => 'required|array',
        ]);

        // SECURITY: Verificar autorização para deletar
        $this->authorize('delete', MediaFile::class);

        // SECURITY: Usar Model com BelongsToProject (filtro automático)
        $mediaFiles = MediaFileModel::whereIn('id', $request->media_ids)->get();
        
        if ($mediaFiles->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No valid media files found',
            ], 404);
        }

        $validIds = $mediaFiles->pluck('id')->toArray();
        $count = $this->bulkDeleteAction->execute($validIds);

        return response()->json([
            'success' => true,
            'message' => "Deleted {$count} media files",
        ]);
    }

    // ===== AI ENDPOINTS =====

    /**
     * Generate AI tags for media
     */
    public function generateAITags(Request $request, string $id): JsonResponse
    {
        $this->authorize('update', MediaFile::findOrFail($id));
        
        $result = $this->mediaAIService->generateAITags($id);
        
        return response()->json($result, $result['success'] ? 200 : 400);
    }

    /**
     * Generate AI description for media
     */
    public function generateAIDescription(Request $request, string $id): JsonResponse
    {
        $this->authorize('update', MediaFile::findOrFail($id));
        
        $result = $this->mediaAIService->generateAIDescription($id);
        
        return response()->json($result, $result['success'] ? 200 : 400);
    }

    /**
     * Detect objects in image
     */
    public function detectObjects(Request $request, string $id): JsonResponse
    {
        $this->authorize('view', MediaFile::findOrFail($id));
        
        $result = $this->mediaAIService->detectObjects($id);
        
        return response()->json($result, $result['success'] ? 200 : 400);
    }

    /**
     * Recognize faces in image
     */
    public function recognizeFaces(Request $request, string $id): JsonResponse
    {
        $this->authorize('view', MediaFile::findOrFail($id));
        
        $result = $this->mediaAIService->recognizeFaces($id);
        
        return response()->json($result, $result['success'] ? 200 : 400);
    }

    /**
     * Extract text from image (OCR)
     */
    public function extractText(Request $request, string $id): JsonResponse
    {
        $this->authorize('view', MediaFile::findOrFail($id));
        
        $result = $this->mediaAIService->extractText($id);
        
        return response()->json($result, $result['success'] ? 200 : 400);
    }

    /**
     * Categorize media automatically
     */
    public function categorizeMedia(Request $request, string $id): JsonResponse
    {
        $this->authorize('update', MediaFile::findOrFail($id));
        
        $result = $this->mediaAIService->categorizeMedia($id);
        
        return response()->json($result, $result['success'] ? 200 : 400);
    }
}
