<?php

namespace App\Domains\Universe\Http\Controllers;

use App\Domains\Universe\Services\AILaboratoryService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;

class AILaboratoryController extends Controller
{
    protected AILaboratoryService $aiLaboratoryService;

    public function __construct(AILaboratoryService $aiLaboratoryService)
    {
        $this->aiLaboratoryService = $aiLaboratoryService;
    }

    /**
     * Send a prompt to the AI laboratory for testing.
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function sendPrompt(Request $request): JsonResponse
    {
        $request->validate([
            'prompt' => 'required|string',
            'model' => 'nullable|string',
            'parameters' => 'nullable|array',
            'service' => 'required|string',
        ]);

        try {
            $result = $this->aiLaboratoryService->sendTestPrompt(
                $request->input('service'),
                $request->input('prompt'),
                $request->input('model'),
                $request->input('parameters', []),
            );
            return Response::json($result);
        } catch (\Exception $e) {
            return Response::json(['message' => 'Failed to process AI prompt.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get the history of AI generations in the laboratory.
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function getGenerationHistory(Request $request): JsonResponse
    {
        if (!Auth::check()) {
            return Response::json(['message' => 'Unauthenticated.'], 401);
        }

        try {
            /** @var int $userId */
            $userId = (string) Auth::id();
            $history = $this->aiLaboratoryService->getGenerationHistory($userId, $request->get('per_page', 15));
            return Response::json($history);
        } catch (\Exception $e) {
            return Response::json(['message' => 'Failed to retrieve AI generation history.', 'error' => $e->getMessage()], 500);
        }
    }
}
