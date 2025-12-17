<?php

namespace App\Domains\Aura\Application\Queries;

class GetAuraInsightsQuery
{
    public function __construct(
        public readonly ?int $chatId = null,
        public readonly ?string $insightType = null,
        public readonly ?string $dateFrom = null,
        public readonly ?string $dateTo = null,
        public readonly ?array $filters = null
    ) {
    }

    public function toArray(): array
    {
        return [
            'chat_id' => $this->chatId,
            'insight_type' => $this->insightType,
            'date_from' => $this->dateFrom,
            'date_to' => $this->dateTo,
            'filters' => $this->filters
        ];
    }
}
