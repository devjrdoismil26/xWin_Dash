<?php

namespace App\Domains\SocialBuffer\Http\Controllers;

use App\Domains\SocialBuffer\Services\EngagementService;
use App\Http\Controllers\Controller; // Supondo que este serviço exista
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EngagementController extends Controller
{
    protected EngagementService $engagementService;

    public function __construct(EngagementService $engagementService)
    {
        $this->engagementService = $engagementService;
    }

    /**
     * Get engagement metrics for a specific post.
     *
     * @param int $postId
     *
     * @return JsonResponse
     */
    public function getPostEngagement(int $postId): JsonResponse
    {
        // SECURITY: Verificar autorização
        $post = \App\Domains\SocialBuffer\Models\SocialPost::find($postId);
        if ($post) {
            $this->authorize('view', $post);
        }
        
        try {
            $metrics = $this->engagementService->getEngagementMetricsForPost($postId);
            return response()->json($metrics);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }

    /**
     * Record an engagement interaction for a post.
     *
     * @param int     $postId
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function recordInteraction(int $postId, Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $post = \App\Domains\SocialBuffer\Models\SocialPost::find($postId);
        if ($post) {
            $this->authorize('view', $post);
        }
        
        $request->validate([
            'type' => 'required|string|in:like,comment,share,click,view',
            'user_id' => 'nullable|integer|exists:users,id',
            'value' => 'nullable|string',
        ]);

        try {
            $interaction = $this->engagementService->recordInteraction(
                $postId,
                $request->input('type'),
                $request->input('user_id'),
                $request->input('value'),
            );
            return response()->json(['message' => 'Interaction recorded.', 'interaction' => $interaction], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}
