<?php

namespace App\Domains\Media\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use App\Domains\Media\Infrastructure\Persistence\Eloquent\MediaFileModel;
use App\Domains\Media\Models\MediaFolder;
use App\Domains\Media\Models\MediaFile;

class LibraryController extends Controller
{
    /**
     * Get Media Library data
     * Endpoint: GET /api/media/library
     * AUTH-017: Adicionada autorização
     */
    public function library(): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', MediaFile::class);
        
        try {
            $userId = auth()->id();
            $projectId = session('selected_project_id');

            // IMPL-011: Buscar arquivos reais do banco com filtro de projeto
            $filesQuery = MediaFileModel::where('user_id', $userId);
            if ($projectId) {
                $filesQuery->where('project_id', $projectId);
            }
            $files = $filesQuery->orderBy('created_at', 'desc')
                ->limit(50)
                ->get()
                ->map(function($file) {
                    return [
                        'id' => $file->id,
                        'name' => $file->name,
                        'type' => $this->getFileType($file->mime_type),
                        'format' => $file->mime_type,
                        'size' => $file->size,
                        'url' => $file->path,
                        'thumbnail_url' => $file->path,
                        'tags' => [],
                        'metadata' => [
                            'created_at' => $file->created_at->toISOString(),
                            'updated_at' => $file->updated_at->toISOString(),
                            'uploaded_by' => (string)$file->user_id,
                        ],
                        'is_favorite' => false,
                        'views_count' => 0,
                        'downloads_count' => 0,
                    ];
                });

            // IMPL-011: Folders reais com filtro de projeto
            $foldersQuery = MediaFolder::where('created_by', $userId);
            if ($projectId) {
                $foldersQuery->where('project_id', $projectId);
            }
            $folders = $foldersQuery->orderBy('name')
                ->get()
                ->map(function($folder) {
                    return [
                        'id' => $folder->id,
                        'name' => $folder->name,
                        'slug' => $folder->slug,
                        'parent_id' => $folder->parent_id,
                        'files_count' => $folder->files()->count(),
                        'created_at' => $folder->created_at->toISOString(),
                    ];
                });

            // Stats com filtro de projeto
            $statsQuery = MediaFileModel::where('user_id', $userId);
            if ($projectId) {
                $statsQuery->where('project_id', $projectId);
            }
            $totalFiles = (clone $statsQuery)->count();
            $totalSize = (clone $statsQuery)->sum('size');

            $stats = [
                'total_files' => $totalFiles,
                'total_size' => $totalSize,
                'by_type' => [
                    'images' => (clone $statsQuery)->where('mime_type', 'like', 'image/%')->count(),
                    'videos' => (clone $statsQuery)->where('mime_type', 'like', 'video/%')->count(),
                    'audio' => (clone $statsQuery)->where('mime_type', 'like', 'audio/%')->count(),
                    'documents' => (clone $statsQuery)->where('mime_type', 'like', 'application/%')->count(),
                    'others' => 0,
                ],
                'storage_used_percentage' => min(($totalSize / (1024 * 1024 * 1024 * 10)) * 100, 100), // 10GB limit
                'recent_uploads' => (clone $statsQuery)->whereBetween('created_at', [now()->subDays(7), now()])->count(),
                'favorites_count' => 0,
            ];

            return response()->json([
                'success' => true,
                'data' => [
                    'files' => $files->toArray(),
                    'folders' => $folders,
                    'stats' => $stats,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function getFileType(string $mimeType): string
    {
        if (str_starts_with($mimeType, 'image/')) return 'image';
        if (str_starts_with($mimeType, 'video/')) return 'video';
        if (str_starts_with($mimeType, 'audio/')) return 'audio';
        if (str_starts_with($mimeType, 'application/')) return 'document';
        return 'other';
    }
}
