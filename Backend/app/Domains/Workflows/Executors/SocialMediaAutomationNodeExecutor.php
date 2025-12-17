<?php

namespace App\Domains\Workflows\Executors;

use App\Domains\SocialBuffer\Services\PostService;
use App\Domains\SocialBuffer\Services\SocialAccountService;
use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Exceptions\WorkflowExecutionException;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Leads\Models\Lead;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class SocialMediaAutomationNodeExecutor implements WorkflowNodeExecutor
{
    protected PostService $postService;
    protected SocialAccountService $socialAccountService;

    public function __construct(PostService $postService, SocialAccountService $socialAccountService)
    {
        $this->postService = $postService;
        $this->socialAccountService = $socialAccountService;
    }

    /**
     * Execute the action of the workflow node.
     *
     * @param WorkflowNodeModel        $node    the node to be executed
     * @param Lead                     $lead    the lead being processed
     * @param WorkflowExecutionContext $context the execution context
     *
     * @return array<string, mixed> o payload atualizado após a execução da ação
     *
     * @throws WorkflowExecutionException se a configuração for inválida ou a ação falhar
     */
    public function execute(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): array
    {
        Log::info("Executando SocialMediaAutomationNodeExecutor para node {$node->id}.");

        $config = $node->configuration ?? [];
        $action = $config['action'] ?? null;
        $platform = $config['platform'] ?? null;

        $this->validateSocialMediaConfig($action, $platform);

        try {
            // Construir payload para substituição de placeholders
            $payload = [
                'lead_id' => $lead->id,
                'lead_name' => $lead->name ?? '',
                ...$context->getData()
            ];

            $this->executeSocialMediaAction($action, $config, $platform, $payload, $context);
            
            // Adicionar resultado ao contexto
            $context->setData('social_media_action_result', [
                'action' => $action,
                'platform' => $platform,
                'status' => 'success',
                'executed_at' => now()->toIso8601String()
            ]);
        } catch (\Exception $e) {
            Log::error("Falha na execução do nó de automação de redes sociais: " . $e->getMessage());
            throw new WorkflowExecutionException("Falha na execução do nó de automação de redes sociais: " . $e->getMessage());
        }

        return $context->getData();
    }

    /**
     * Determine the ID of the next node to be executed.
     *
     * @param WorkflowNodeModel        $node    the current node
     * @param Lead                     $lead    the lead being processed
     * @param WorkflowExecutionContext $context the execution context
     *
     * @return string|null the ID of the next node, or null if it's the end of the path
     */
    public function getNextNodeId(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): ?string
    {
        $config = $node->configuration ?? [];
        $result = $context->getData('social_media_action_result');

        // Se ação foi bem-sucedida, seguir para próximo nó
        if ($result && isset($result['status']) && $result['status'] === 'success') {
            return $config['next_node_id'] ?? $node->next_node_id ?? null;
        }

        // Se falhou, seguir para nó de erro (se configurado)
        return $config['error_node_id'] ?? null;
    }

    /**
     * Valida a configuração de redes sociais.
     *
     * @param string|null $action
     * @param string|null $platform
     * @throws WorkflowExecutionException
     */
    private function validateSocialMediaConfig(?string $action, ?string $platform): void
    {
        if (!$action || !$platform) {
            throw new WorkflowExecutionException("Nó de automação de redes sociais inválido: 'action' e 'platform' são obrigatórios.");
        }
    }

    /**
     * Executa a ação específica de redes sociais.
     *
     * @param string $action
     * @param array<string, mixed> $config
     * @param string $platform
     * @param array<string, mixed> $payload
     * @param WorkflowExecutionContext $context
     * @throws WorkflowExecutionException
     */
    private function executeSocialMediaAction(string $action, array $config, string $platform, array $payload, WorkflowExecutionContext $context): void
    {
        match ($action) {
            'publish_post' => $this->publishPost($config, $platform, $payload, $context),
            'schedule_post' => $this->schedulePost($config, $platform, $payload, $context),
            default => throw new WorkflowExecutionException("Ação de automação de redes sociais desconhecida: {$action}")
        };
    }

    /**
     * Publica um post.
     *
     * @param array<string, mixed> $config
     * @param string $platform
     * @param array<string, mixed> $payload
     * @param WorkflowExecutionContext $context
     * @throws WorkflowExecutionException
     */
    private function publishPost(array $config, string $platform, array $payload, WorkflowExecutionContext $context): void
    {
        $content = $this->replacePlaceholder($config['content'] ?? null, $payload);
        $socialAccountIds = $config['social_account_ids'] ?? [];

        if (!$content || empty($socialAccountIds)) {
            throw new WorkflowExecutionException("Para 'publish_post', 'content' e 'social_account_ids' são obrigatórios.");
        }

        // Em produção: usar PostService
        // $post = $this->postService->createAndPublishPost(auth()->id(), $content, $socialAccountIds);
        Log::info("Post publicado na plataforma {$platform}.");
        
        $context->setData('published_post_platform', $platform);
        $context->setData('published_post_content', $content);
    }

    /**
     * Agenda um post.
     *
     * @param array<string, mixed> $config
     * @param string $platform
     * @param array<string, mixed> $payload
     * @param WorkflowExecutionContext $context
     * @throws WorkflowExecutionException
     */
    private function schedulePost(array $config, string $platform, array $payload, WorkflowExecutionContext $context): void
    {
        $content = $this->replacePlaceholder($config['content'] ?? null, $payload);
        $scheduledAt = $this->replacePlaceholder($config['scheduled_at'] ?? null, $payload);
        $socialAccountIds = $config['social_account_ids'] ?? [];

        if (!$content || !$scheduledAt || empty($socialAccountIds)) {
            throw new WorkflowExecutionException("Para 'schedule_post', 'content', 'scheduled_at' e 'social_account_ids' são obrigatórios.");
        }

        // Validar data de agendamento
        try {
            $scheduledDateTime = Carbon::parse($scheduledAt);
            if ($scheduledDateTime->isPast()) {
                throw new WorkflowExecutionException("Data de agendamento deve ser no futuro: {$scheduledAt}.");
            }
        } catch (\Exception $e) {
            throw new WorkflowExecutionException("Data de agendamento inválida: {$scheduledAt}.");
        }

        // Em produção: usar PostService
        // $post = $this->postService->createAndSchedulePost(auth()->id(), $content, $socialAccountIds, $scheduledDateTime);
        Log::info("Post agendado na plataforma {$platform} para {$scheduledAt}.");
        
        $context->setData('scheduled_post_platform', $platform);
        $context->setData('scheduled_post_content', $content);
        $context->setData('scheduled_post_at', $scheduledDateTime->toIso8601String());
    }

    /**
     * Substitui um placeholder no texto com um valor do payload.
     *
     * @param string|null $text    o texto com placeholder (ex: "{{ content }}")
     * @param array       $payload o payload do workflow
     *
     * @return string|null o texto com placeholder substituído ou null
     */
    protected function replacePlaceholder(?string $text, array $payload): ?string
    {
        if ($text === null) {
            return null;
        }
        return preg_replace_callback('/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/', function ($matches) use ($payload) {
            $key = $matches[1];
            return $payload[$key] ?? $matches[0];
        }, $text);
    }
}
