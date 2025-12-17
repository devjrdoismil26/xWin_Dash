<?php

namespace App\Domains\SocialBuffer\Http\Controllers;

use App\Domains\SocialBuffer\Services\HashtagService;
use App\Domains\SocialBuffer\Infrastructure\Persistence\Eloquent\HashtagGroupModel;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * HashtagController
 * 
 * SECURITY FIX (AUTH-004): Implementada autorização em todos os métodos
 */
class HashtagController extends Controller
{
    protected HashtagService $hashtagService;

    public function __construct(HashtagService $hashtagService)
    {
        $this->hashtagService = $hashtagService;
    }

    /**
     * Display a listing of the hashtag groups.
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', HashtagGroupModel::class);
        
        $hashtagGroups = $this->hashtagService->getAllHashtagGroups(auth()->id(), $request->get('per_page', 15));
        return response()->json($hashtagGroups);
    }

    /**
     * Store a newly created hashtag group in storage.
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('create', HashtagGroupModel::class);
        
        $request->validate([
            'name' => 'required|string|max:255',
            'hashtags' => 'required|array',
            'hashtags.*' => 'string|max:255',
        ]);

        $hashtagGroup = $this->hashtagService->createHashtagGroup(auth()->id(), $request->validated());
        return response()->json($hashtagGroup, 201);
    }

    /**
     * Display the specified hashtag group.
     *
     * @param int $id
     *
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $hashtagGroup = $this->hashtagService->getHashtagGroupById($id);
        if (!$hashtagGroup) {
            return response()->json(['message' => 'Hashtag Group not found.'], 404);
        }
        
        // SECURITY: Buscar model e verificar autorização
        $hashtagGroupModel = HashtagGroupModel::find($id);
        if ($hashtagGroupModel) {
            $this->authorize('view', $hashtagGroupModel);
        }
        
        return response()->json($hashtagGroup);
    }

    /**
     * Update the specified hashtag group in storage.
     *
     * @param Request $request
     * @param int     $id
     *
     * @return JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'hashtags' => 'sometimes|required|array',
            'hashtags.*' => 'string|max:255',
        ]);

        // SECURITY: Buscar model e verificar autorização
        $hashtagGroupModel = HashtagGroupModel::find($id);
        if (!$hashtagGroupModel) {
            return response()->json(['message' => 'Hashtag Group not found.'], 404);
        }
        
        $this->authorize('update', $hashtagGroupModel);

        $hashtagGroup = $this->hashtagService->updateHashtagGroup($id, $request->validated());
        if (!$hashtagGroup) {
            return response()->json(['message' => 'Hashtag Group not found.'], 404);
        }
        return response()->json($hashtagGroup);
    }

    /**
     * Remove the specified hashtag group from storage.
     *
     * @param int $id
     *
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        // SECURITY: Buscar model e verificar autorização
        $hashtagGroupModel = HashtagGroupModel::find($id);
        if (!$hashtagGroupModel) {
            return response()->json(['message' => 'Hashtag Group not found.'], 404);
        }
        
        $this->authorize('delete', $hashtagGroupModel);
        
        $success = $this->hashtagService->deleteHashtagGroup($id);
        if (!$success) {
            return response()->json(['message' => 'Hashtag Group not found.'], 404);
        }
        return response()->json(['message' => 'Hashtag Group deleted successfully.']);
    }
}
