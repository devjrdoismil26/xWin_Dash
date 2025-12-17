<?php

namespace App\Domains\AI\Http\Controllers;

use App\Domains\AI\Http\Requests\ChatRequest;
use App\Domains\AI\Http\Resources\ChatResponseResource;
use App\Domains\AI\Services\ChatService;
use App\Domains\AI\Models\AIGeneration;
use App\Http\Controllers\Controller;

class ChatController extends Controller
{
    protected ChatService $chatService;

    public function __construct(ChatService $chatService)
    {
        $this->chatService = $chatService;
    }

    /**
     * Handle the incoming request for a chat message.
     * AUTH-PENDENTE-008: Adicionada autorização
     *
     * @param ChatRequest $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function __invoke(ChatRequest $request)
    {
        // SECURITY: Verificar autorização
        $this->authorize('create', AIGeneration::class);
        
        try {
            $responseMessage = $this->chatService->sendMessage(
                $request->user(),
                $request->input('message'),
                $request->input('history', []),
                $request->input('provider', 'default'),
            );

            return new ChatResponseResource($responseMessage);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
