<?php

namespace App\Domains\AI\Application\Handlers;

use App\Domains\AI\Application\Commands\DeleteChatbotCommand;
use App\Domains\AI\Domain\Repositories\ChatbotRepositoryInterface;
use App\Domains\AI\Domain\Services\ChatbotService;
use Illuminate\Support\Facades\Log;

class DeleteChatbotHandler
{
    public function __construct(
        private ChatbotRepositoryInterface $chatbotRepository,
        private ChatbotService $chatbotService
    ) {
    }

    public function handle(DeleteChatbotCommand $command): array
    {
        try {
            // Buscar o chatbot existente
            $chatbot = $this->chatbotRepository->findById($command->chatbotId);

            if (!$chatbot) {
                throw new \Exception('Chatbot não encontrado');
            }

            // Validar dados do comando
            $this->validateCommand($command);

            // Verificar se há dados associados
            $hasAssociatedData = $this->chatbotService->hasAssociatedData($chatbot);

            if ($hasAssociatedData && !$command->forceDelete) {
                throw new \Exception('Não é possível excluir chatbot com dados associados. Use forceDelete=true para forçar a exclusão.');
            }

            // Limpar dados associados se necessário
            if ($command->forceDelete) {
                $this->chatbotService->cleanupAssociatedData($chatbot);
            }

            // Excluir o chatbot
            $this->chatbotRepository->delete($command->chatbotId);

            Log::info('Chatbot deleted successfully', [
                'chatbot_id' => $command->chatbotId
            ]);

            return [
                'message' => 'Chatbot excluído com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error deleting chatbot', [
                'chatbot_id' => $command->chatbotId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(DeleteChatbotCommand $command): void
    {
        if (empty($command->chatbotId)) {
            throw new \InvalidArgumentException('ID do chatbot é obrigatório');
        }
    }
}
