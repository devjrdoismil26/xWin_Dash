<?php

namespace App\Domains\Workflows\Executors;

use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Exceptions\WorkflowExecutionException;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Leads\Models\Lead;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DiscordMessageNodeExecutor implements WorkflowNodeExecutor
{
    /**
     * Execute the action of the workflow node.
     *
     * @param WorkflowNodeModel        $node    the node to be executed
     * @param Lead                     $lead    the lead being processed
     * @param WorkflowExecutionContext $context the execution context
     *
     * @return array<string, mixed> o payload atualizado após o envio da mensagem
     *
     * @throws WorkflowExecutionException se a configuração for inválida ou o envio falhar
     */
    public function execute(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): array
    {
        Log::info("Executando DiscordMessageNodeExecutor para node {$node->id}.");

        $config = $node->configuration ?? [];
        $webhookUrl = $config['webhook_url'] ?? null;
        $message = $config['message'] ?? null;
        $username = $config['username'] ?? 'Workflow Bot';
        $avatarUrl = $config['avatar_url'] ?? null;
        $embeds = $config['embeds'] ?? [];

        if (!$webhookUrl || !$message) {
            throw new WorkflowExecutionException("Nó de mensagem do Discord inválido: 'webhook_url' e 'message' são obrigatórios.");
        }

        try {
            // Construir payload para substituição de placeholders
            $payload = [
                'lead_id' => $lead->id,
                'lead_name' => $lead->name ?? '',
                'lead_email' => $lead->email ?? '',
                'lead_phone' => $lead->phone ?? '',
                ...$context->getData()
            ];

            // Substituir placeholders
            $finalWebhookUrl = $this->replacePlaceholder($webhookUrl, $payload);
            $finalMessage = $this->replacePlaceholder($message, $payload);
            $finalUsername = $this->replacePlaceholder($username, $payload);

            // Preparar payload do Discord
            $discordPayload = [
                'content' => $finalMessage,
                'username' => $finalUsername,
            ];

            if ($avatarUrl) {
                $discordPayload['avatar_url'] = $avatarUrl;
            }

            if (!empty($embeds)) {
                $discordPayload['embeds'] = $embeds;
            }

            $response = Http::post($finalWebhookUrl, $discordPayload);

            if ($response->successful()) {
                Log::info("Mensagem enviada com sucesso para o Discord via webhook.");
                
                // Adicionar resultado ao contexto
                $context->setData('discord_message_result', [
                    'status' => 'success',
                    'message_id' => $response->json()['id'] ?? null
                ]);
            } else {
                Log::error("Falha ao enviar mensagem para o Discord: {$response->status()}, Resposta: {$response->body()}");
                throw new WorkflowExecutionException("Falha ao enviar mensagem para o Discord: " . $response->body());
            }
        } catch (\Exception $e) {
            Log::error("Erro ao conectar ou enviar mensagem para o Discord: " . $e->getMessage());
            throw new WorkflowExecutionException("Erro de conexão/envio para o Discord: " . $e->getMessage());
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
        $result = $context->getData('discord_message_result');

        // Se mensagem foi enviada com sucesso, seguir para próximo nó
        if ($result && isset($result['status']) && $result['status'] === 'success') {
            return $config['next_node_id'] ?? $node->next_node_id ?? null;
        }

        // Se falhou, seguir para nó de erro (se configurado)
        return $config['error_node_id'] ?? null;
    }

    /**
     * Substitui um placeholder no texto com um valor do payload.
     *
     * @param string|null $text    o texto com placeholder (ex: "{{ message }}")
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
