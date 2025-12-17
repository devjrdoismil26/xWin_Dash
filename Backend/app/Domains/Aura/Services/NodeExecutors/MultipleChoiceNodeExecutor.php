<?php

namespace App\Domains\Aura\Services\NodeExecutors;

use App\Domains\Aura\Contracts\NodeExecutorInterface;
use App\Domains\Aura\Services\WhatsAppMessageService;

class MultipleChoiceNodeExecutor implements NodeExecutorInterface
{
    public function __construct(private WhatsAppMessageService $messageService) {}

    public function execute(array $node, array $context): array
    {
        $question = $node['data']['question'] ?? 'Choose an option:';
        $options = $node['data']['options'] ?? [];

        $message = $question . "\n\n";
        foreach ($options as $index => $option) {
            $message .= ($index + 1) . ". " . $option['label'] . "\n";
        }

        $this->messageService->sendMessage(
            $context['connection_id'],
            $context['phone_number'],
            $message
        );

        // Aguardar resposta do usuário (será processada em outro job)
        return [
            'output' => $message,
            'waiting_for_input' => true,
            'options' => $options,
        ];
    }
}
