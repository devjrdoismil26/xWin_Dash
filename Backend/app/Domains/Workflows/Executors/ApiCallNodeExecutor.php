<?php

namespace App\Domains\Workflows\Executors;

use Illuminate\Support\Facades\Log as LoggerFacade;
use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Leads\Models\Lead;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use Illuminate\Support\Facades\Http;

class ApiCallNodeExecutor implements WorkflowNodeExecutor
{

    public function execute(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): mixed
    {
        LoggerFacade::info("Executando ApiCallNodeExecutor para node {$node->id} e lead {$lead->id}");

        $config = $node->configuration ?? [];
        $url = $config['url'] ?? null;
        $method = $config['method'] ?? 'GET';
        $headers = $config['headers'] ?? [];
        $body = $config['body'] ?? [];
        $authType = $config['auth_type'] ?? null;
        $authConfig = $config['auth_config'] ?? [];

        if (!$url) {
            throw new \App\Domains\Workflows\Exceptions\WorkflowExecutionException("Nó de chamada de API inválido: 'url' é obrigatório.");
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
            $finalUrl = $this->replacePlaceholder($url, $payload);
            $finalBody = $this->replacePlaceholdersInArray($body, $payload);

            // Preparar requisição HTTP
            $http = Http::withHeaders($headers);
            
            if ($authType === 'bearer' && isset($authConfig['token'])) {
                $http->withToken($authConfig['token']);
            } elseif ($authType === 'basic' && isset($authConfig['username']) && isset($authConfig['password'])) {
                $http->withBasicAuth($authConfig['username'], $authConfig['password']);
            }

            // Fazer chamada
            $response = match (strtoupper($method)) {
                'GET' => $http->get($finalUrl, $finalBody),
                'POST' => $http->post($finalUrl, $finalBody),
                'PUT' => $http->put($finalUrl, $finalBody),
                'PATCH' => $http->patch($finalUrl, $finalBody),
                'DELETE' => $http->delete($finalUrl, $finalBody),
                default => throw new \App\Domains\Workflows\Exceptions\WorkflowExecutionException("Método HTTP não suportado: {$method}")
            };

            if ($response->successful()) {
                LoggerFacade::info("API Call successful for lead {$lead->id} to {$finalUrl}");
                
                // Adicionar resultado ao contexto
                $context->setData('api_call_response', $response->json());
                $context->setData('api_call_status', 'success');
                $context->setData('api_call_url', $finalUrl);
            } else {
                throw new \App\Domains\Workflows\Exceptions\WorkflowExecutionException("API call failed: Status {$response->status()}");
            }
        } catch (\Exception $e) {
            LoggerFacade::error("Exception during API Call for lead {$lead->id}", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            $context->setData('api_call_status', 'failed');
            $context->setData('api_call_error', $e->getMessage());
            
            throw new \App\Domains\Workflows\Exceptions\WorkflowExecutionException("Falha na chamada de API: " . $e->getMessage());
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
        $result = $context->getData('api_call_status');

        // Se chamada foi bem-sucedida, seguir para próximo nó
        if ($result === 'success') {
            return $config['next_node_id'] ?? $node->next_node_id ?? null;
        }

        // Se falhou, seguir para nó de erro (se configurado)
        return $config['error_node_id'] ?? null;
    }

    /**
     * Substitui um placeholder no texto com um valor do payload.
     *
     * @param string|null $text    o texto com placeholder (ex: "{{ url }}")
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

    public function getNextNodeId(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): ?string
    {
        if ($node->connections->isNotEmpty()) {
            return $node->connections->first()->targetNodeId;
        }

        return null;
    }
}
