<?php

namespace App\Domains\EmailMarketing\Http\Controllers;

use App\Domains\EmailMarketing\Http\Requests\GetBestSendingTimeRequest;
use App\Domains\EmailMarketing\Http\Requests\GetContentRecommendationsRequest; // Supondo que este serviço exista
use App\Domains\EmailMarketing\Http\Requests\OptimizeSubjectRequest;
use App\Domains\EmailMarketing\Services\EmailOptimizationService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class EmailOptimizationController extends Controller
{
    protected EmailOptimizationService $emailOptimizationService;

    public function __construct(EmailOptimizationService $emailOptimizationService)
    {
        $this->emailOptimizationService = $emailOptimizationService;
    }

    /**
     * Get content recommendations for an email campaign.
     *
     * @param GetContentRecommendationsRequest $request
     *
     * @return JsonResponse
     */
    public function getContentRecommendations(GetContentRecommendationsRequest $request): JsonResponse
    {
        try {
            $recommendations = $this->emailOptimizationService->getContentRecommendations(
                $request->topic,
                $request->target_audience,
                $request->length,
            );
            return response()->json(['recommendations' => $recommendations]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    /**
     * Optimize an email subject line.
     *
     * @param OptimizeSubjectRequest $request
     *
     * @return JsonResponse
     */
    public function optimizeSubject(OptimizeSubjectRequest $request): JsonResponse
    {
        try {
            $optimizedSubject = $this->emailOptimizationService->optimizeSubject(
                $request->original_subject,
                $request->target_audience,
                $request->keywords,
            );
            return response()->json(['optimized_subject' => $optimizedSubject]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    /**
     * Get best sending time suggestions.
     *
     * @param GetBestSendingTimeRequest $request
     *
     * @return JsonResponse
     */
    public function getBestSendingTime(GetBestSendingTimeRequest $request): JsonResponse
    {
        try {
            $suggestions = $this->emailOptimizationService->getBestSendingTime(
                $request->campaign_id,
                $request->target_audience,
            );
            return response()->json(['suggestions' => $suggestions]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
