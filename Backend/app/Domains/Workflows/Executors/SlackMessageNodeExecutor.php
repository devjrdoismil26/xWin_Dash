<?php

namespace App\Domains\Workflows\Executors;

use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Exceptions\WorkflowExecutionException;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Leads\Models\Lead;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SlackMessageNodeExecutor implements WorkflowNodeExecutor
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
        Log::info("Executando SlackMessageNodeExecutor para node {$node->id}.");

        $config = $node->configuration ?? [];
        $webhookUrl = $config['webhook_url'] ?? null;
        $message = $config['message'] ?? $config['text'] ?? null;
        $channel = $config['channel'] ?? null;
        $username = $config['username'] ?? 'Workflow Bot';
        $iconEmoji = $config['icon_emoji'] ?? ':robot_face:';
        $blocks = $config['blocks'] ?? null;
        $attachments = $config['attachments'] ?? null;
        $threadTs = $config['thread_ts'] ?? null; // Para responder em thread

        if (!$webhookUrl || !$message) {
            throw new WorkflowExecutionException("Nó de mensagem do Slack inválido: 'webhook_url' e 'message' são obrigatórios.");
        }

        try {
            // Construir payload completo para substituição de placeholders
            $payload = [
                'lead_name' => $lead->name ?? '',
                'lead_email' => $lead->email ?? '',
                'lead_phone' => $lead->phone ?? '',
                'lead_company' => $lead->company ?? '',
                'lead_id' => $lead->id,
                ...$context->getData()
            ];

            // Substituir placeholders na mensagem
            $finalMessage = $this->replacePlaceholders($message, $payload);

            // Construir payload do Slack
            $data = [
                'text' => $finalMessage,
                'username' => $this->replacePlaceholders($username, $payload),
                'icon_emoji' => $iconEmoji,
            ];

            if ($channel) {
                $data['channel'] = $this->replacePlaceholders($channel, $payload);
            }

            // Adicionar blocks se fornecidos
            if ($blocks && is_array($blocks)) {
                $data['blocks'] = $this->processBlocks($blocks, $payload);
            }

            // Adicionar attachments se fornecidos
            if ($attachments && is_array($attachments)) {
                $data['attachments'] = $this->processAttachments($attachments, $payload);
            }

            // Adicionar thread_ts se fornecido
            if ($threadTs) {
                $data['thread_ts'] = $threadTs;
            }

            $response = Http::post($webhookUrl, $data);

            if ($response->successful()) {
                Log::info("Mensagem enviada com sucesso para o Slack via webhook.", [
                    'channel' => $channel,
                    'has_blocks' => !empty($blocks),
                    'has_attachments' => !empty($attachments)
                ]);
                
                $context->setData('slack_message_result', [
                    'status' => 'success',
                    'message' => $finalMessage,
                    'channel' => $channel,
                    'timestamp' => now()->toIso8601String()
                ]);
            } else {
                $errorBody = $response->body();
                Log::error("Falha ao enviar mensagem para o Slack", [
                    'status' => $response->status(),
                    'response' => $errorBody,
                    'webhook_url' => $webhookUrl
                ]);
                throw new WorkflowExecutionException("Falha ao enviar mensagem para o Slack: " . $errorBody);
            }
        } catch (\Exception $e) {
            Log::error("Erro ao conectar ou enviar mensagem para o Slack", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw new WorkflowExecutionException("Erro de conexão/envio para o Slack: " . $e->getMessage());
        }

        return $context->getData();
    }

    /**
     * Substitui placeholders no texto com valores do payload.
     *
     * @param string $text    o texto com placeholders (ex: "Olá, {{ name }}")
     * @param array<string, mixed> $payload o payload do workflow
     *
     * @return string o texto com placeholders substituídos
     */
    protected function replacePlaceholders(string $text, array $payload): string
    {
        return preg_replace_callback('/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/', function ($matches) use ($payload) {
            $key = $matches[1];
            return (string) ($payload[$key] ?? $matches[0]); // Retorna o placeholder original se a chave não existir
        }, $text) ?? $text;
    }

    /**
     * Process Slack blocks with placeholder replacement
     */
    protected function processBlocks(array $blocks, array $payload): array
    {
        $processed = [];
        foreach ($blocks as $block) {
            $processedBlock = $block;
            
            // Processar texto em blocks
            if (isset($block['text']) && is_string($block['text'])) {
                $processedBlock['text'] = $this->replacePlaceholders($block['text'], $payload);
            }
            
            // Processar fields em blocks
            if (isset($block['fields']) && is_array($block['fields'])) {
                $processedBlock['fields'] = array_map(function ($field) use ($payload) {
                    if (isset($field['text']) && is_string($field['text'])) {
                        $field['text'] = $this->replacePlaceholders($field['text'], $payload);
                    }
                    return $field;
                }, $block['fields']);
            }
            
            $processed[] = $processedBlock;
        }
        
        return $processed;
    }

    /**
     * Process Slack attachments with placeholder replacement
     */
    protected function processAttachments(array $attachments, array $payload): array
    {
        $processed = [];
        foreach ($attachments as $attachment) {
            $processedAttachment = $attachment;
            
            // Processar campos de texto em attachments
            $textFields = ['title', 'text', 'pretext', 'footer'];
            foreach ($textFields as $field) {
                if (isset($attachment[$field]) && is_string($attachment[$field])) {
                    $processedAttachment[$field] = $this->replacePlaceholders($attachment[$field], $payload);
                }
            }
            
            // Processar fields em attachments
            if (isset($attachment['fields']) && is_array($attachment['fields'])) {
                $processedAttachment['fields'] = array_map(function ($field) use ($payload) {
                    if (isset($field['value']) && is_string($field['value'])) {
                        $field['value'] = $this->replacePlaceholders($field['value'], $payload);
                    }
                    return $field;
                }, $attachment['fields']);
            }
            
            $processed[] = $processedAttachment;
        }
        
        return $processed;
    }

    /**
     * Determine the ID of the next node to be executed.
     *
     * @param WorkflowNodeModel        $node    the current node
     * @param Lead                     $lead    the lead being processed
     * @param WorkflowExecutionContext $context the execution context, including the result of the current node's execution
     *
     * @return string|null the ID of the next node, or null if it's the end of the path
     */
    public function getNextNodeId(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): ?string
    {
        // Verificar se há condição de sucesso/falha para roteamento
        $config = $node->configuration ?? [];
        $successPath = $config['success_path'] ?? $config['on_success'] ?? null;
        $failurePath = $config['failure_path'] ?? $config['on_failure'] ?? null;

        $sendResult = $context->getData()['slack_message_result'] ?? null;
        $isSuccess = $sendResult && ($sendResult['status'] ?? '') === 'success';

        if ($isSuccess && $successPath) {
            return (string) $successPath;
        }

        if (!$isSuccess && $failurePath) {
            return (string) $failurePath;
        }

        return $node->next_node_id ? (string) $node->next_node_id : null;
    }
}
