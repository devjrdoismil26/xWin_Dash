<?php

namespace App\Domains\Core\Http\Controllers;

use App\Domains\Core\Services\WhatsAppService; // Supondo que este serviço exista
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class WhatsAppWebhookController extends Controller
{
    protected WhatsAppService $whatsAppService;

    public function __construct(WhatsAppService $whatsAppService)
    {
        $this->whatsAppService = $whatsAppService;
    }

    /**
     * Handle incoming WhatsApp webhook requests.
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function handle(Request $request): JsonResponse
    {
        // Validação do webhook (ex: para Facebook/WhatsApp Business API)
        if ($request->has('hub_mode') && $request->input('hub_mode') === 'subscribe') {
            return Response::json(['challenge' => $request->input('hub_challenge')], 200);
        }

        // Processar o payload da mensagem
        $payload = $request->all();

        try {
            $this->whatsAppService->processWebhookPayload($payload);
            return Response::json(['status' => 'success'], 200);
        } catch (\Exception $e) {
            // Logar o erro e retornar um status de erro
            return Response::json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}
