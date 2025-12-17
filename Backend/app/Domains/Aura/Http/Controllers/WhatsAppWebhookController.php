<?php

namespace App\Domains\Aura\Http\Controllers;

use App\Domains\Aura\Jobs\ProcessWhatsAppMessage;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

/**
 * WhatsAppWebhookController
 * 
 * SECURITY FIX (SEC-004): Implementada verificação HMAC e rate limiting
 */
class WhatsAppWebhookController extends Controller
{
    /**
     * Handle incoming webhook from WhatsApp/Meta
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function handle(Request $request): JsonResponse
    {
        /** @var ResponseFactory $response */
        $response = response();
        
        // SECURITY: Verificar assinatura HMAC do Meta/WhatsApp
        if (!$this->verifyMetaSignature($request)) {
            Log::warning('WhatsApp Webhook: Invalid signature', [
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
            return $response->json(['error' => 'Invalid signature'], 403);
        }
        
        // SECURITY: Rate limiting
        if (!$this->checkRateLimit($request)) {
            Log::warning('WhatsApp Webhook: Rate limit exceeded', [
                'ip' => $request->ip(),
            ]);
            return $response->json(['error' => 'Rate limit exceeded'], 429);
        }
        
        // Processar webhook do WhatsApp
        $payload = $request->all();
        
        Log::info('WhatsApp Webhook: Message received', [
            'ip' => $request->ip(),
            'payload_size' => strlen($request->getContent()),
            'object' => $payload['object'] ?? 'unknown',
            'entry_count' => count($payload['entry'] ?? [])
        ]);
        
        // Dispatch job para processamento assíncrono
        try {
            ProcessWhatsAppMessage::dispatch($payload)
                ->onQueue('whatsapp-webhooks')
                ->delay(now()->addSeconds(1)); // Pequeno delay para garantir resposta rápida
            
            Log::info('WhatsApp Webhook: Job dispatched successfully', [
                'queue' => 'whatsapp-webhooks'
            ]);
        } catch (\Exception $e) {
            Log::error('WhatsApp Webhook: Failed to dispatch job', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            // Em caso de falha no dispatch, ainda retornamos sucesso
            // para não causar retry do WhatsApp, mas logamos o erro
        }
        
        return $response->json(['status' => 'received']);
    }

    /**
     * Verification endpoint for Meta webhook setup
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function verify(Request $request): JsonResponse
    {
        // Verificação do webhook para WhatsApp
        $mode = $request->query('hub_mode');
        $token = $request->query('hub_verify_token');
        $challenge = $request->query('hub_challenge');

        $expectedToken = config('services.whatsapp.verify_token', '');
        
        // SECURITY: Verificar se token não está vazio
        if (empty($expectedToken)) {
            Log::error('WhatsApp Webhook: verify_token not configured');
            /** @var ResponseFactory $response */
            $response = response();
            return $response->json(['error' => 'Server configuration error'], 500);
        }

        if ($mode === 'subscribe' && hash_equals($expectedToken, (string) $token)) {
            Log::info('WhatsApp Webhook: Verification successful');
            return new JsonResponse($challenge);
        }

        Log::warning('WhatsApp Webhook: Verification failed', [
            'mode' => $mode,
            'ip' => $request->ip(),
        ]);

        /** @var ResponseFactory $response */
        $response = response();
        return $response->json(['error' => 'Unauthorized'], 403);
    }
    
    /**
     * Verify Meta/WhatsApp webhook signature (HMAC-SHA256)
     * 
     * @param Request $request
     * @return bool
     */
    protected function verifyMetaSignature(Request $request): bool
    {
        // Obter a assinatura do header
        $signature = $request->header('X-Hub-Signature-256');
        
        // Se não há assinatura e a configuração exige, falhar
        if (empty($signature)) {
            // Em desenvolvimento, pode-se querer permitir sem assinatura
            if (config('services.whatsapp.require_signature', true)) {
                return false;
            }
            return true;
        }
        
        // Obter o secret do app (app secret do Facebook/Meta)
        $appSecret = config('services.whatsapp.app_secret', '');
        
        if (empty($appSecret)) {
            Log::error('WhatsApp Webhook: app_secret not configured');
            return false;
        }
        
        // A assinatura vem no formato 'sha256=HASH'
        if (!str_starts_with($signature, 'sha256=')) {
            return false;
        }
        
        $hash = substr($signature, 7);
        $payload = $request->getContent();
        $expectedHash = hash_hmac('sha256', $payload, $appSecret);
        
        return hash_equals($expectedHash, $hash);
    }
    
    /**
     * Check rate limiting for webhook requests
     * 
     * @param Request $request
     * @return bool
     */
    protected function checkRateLimit(Request $request): bool
    {
        $ip = $request->ip();
        $cacheKey = "whatsapp_webhook_rate:{$ip}";
        $maxRequests = config('services.whatsapp.rate_limit', 100); // 100 requests per minute
        
        $attempts = Cache::get($cacheKey, 0);
        
        if ($attempts >= $maxRequests) {
            return false;
        }
        
        Cache::put($cacheKey, $attempts + 1, 60); // 60 seconds TTL
        
        return true;
    }
}
