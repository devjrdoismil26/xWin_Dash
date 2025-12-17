<?php

namespace App\Domains\Aura\Services;

use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraChatModel;
use Illuminate\Support\Facades\Log;

class AuraChatService
{
    public function __construct(private AuraChatModel $model)
    {
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getChatHistory(string $chatSessionId): array
    {
        try {
            /** @var AuraChatModel $chat */
            $chat = $this->model->findOrFail($chatSessionId);
            return $chat->messages()->orderBy('created_at')->get()->toArray();
        } catch (\Throwable $e) {
            Log::error('Failed to get chat history', ['chat_session_id' => $chatSessionId, 'error' => $e->getMessage()]);
            return [];
        }
    }

    public function closeChat(string $chatId): bool
    {
        /** @var AuraChatModel|null $chat */
        $chat = $this->model->find($chatId);
        if ($chat) {
            $chat->status = 'closed';
            return $chat->save();
        }
        return false;
    }
}
