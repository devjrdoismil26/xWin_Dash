<?php

namespace App\Domains\Universe\Http\Controllers;

use App\Domains\AI\Services\GeminiService;
use App\Domains\Universe\Services\AILaboratoryService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class AIIntegrationTestController extends Controller
{
    protected AILaboratoryService $aiLaboratoryService;

    protected GeminiService $geminiService;

    public function __construct(AILaboratoryService $aiLaboratoryService, GeminiService $geminiService)
    {
        $this->aiLaboratoryService = $aiLaboratoryService;
        $this->geminiService = $geminiService;
    }

    /**
     * Test connection to a specific AI service.
     *
     * @param string $serviceName The name of the AI service (e.g., 'gemini', 'openai').
     *
     * @return JsonResponse
     */
    public function testConnection(string $serviceName): JsonResponse
    {
        try {
            $result = $this->aiLaboratoryService->testAIServiceConnection($serviceName);
            return Response::json(['service' => $serviceName, 'status' => 'connected', 'details' => $result]);
        } catch (\Exception $e) {
            return Response::json(['service' => $serviceName, 'status' => 'failed', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Send a test prompt to a specific AI service and get a response.
     *
     * @param string  $serviceName the name of the AI service
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function testPrompt(string $serviceName, Request $request): JsonResponse
    {
        $request->validate([
            'prompt' => 'required|string',
        ]);

        try {
            $response = $this->aiLaboratoryService->sendTestPrompt($serviceName, $request->input('prompt'));
            return Response::json(['service' => $serviceName, 'prompt' => $request->input('prompt'), 'response' => $response]);
        } catch (\Exception $e) {
            return Response::json(['service' => $serviceName, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Test complete integration of all AI services.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function testCompleteIntegration(Request $request): JsonResponse
    {
        try {
            $services = ['openai', 'gemini', 'anthropic'];
            $results = [];

            foreach ($services as $service) {
                try {
                    $connectionResult = $this->aiLaboratoryService->testAIServiceConnection($service);
                    $results[$service] = [
                        'connection' => $connectionResult,
                        'status' => 'success'
                    ];
                } catch (\Exception $e) {
                    $results[$service] = [
                        'connection' => null,
                        'status' => 'failed',
                        'error' => $e->getMessage()
                    ];
                }
            }

            return Response::json([
                'message' => 'Complete AI integration test completed',
                'results' => $results,
                'timestamp' => now()->toISOString()
            ]);
        } catch (\Exception $e) {
            return Response::json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Quick test of AI services.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function testQuick(Request $request): JsonResponse
    {
        try {
            // Test with a simple prompt
            $testPrompt = 'Hello, this is a quick test. Please respond with "Test successful".';
            $response = $this->aiLaboratoryService->sendTestPrompt('openai', $testPrompt);

            return Response::json([
                'message' => 'Quick AI test completed',
                'test_prompt' => $testPrompt,
                'response' => $response,
                'timestamp' => now()->toISOString()
            ]);
        } catch (\Exception $e) {
            return Response::json(['error' => $e->getMessage()], 500);
        }
    }
}
