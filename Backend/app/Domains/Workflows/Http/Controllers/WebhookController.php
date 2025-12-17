<?php

namespace App\Domains\Workflows\Http\Controllers;

use App\Domains\Workflows\Services\WorkflowTriggerService;
use App\Domains\Workflows\Services\WorkflowService;
use App\Domains\Workflows\Models\Workflow;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

/**
 * WebhookController
 * 
 * Handles incoming webhook requests to trigger workflows.
 * 
 * SECURITY FIX (SEC-003): Implementada verificação de assinatura HMAC-SHA256
 */
class WebhookController extends Controller
{
    protected WorkflowTriggerService $workflowTriggerService;
    protected WorkflowService $workflowService;

    public function __construct(
        WorkflowTriggerService $workflowTriggerService,
        WorkflowService $workflowService
    ) {
        $this->workflowTriggerService = $workflowTriggerService;
        $this->workflowService = $workflowService;
    }

    /**
     * Handle incoming webhook requests to trigger workflows.
     *
     * @param string  $webhookId O ID único do webhook
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function handle(string $webhookId, Request $request): JsonResponse
    {
        // ========================================
        // SECURITY: Verificação de assinatura HMAC
        // ========================================
        if (!$this->verifyWebhookSignature($webhookId, $request)) {
            Log::warning("Webhook signature verification failed for ID: {$webhookId}", [
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Invalid webhook signature.',
            ], 403);
        }

        // ========================================
        // SECURITY: Rate limiting por webhook
        // ========================================
        if (!$this->checkRateLimit($webhookId, $request)) {
            Log::warning("Webhook rate limit exceeded for ID: {$webhookId}", [
                'ip' => $request->ip(),
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Rate limit exceeded. Please try again later.',
            ], 429);
        }

        Log::info("Webhook recebido para ID: {$webhookId}", [
            'ip' => $request->ip(),
            'payload_size' => strlen($request->getContent()),
        ]);

        try {
            // Disparar o workflow associado a este webhook
            $execution = $this->workflowTriggerService->triggerWorkflowByWebhook($webhookId, $request->all());

            return response()->json([
                'success' => true,
                'message' => 'Webhook received and workflow triggered.',
                'execution_id' => $execution->id,
            ], 200);
        } catch (\Exception $e) {
            Log::error("Falha ao processar webhook ID: {$webhookId}", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to process webhook.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal error',
            ], 500);
        }
    }

    /**
     * Verify the webhook signature using HMAC-SHA256.
     *
     * @param string  $webhookId
     * @param Request $request
     *
     * @return bool
     */
    protected function verifyWebhookSignature(string $webhookId, Request $request): bool
    {
        // Obter a assinatura do header
        $signature = $request->header('X-Webhook-Signature') 
            ?? $request->header('X-Hub-Signature-256')
            ?? $request->header('X-Signature');
        
        // Se não há assinatura e a verificação é obrigatória, falhar
        if (empty($signature) && config('workflows.webhook_signature_required', true)) {
            return false;
        }
        
        // Se não há assinatura mas não é obrigatório (modo dev), permitir
        if (empty($signature) && !config('workflows.webhook_signature_required', true)) {
            Log::warning("Webhook accepted without signature (dev mode) for ID: {$webhookId}");
            return true;
        }
        
        // Obter o segredo do webhook
        // Primeiro tenta obter um segredo específico para este webhook
        $secret = $this->getWebhookSecret($webhookId);
        
        if (empty($secret)) {
            Log::error("No webhook secret configured for ID: {$webhookId}");
            return false;
        }
        
        // Calcular a assinatura esperada
        $payload = $request->getContent();
        $expectedSignature = 'sha256=' . hash_hmac('sha256', $payload, $secret);
        
        // Comparar assinaturas usando timing-safe comparison
        return hash_equals($expectedSignature, $signature);
    }

    /**
     * Get the webhook secret for a specific webhook.
     *
     * @param string $webhookId
     *
     * @return string|null
     */
    protected function getWebhookSecret(string $webhookId): ?string
    {
        // Tentar obter segredo específico do webhook do banco de dados ou cache
        $cacheKey = "webhook_secret:{$webhookId}";
        
        return Cache::remember($cacheKey, 3600, function () use ($webhookId) {
            // Tentar buscar do workflow associado
            try {
                $workflow = $this->workflowTriggerService->getWorkflowByWebhookId($webhookId);
                if ($workflow && !empty($workflow->webhook_secret)) {
                    return $workflow->webhook_secret;
                }
            } catch (\Exception $e) {
                // Ignorar erro e usar fallback
            }
            
            // Fallback para segredo global
            return config('workflows.webhook_secret');
        });
    }

    /**
     * Check rate limiting for webhook requests.
     *
     * @param string  $webhookId
     * @param Request $request
     *
     * @return bool
     */
    protected function checkRateLimit(string $webhookId, Request $request): bool
    {
        $maxAttempts = config('workflows.webhook_rate_limit', 60); // 60 requests per minute
        $decayMinutes = 1;
        
        $key = "webhook_rate_limit:{$webhookId}:{$request->ip()}";
        
        $attempts = Cache::get($key, 0);
        
        if ($attempts >= $maxAttempts) {
            return false;
        }
        
        Cache::put($key, $attempts + 1, now()->addMinutes($decayMinutes));
        
        return true;
    }

    /**
     * Trigger a workflow via webhook (authenticated endpoint for testing).
     * AUTH-PENDENTE-012: Adicionada autorização
     *
     * @param string  $workflowId
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function triggerWorkflow(string $workflowId, Request $request): JsonResponse
    {
        // SECURITY: Verificar autenticação e autorização
        if (!auth()->check()) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication required.',
            ], 401);
        }
        
        // SECURITY: Buscar workflow e verificar autorização
        $workflow = Workflow::findOrFail($workflowId);
        $this->authorize('view', $workflow);
        
        try {
            $execution = $this->workflowService->startWorkflow($workflowId, $request->all());

            return response()->json([
                'success' => true,
                'message' => 'Workflow triggered successfully.',
                'execution_id' => $execution->id,
            ], 200);
        } catch (\Exception $e) {
            Log::error("Failed to trigger workflow ID: {$workflowId}", [
                'error' => $e->getMessage(),
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to trigger workflow.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal error',
            ], 500);
        }
    }

    /**
     * Get webhook documentation for a specific workflow.
     * AUTH-PENDENTE-012: Adicionada autorização
     *
     * @param string $workflowId
     *
     * @return JsonResponse
     */
    public function getWebhookDocs(string $workflowId): JsonResponse
    {
        // SECURITY: Verificar autenticação e autorização
        if (!auth()->check()) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication required.',
            ], 401);
        }
        
        // SECURITY: Buscar workflow e verificar autorização
        $workflow = Workflow::findOrFail($workflowId);
        $this->authorize('view', $workflow);
        
        try {
            return response()->json([
                'success' => true,
                'data' => [
                    'workflow_id' => $workflowId,
                    'webhook_url' => route('workflows.webhook.trigger', ['workflowId' => $workflowId]),
                    'method' => 'POST',
                    'headers' => [
                        'Content-Type' => 'application/json',
                        'X-Webhook-Signature' => 'sha256=<hmac_signature>',
                    ],
                    'signature_algorithm' => 'HMAC-SHA256',
                    'signature_format' => 'sha256=<hex_encoded_signature>',
                    'rate_limit' => config('workflows.webhook_rate_limit', 60) . ' requests per minute',
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Workflow not found.',
            ], 404);
        }
    }

    /**
     * Test webhook endpoint (authenticated, for development).
     * AUTH-PENDENTE-012: Adicionada autorização
     *
     * @param string  $workflowId
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function testWebhook(string $workflowId, Request $request): JsonResponse
    {
        // SECURITY: Verificar autenticação e autorização
        if (!auth()->check()) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication required.',
            ], 401);
        }
        
        // SECURITY: Buscar workflow e verificar autorização
        $workflow = Workflow::findOrFail($workflowId);
        $this->authorize('view', $workflow);
        
        try {
            // Simular execução sem realmente disparar
            return response()->json([
                'success' => true,
                'message' => 'Webhook test successful.',
                'workflow' => [
                    'id' => $workflow->id,
                    'name' => $workflow->name,
                    'is_active' => $workflow->status === 'active',
                ],
                'payload_received' => $request->all(),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Webhook test failed.',
                'error' => $e->getMessage(),
            ], 400);
        }
    }
}
