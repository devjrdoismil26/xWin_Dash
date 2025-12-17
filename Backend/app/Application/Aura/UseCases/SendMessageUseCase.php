<?php

namespace App\Application\Aura\UseCases;

use App\Application\Aura\Commands\SendMessageCommand;
use App\Domains\Aura\Services\AuraMessageService;
use App\Domains\Aura\Services\WhatsAppService;
use App\Domains\Aura\Domain\AuraMessage;
use App\Shared\Exceptions\BusinessRuleException;
use Illuminate\Support\Facades\Log;

class SendMessageUseCase
{
    protected AuraMessageService $messageService;
    protected WhatsAppService $whatsappService;

    public function __construct(
        AuraMessageService $messageService,
        WhatsAppService $whatsappService
    ) {
        $this->messageService = $messageService;
        $this->whatsappService = $whatsappService;
    }

    /**
     * Executa o caso de uso para enviar uma mensagem.
     *
     * @param SendMessageCommand $command
     * @return AuraMessage
     * @throws BusinessRuleException
     */
    public function execute(SendMessageCommand $command): AuraMessage
    {
        // Validate message content
        $this->validateMessageContent($command);

        try {
            // Create message
            $message = $this->messageService->createMessage([
                'chat_id' => $command->chatId,
                'message_id' => $command->messageId,
                'type' => $command->type,
                'direction' => AuraMessage::DIRECTION_OUTBOUND,
                'content' => $command->content,
                'metadata' => $command->metadata,
                'sender_id' => $command->senderId,
                'sender_name' => $command->senderName,
                'recipient_id' => $command->recipientId,
                'recipient_name' => $command->recipientName,
            ]);

            // Send message via WhatsApp
            $sendResult = $this->whatsappService->sendMessage($message);

            if ($sendResult['success']) {
                // Mark as sent
                $message->markAsSent();
                
                Log::info("Message {$command->messageId} sent successfully");
            } else {
                // Mark as failed
                $message->markAsFailed($sendResult['error_message']);
                
                Log::error("Message {$command->messageId} failed to send: {$sendResult['error_message']}");
            }

            // Save the message
            $updatedMessage = $this->messageService->updateMessage($command->messageId, [
                'status' => $message->status,
                'sent_at' => $message->sentAt,
                'error_message' => $message->errorMessage,
                'updated_at' => $message->updatedAt
            ]);

            return $updatedMessage;

        } catch (\Exception $e) {
            Log::error("Failed to send message {$command->messageId}: {$e->getMessage()}");
            throw new BusinessRuleException("Failed to send message: {$e->getMessage()}");
        }
    }

    /**
     * Valida o conteúdo da mensagem.
     *
     * @param SendMessageCommand $command
     * @throws BusinessRuleException
     */
    private function validateMessageContent(SendMessageCommand $command): void
    {
        // Validate message type
        if (!in_array($command->type, AuraMessage::getValidTypes())) {
            throw new BusinessRuleException("Invalid message type: {$command->type}");
        }

        // Validate content based on type
        switch ($command->type) {
            case AuraMessage::TYPE_TEXT:
                if (!isset($command->content['text']) || empty(trim($command->content['text']))) {
                    throw new BusinessRuleException('Text message must have text content');
                }
                break;

            case AuraMessage::TYPE_IMAGE:
            case AuraMessage::TYPE_VIDEO:
            case AuraMessage::TYPE_AUDIO:
            case AuraMessage::TYPE_DOCUMENT:
                if (!isset($command->content['url']) || empty(trim($command->content['url']))) {
                    throw new BusinessRuleException('Media message must have URL content');
                }
                break;

            case AuraMessage::TYPE_TEMPLATE:
                if (!isset($command->content['template_name'])) {
                    throw new BusinessRuleException('Template message must have template_name');
                }
                break;
        }

        // Validate required fields
        if (empty($command->chatId)) {
            throw new BusinessRuleException('Chat ID is required');
        }

        if (empty($command->messageId)) {
            throw new BusinessRuleException('Message ID is required');
        }

        if (empty($command->recipientId)) {
            throw new BusinessRuleException('Recipient ID is required');
        }
    }
}