<?php

namespace App\Domains\Aura\Application\Handlers;

use App\Domains\Aura\Application\Commands\SendAuraMessageCommand;
use App\Domains\Aura\Domain\Repositories\AuraChatRepositoryInterface;
use App\Domains\Aura\Domain\Services\AuraChatService;
use App\Domains\Aura\Domain\Services\AuraMessageService;
use Illuminate\Support\Facades\Log;

class SendAuraMessageHandler
{
    public function __construct(
        private AuraChatRepositoryInterface $auraChatRepository,
        private AuraChatService $auraChatService,
        private AuraMessageService $auraMessageService
    ) {
    }

    public function handle(SendAuraMessageCommand $command): array
    {
        try {
            // Buscar o chat
            $chat = $this->auraChatRepository->findById($command->chatId);

            if (!$chat) {
                throw new \Exception('Chat Aura não encontrado');
            }

            // Validar dados do comando
            $this->validateCommand($command);

            // Processar a mensagem
            $response = $this->auraMessageService->processMessage([
                'chat' => $chat,
                'message' => $command->message,
                'message_type' => $command->messageType,
                'attachments' => $command->attachments,
                'context' => $command->context
            ]);

            // Salvar mensagem e resposta
            $message = $this->auraMessageService->saveMessage([
                'chat_id' => $command->chatId,
                'content' => $command->message,
                'type' => $command->messageType,
                'attachments' => $command->attachments,
                'is_user' => true
            ]);

            $auraResponse = $this->auraMessageService->saveMessage([
                'chat_id' => $command->chatId,
                'content' => $response['content'],
                'type' => $response['type'],
                'attachments' => $response['attachments'] ?? null,
                'is_user' => false
            ]);

            Log::info('Aura message sent successfully', [
                'chat_id' => $command->chatId,
                'message_id' => $message->id
            ]);

            return [
                'message' => $message->toArray(),
                'response' => $auraResponse->toArray(),
                'message' => 'Mensagem enviada com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error sending Aura message', [
                'chat_id' => $command->chatId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(SendAuraMessageCommand $command): void
    {
        if (empty($command->chatId)) {
            throw new \InvalidArgumentException('ID do chat é obrigatório');
        }

        if (empty($command->message)) {
            throw new \InvalidArgumentException('Mensagem é obrigatória');
        }
    }
}
