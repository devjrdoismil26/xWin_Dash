<?php

namespace App\Domains\Leads\Http\Controllers;

use App\Domains\Leads\Services\ScoringService;
use App\Domains\Leads\Services\SegmentationService; // Supondo que este serviço exista
use App\Http\Controllers\Controller; // Supondo que este serviço exista
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategorizationController extends Controller
{
    protected ScoringService $scoringService;

    protected SegmentationService $segmentationService;

    public function __construct(ScoringService $scoringService, SegmentationService $segmentationService)
    {
        $this->scoringService = $scoringService;
        $this->segmentationService = $segmentationService;
    }

    /**
     * Get the score for a specific lead.
     *
     * @param int $leadId
     *
     * @return JsonResponse
     */
    public function getLeadScore(int $leadId): JsonResponse
    {
        try {
            $score = $this->scoringService->getLeadScore($leadId);
            return response()->json(['lead_id' => $leadId, 'score' => $score]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }

    /**
     * Get segments for a specific lead.
     *
     * @param int $leadId
     *
     * @return JsonResponse
     */
    public function getLeadSegments(int $leadId): JsonResponse
    {
        try {
            $segments = $this->segmentationService->getLeadSegments($leadId);
            return response()->json(['lead_id' => $leadId, 'segments' => $segments]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }

    /**
     * Update the score of a lead.
     *
     * @param Request $request
     * @param int     $leadId
     *
     * @return JsonResponse
     */
    public function updateLeadScore(Request $request, int $leadId): JsonResponse
    {
        $request->validate([
            'score_change' => 'required|integer',
            'reason' => 'nullable|string',
        ]);

        try {
            $lead = $this->scoringService->updateLeadScore(
                $leadId,
                $request->input('score_change'),
                $request->input('reason'),
            );
            return response()->json(['lead_id' => $lead->id, 'new_score' => $lead->score]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}
