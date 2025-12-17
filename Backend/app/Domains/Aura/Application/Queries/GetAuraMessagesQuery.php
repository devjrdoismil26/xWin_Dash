<?php

namespace App\Domains\Aura\Application\Queries;

class GetAuraMessagesQuery
{
    public function __construct(
        public readonly int $chatId,
        public readonly ?string $messageType = null,
        public readonly ?string $dateFrom = null,
        public readonly ?string $dateTo = null,
        public readonly ?int $page = 1,
        public readonly ?int $perPage = 20
    ) {
    }

    public function toArray(): array
    {
        return [
            'chat_id' => $this->chatId,
            'message_type' => $this->messageType,
            'date_from' => $this->dateFrom,
            'date_to' => $this->dateTo,
            'page' => $this->page,
            'per_page' => $this->perPage
        ];
    }
}
