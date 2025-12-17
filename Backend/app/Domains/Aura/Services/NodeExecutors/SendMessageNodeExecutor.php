<?php

namespace App\Domains\Aura\Services\NodeExecutors;

use App\Domains\Aura\Contracts\NodeExecutorInterface;
use App\Domains\Aura\Services\WhatsAppMessageService;

class SendMessageNodeExecutor implements NodeExecutorInterface
{
    public function __construct(private WhatsAppMessageService $messageService) {}

    public function execute(array $node, array $context): array
    {
        $message = $this->interpolateVariables($node['data']['message'] ?? '', $context);
        
        $this->messageService->sendMessage(
            $context['connection_id'],
            $context['phone_number'],
            $message,
            $node['data']['type'] ?? 'text',
            $node['data']['metadata'] ?? []
        );

        return [
            'output' => $message,
            'next_node' => $node['next'] ?? null,
        ];
    }

    private function interpolateVariables(string $message, array $context): string
    {
        return preg_replace_callback('/\{\{(\w+)\}\}/', function($matches) use ($context) {
            return $context[$matches[1]] ?? $matches[0];
        }, $message);
    }
}
