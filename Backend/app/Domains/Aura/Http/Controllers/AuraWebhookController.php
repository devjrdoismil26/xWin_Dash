<?php

namespace App\Domains\Aura\Http\Controllers;

use App\Domains\Aura\Jobs\ProcessAuraInboundMessageJob;
use App\Domains\Core\Http\Controllers\Controller as BaseController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Support\Facades\Log as LoggerFacade;

// Adicionado

class AuraWebhookController extends BaseController
{
    /**
     * Handle incoming webhook messages for Aura.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\JsonResponse // Alterado de Response para JsonResponse
     */
    public function handleInbound(Request $request): JsonResponse
    {
        LoggerFacade::info('Aura Inbound Webhook Received', $request->all());

        // 1. Verificação de Assinatura do Webhook (CRUCIAL para segurança)
        $webhookSecret = config('services.whatsapp.meta.webhook_verify_token');
        if (!$this->verifyWebhookSignature($request, $webhookSecret)) {
            LoggerFacade::warning('Webhook signature verification failed
                . ', ['ip' => $request->ip(), 'headers' => $request->headers->all()]);
            /** @var ResponseFactory $response */
            $response = response();
            return $response->json(['message' => 'Unauthorized'], 403);
        }

        // 2. Despacha o Job para processamento assíncrono
        ProcessAuraInboundMessageJob::dispatch($request->all());

        /** @var ResponseFactory $response */
        $response = response();
        return $response->json(['message' => 'Webhook received and processing'], 200);
    }

    /**
     * Verify the webhook signature.
     *
     * @param \Illuminate\Http\Request $request
     * @param string                   $secret
     *
     * @return bool
     */
    protected function verifyWebhookSignature(Request $request, string $secret): bool
    {
        $signature = $request->header('X-Hub-Signature-256');

        if (!$signature || !is_string($signature)) {
            return false;
        }

        // A assinatura vem no formato 'sha256=HASH', então precisamos extrair apenas o HASH
        list($algo, $hash) = explode('=', $signature, 2);

        if ($algo !== 'sha256') {
            return false;
        }

        $payload = $request->getContent();
        $expectedHash = hash_hmac('sha256', $payload, $secret);

        return hash_equals($hash, $expectedHash);
    }

    /**
     * Get webhooks
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $webhooks = $this->auraWebhookService->getWebhooks($request->all());
        return response()->json(['data' => $webhooks]);
    }

    /**
     * Create webhook
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'url' => 'required|url',
            'events' => 'required|array',
            'secret' => 'sometimes|string|max:255',
            'status' => 'sometimes|string|in:active,inactive',
        ]);

        $webhook = $this->auraWebhookService->createWebhook($data);
        if (!$webhook) {
            return response()->json(['message' => 'Failed to create webhook.'], 400);
        }
        return response()->json(['data' => $webhook, 'message' => 'Webhook created successfully.'], 201);
    }

    /**
     * Get webhook
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $webhook = $this->auraWebhookService->getWebhook($id);
        if (!$webhook) {
            return response()->json(['message' => 'Webhook not found.'], 404);
        }
        return response()->json(['data' => $webhook]);
    }

    /**
     * Update webhook
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'url' => 'sometimes|url',
            'events' => 'sometimes|array',
            'secret' => 'sometimes|string|max:255',
            'status' => 'sometimes|string|in:active,inactive',
        ]);

        $webhook = $this->auraWebhookService->updateWebhook($id, $data);
        if (!$webhook) {
            return response()->json(['message' => 'Webhook not found.'], 404);
        }
        return response()->json(['data' => $webhook, 'message' => 'Webhook updated successfully.']);
    }

    /**
     * Delete webhook
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $success = $this->auraWebhookService->deleteWebhook($id);
        if (!$success) {
            return response()->json(['message' => 'Webhook not found.'], 404);
        }
        return response()->json(['message' => 'Webhook deleted successfully.']);
    }

    /**
     * Test webhook
     *
     * @param int $id
     * @param Request $request
     * @return JsonResponse
     */
    public function test(int $id, Request $request): JsonResponse
    {
        $data = $request->validate([
            'test_data' => 'sometimes|array',
        ]);

        $result = $this->auraWebhookService->testWebhook($id, $data);
        if (!$result) {
            return response()->json(['message' => 'Webhook not found.'], 404);
        }
        return response()->json(['data' => $result, 'message' => 'Webhook test completed.']);
    }
}
