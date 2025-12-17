<?php

namespace App\Domains\Aura\Services;

use App\Domains\Aura\Contracts\NodeExecutorInterface;
use App\Domains\Aura\Services\NodeExecutors\SendMessageNodeExecutor;
use App\Domains\Aura\Services\NodeExecutors\MultipleChoiceNodeExecutor;
use App\Domains\Aura\Services\NodeExecutors\TransferToHumanNodeExecutor;

class NodeExecutorFactory
{
    private array $executors = [];

    public function __construct(
        private WhatsAppMessageService $messageService,
        private AuraAIService $aiService
    ) {
        $this->registerDefaultExecutors();
    }

    private function registerDefaultExecutors(): void
    {
        $this->executors = [
            'send_message' => new SendMessageNodeExecutor($this->messageService),
            'multiple_choice' => new MultipleChoiceNodeExecutor($this->messageService),
            'transfer_to_human' => new TransferToHumanNodeExecutor(),
            'ai_response' => new class($this->aiService) implements NodeExecutorInterface {
                public function __construct(private AuraAIService $aiService) {}
                
                public function execute(array $node, array $context): array
                {
                    $response = $this->aiService->processMessage(
                        $context['message'] ?? '',
                        $context['chat_id'] ?? null
                    );
                    return ['output' => $response['response'], 'next_node' => $node['next'] ?? null];
                }
            },
            'delay' => new class implements NodeExecutorInterface {
                public function execute(array $node, array $context): array
                {
                    sleep($node['data']['seconds'] ?? 1);
                    return ['next_node' => $node['next'] ?? null];
                }
            },
            'condition' => new class implements NodeExecutorInterface {
                public function execute(array $node, array $context): array
                {
                    $condition = $node['data']['condition'] ?? '';
                    $value = $context[$node['data']['variable'] ?? ''] ?? '';
                    $matches = match($condition) {
                        'equals' => $value == ($node['data']['value'] ?? ''),
                        'contains' => str_contains($value, $node['data']['value'] ?? ''),
                        'greater_than' => $value > ($node['data']['value'] ?? 0),
                        default => false
                    };
                    return ['next_node' => $matches ? $node['true_branch'] : $node['false_branch']];
                }
            },
        ];
    }

    public function getExecutor(string $type): ?NodeExecutorInterface
    {
        return $this->executors[$type] ?? null;
    }

    public function register(string $type, NodeExecutorInterface $executor): void
    {
        $this->executors[$type] = $executor;
    }
}
