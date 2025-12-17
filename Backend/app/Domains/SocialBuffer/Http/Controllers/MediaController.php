<?php

namespace App\Domains\SocialBuffer\Http\Controllers;

use App\Domains\SocialBuffer\Services\MediaService;
use App\Http\Controllers\Controller; // Supondo que este serviço exista
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MediaController extends Controller
{
    protected MediaService $mediaService;

    public function __construct(MediaService $mediaService)
    {
        $this->mediaService = $mediaService;
    }

    /**
     * Display a listing of media files for social posts.
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização (usar SocialPost como base)
        $this->authorize('viewAny', \App\Domains\SocialBuffer\Models\SocialPost::class);
        
        $media = $this->mediaService->getAllMedia(auth()->id(), $request->get('per_page', 15));
        return response()->json($media);
    }

    /**
     * Store a newly uploaded media file for social posts.
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('create', \App\Domains\SocialBuffer\Models\SocialPost::class);
        
        $request->validate([
            'file' => 'required|file|mimes:jpeg,png,jpg,gif,mp4,mov,avi|max:10240', // Max 10MB
        ]);

        $media = $this->mediaService->uploadMedia(auth()->id(), $request->file('file'));
        return response()->json($media, 201);
    }

    /**
     * Display the specified media file.
     *
     * @param int $id
     *
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        // SECURITY: Verificar autorização básica
        $this->authorize('viewAny', \App\Domains\SocialBuffer\Models\SocialPost::class);
        
        $media = $this->mediaService->getMediaById($id);
        if (!$media) {
            return response()->json(['message' => 'Media not found.'], 404);
        }
        return response()->json($media);
    }

    /**
     * Remove the specified media file from storage.
     *
     * @param int $id
     *
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        // SECURITY: Verificar autorização básica
        $this->authorize('delete', \App\Domains\SocialBuffer\Models\SocialPost::class);
        
        $success = $this->mediaService->deleteMedia($id);
        if (!$success) {
            return response()->json(['message' => 'Media not found.'], 404);
        }
        return response()->json(['message' => 'Media deleted successfully.']);
    }
}
