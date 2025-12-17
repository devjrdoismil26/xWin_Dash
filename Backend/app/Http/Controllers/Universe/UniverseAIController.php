<?php

namespace App\Http\Controllers\Universe;

use App\Http\Controllers\Controller;
use App\Domains\Universe\Services\AILaboratoryService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UniverseAIController extends Controller
{
    public function __construct(
        private AILaboratoryService $aiService
    ) {}

    public function personalize(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'instance_id' => 'required|uuid|exists:universe_instances,id',
        ]);

        $this->aiService->personalizeForUser(
            $validated['instance_id'],
            $request->user()->id
        );

        return response()->json([
            'message' => 'AI personalization started',
            'status' => 'processing',
        ]);
    }

    public function analyze(string $instanceId): JsonResponse
    {
        $analysis = $this->aiService->analyzeInstance($instanceId);

        return response()->json($analysis);
    }

    public function recommendations(string $instanceId): JsonResponse
    {
        $recommendations = $this->aiService->generateOptimizations($instanceId);

        return response()->json($recommendations);
    }
}
