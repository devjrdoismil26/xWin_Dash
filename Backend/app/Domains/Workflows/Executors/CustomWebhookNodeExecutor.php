<?php

namespace App\Domains\Workflows\Executors;

use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Exceptions\WorkflowExecutionException;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Leads\Models\Lead;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CustomWebhookNodeExecutor implements WorkflowNodeExecutor
{
    /**
     * Executa o nó para enviar dados para um webhook customizado.
     *
     * @param array<string, mixed> $nodeConfig a configuração do nó (ex: 'webhook_url', 'method', 'headers', 'body')
     * @param array<string, mixed> $payload    o payload atual do workflow
     *
     * @return array<string, mixed> o payload atualizado após o envio dos dados
     *
     * @throws WorkflowExecutionException se a configuração for inválida ou o envio falhar
     */
    public function execute(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): mixed
    {
        Log::info("Executando CustomWebhookNodeExecutor.");

        $config = $node->configuration ?? [];
        $webhookUrl = $config['webhook_url'] ?? null;
        $method = $config['method'] ?? 'POST';
        $headers = $config['headers'] ?? [];
        $body = $config['body'] ?? [];

        if (!$webhookUrl) {
            throw new WorkflowExecutionException("Nó de webhook customizado inválido: 'webhook_url' é obrigatório.");
        }

        try {
            // Construir payload para substituição de placeholders
            $payload = [
                'lead_id' => $lead->id,
                'lead_name' => $lead->name ?? '',
                'lead_email' => $lead->email ?? '',
                ...$context->getData()
            ];

            // Substituir placeholders
            $finalWebhookUrl = $this->replacePlaceholder($webhookUrl, $payload);
            $finalBody = $this->replacePlaceholdersInArray($body, $payload);

            // Mesclar dados do contexto com o corpo a ser enviado
            $finalBody = array_merge($payload, $finalBody);

            $response = Http::withHeaders($headers)->{$method}($finalWebhookUrl, $finalBody);

            if ($response->successful()) {
                Log::info("Dados enviados com sucesso para o webhook customizado: {$finalWebhookUrl}.");
                
                // Adicionar resultado ao contexto
                $context->setData('custom_webhook_response', $response->json());
                $context->setData('custom_webhook_status', 'success');
            } else {
                Log::error("Falha ao enviar dados para o webhook customizado: {$finalWebhookUrl}. Status: {$response->status()}");
                throw new WorkflowExecutionException("Falha ao enviar dados para o webhook customizado: " . $response->body());
            }
        } catch (\Exception $e) {
            Log::error("Erro ao conectar ou enviar dados para o webhook customizado: " . $e->getMessage());
            throw new WorkflowExecutionException("Erro de conexão/envio para o webhook customizado: " . $e->getMessage());
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
        $result = $context->getData('custom_webhook_status');

        // Se webhook foi enviado com sucesso, seguir para próximo nó
        if ($result === 'success') {
            return $config['next_node_id'] ?? $node->next_node_id ?? null;
        }

        // Se falhou, seguir para nó de erro (se configurado)
        return $config['error_node_id'] ?? null;
    }

    /**
     * Substitui um placeholder no texto com um valor do payload.
     *
     * @param string|null $text    o texto com placeholder (ex: "{{ webhook_url }}")
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

    /**
     * Substitui placeholders em um array com valores do payload.
     *
     * @param array $array   o array com placeholders
     * @param array<string, mixed> $payload o payload do workflow
     *
     * @return array<string, mixed> o array com placeholders substituídos
     */
    protected function replacePlaceholdersInArray(array $array, array $payload): array
    {
        $newArray = [];
        foreach ($array as $key => $value) {
            if (is_string($value)) {
                $newArray[$key] = $this->replacePlaceholder($value, $payload);
            } elseif (is_array($value)) {
                $newArray[$key] = $this->replacePlaceholdersInArray($value, $payload);
            } else {
                $newArray[$key] = $value;
            }
        }
        return $newArray;
    }
}
