<?php

namespace App\Domains\Universe\Http\Controllers;

use App\Domains\Universe\Services\ChatLabIntegrationService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class ChatLabController extends Controller
{
    protected ChatLabIntegrationService $chatLabService;

    public function __construct(ChatLabIntegrationService $chatLabService)
    {
        $this->chatLabService = $chatLabService;
    }

    /**
     * Send a message to the chat lab environment.
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function sendMessage(Request $request): JsonResponse
    {
        $request->validate([
            'message' => 'required|string',
            'chat_session_id' => 'nullable|string',
        ]);

        try {
            $response = $this->chatLabService->sendMessageToChatLab(
                $request->input('message'),
                $request->input('chat_session_id'),
            );
            return Response::json($response);
        } catch (\Exception $e) {
            return Response::json(['message' => 'Failed to send message to chat lab.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get chat history from the chat lab environment.
     *
     * @param string $chatSessionId
     *
     * @return JsonResponse
     */
    public function getChatHistory(string $chatSessionId): JsonResponse
    {
        try {
            $history = $this->chatLabService->getChatHistory($chatSessionId);
            return Response::json($history);
        } catch (\Exception $e) {
            return Response::json(['message' => 'Failed to retrieve chat history.', 'error' => $e->getMessage()], 500);
        }
    }
}
