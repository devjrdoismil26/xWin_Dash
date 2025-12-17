<?php

namespace App\Domains\Aura\Application\Commands;

class SendAuraMessageCommand
{
    public function __construct(
        public readonly int $chatId,
        public readonly string $message,
        public readonly ?string $messageType = 'text',
        public readonly ?array $attachments = null,
        public readonly ?array $context = null
    ) {
    }

    public function toArray(): array
    {
        return [
            'chat_id' => $this->chatId,
            'message' => $this->message,
            'message_type' => $this->messageType,
            'attachments' => $this->attachments,
            'context' => $this->context
        ];
    }
}
