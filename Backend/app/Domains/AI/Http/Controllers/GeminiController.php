<?php

namespace App\Domains\AI\Http\Controllers;

use App\Domains\AI\Http\Requests\ChatRequest;
use App\Domains\AI\Http\Resources\ChatResponseResource;
use App\Domains\AI\Http\Resources\GeminiHistoryResource;
use App\Domains\AI\Services\GeminiService;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Response;

class GeminiController extends Controller
{
    protected GeminiService $geminiService;

    public function __construct(GeminiService $geminiService)
    {
        $this->geminiService = $geminiService;
    }

    /**
     * Handles a specific chat request for Gemini.
     */
    public function chat(ChatRequest $request)
    {
        try {
            $response = $this->geminiService->chat(
                $request->input('message'),
                $request->input('history', []),
            );
            return new ChatResponseResource($response);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Retrieves the chat history for a specific session.
     */
    public function getHistory(string $chatId)
    {
        $history = $this->geminiService->getChatHistory($chatId);
        return new GeminiHistoryResource($history);
    }
}
