<?php

namespace App\Domains\Universe\Http\Controllers;

use App\Application\Universe\Services\AIPersonalizationService;
use App\Domains\Universe\Services\BusinessIntelligenceEngine;
use App\Domains\Universe\Services\WorkflowAIIntegrationService;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response as ResponseFacade;

class UniverseAIController extends Controller
{
    protected AIPersonalizationService $aiPersonalizationService;

    protected WorkflowAIIntegrationService $workflowAIIntegrationService;

    protected BusinessIntelligenceEngine $businessIntelligenceEngine;

    public function __construct(
        AIPersonalizationService $aiPersonalizationService,
        WorkflowAIIntegrationService $workflowAIIntegrationService,
        BusinessIntelligenceEngine $businessIntelligenceEngine,
    ) {
        $this->aiPersonalizationService = $aiPersonalizationService;
        $this->workflowAIIntegrationService = $workflowAIIntegrationService;
        $this->businessIntelligenceEngine = $businessIntelligenceEngine;
    }

    /**
     * Personalize content for a user based on AI.
     *
     * @param int     $userId
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function personalizeContent(int $userId, Request $request): JsonResponse
    {
        $request->validate([
            'context' => 'required|string',
            'data' => 'nullable|array',
        ]);

        try {
            /** @var User $user */
            $user = User::findOrFail($userId);
            $personalizedContent = $this->aiPersonalizationService->personalizeContent($user, $request->input('context'), $request->input('data', []));
            return ResponseFacade::json(['user_id' => $userId, 'personalized_content' => $personalizedContent]);
        } catch (\Exception $e) {
            return ResponseFacade::json(['message' => 'Failed to personalize content.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Optimize a workflow using AI.
     *
     * @param int     $workflowId
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function optimizeWorkflow(int $workflowId, Request $request): JsonResponse
    {
        $request->validate([
            'optimization_goals' => 'required|array',
        ]);

        try {
            $optimizationResult = $this->workflowAIIntegrationService->optimizeWorkflow($workflowId, $request->input('optimization_goals'));
            return ResponseFacade::json(['workflow_id' => $workflowId, 'optimization_result' => $optimizationResult]);
        } catch (\Exception $e) {
            return ResponseFacade::json(['message' => 'Failed to optimize workflow.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get business intelligence insights using AI.
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function getBusinessInsights(Request $request): JsonResponse
    {
        $request->validate([
            'data_source' => 'required|string',
            'filters' => 'nullable|array',
        ]);

        try {
            $insights = $this->businessIntelligenceEngine->getInsights($request->input('data_source'), $request->input('filters', []));
            return ResponseFacade::json(['insights' => $insights]);
        } catch (\Exception $e) {
            return ResponseFacade::json(['message' => 'Failed to get business insights.', 'error' => $e->getMessage()], 500);
        }
    }
}
