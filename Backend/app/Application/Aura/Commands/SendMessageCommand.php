<?php

namespace App\Application\Aura\Commands;

class SendMessageCommand
{
    public string $chatId;
    public string $messageId;
    public string $type;
    public array $content;
    public array $metadata;
    public string $senderId;
    public string $senderName;
    public string $recipientId;
    public string $recipientName;

    public function __construct(
        string $chatId,
        string $messageId,
        string $type,
        array $content,
        string $senderId,
        string $senderName,
        string $recipientId,
        string $recipientName,
        array $metadata = []
    ) {
        $this->chatId = $chatId;
        $this->messageId = $messageId;
        $this->type = $type;
        $this->content = $content;
        $this->metadata = $metadata;
        $this->senderId = $senderId;
        $this->senderName = $senderName;
        $this->recipientId = $recipientId;
        $this->recipientName = $recipientName;
    }
}