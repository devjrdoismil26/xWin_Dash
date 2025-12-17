<?php

namespace App\Domains\Workflows\Executors;

use App\Domains\AI\Services\AIService;
use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Exceptions\WorkflowExecutionException;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Leads\Models\Lead;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use Illuminate\Support\Facades\Log;

class AIGenerateTextNodeExecutor implements WorkflowNodeExecutor
{
    protected AIService $aiService;

    public function __construct(AIService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Execute the action of the workflow node.
     *
     * @param WorkflowNodeModel        $node    the node to be executed
     * @param Lead                     $lead    the lead being processed
     * @param WorkflowExecutionContext $context the execution context
     *
     * @return string the result of the execution, which can be used by subsequent nodes
     *
     * @throws WorkflowExecutionException se a configuração for inválida ou a geração falhar
     */
    public function execute(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): array
    {
        Log::info("Executando AIGenerateTextNodeExecutor para node {$node->id}.");

        $config = $node->configuration ?? [];
        $prompt = $config['prompt'] ?? null;
        $model = $config['model'] ?? 'gemini-pro';
        $provider = $config['provider'] ?? 'gemini';
        $outputField = $config['output_field'] ?? 'generated_text';
        $maxTokens = $config['max_tokens'] ?? 1000;
        $temperature = $config['temperature'] ?? 0.7;
        $cacheEnabled = $config['cache'] ?? true;

        if (!$prompt) {
            throw new WorkflowExecutionException("Nó de geração de texto por IA inválido: 'prompt' é obrigatório.");
        }

        try {
            // Construir payload completo para substituição de placeholders
            $payload = [
                'lead_name' => $lead->name ?? '',
                'lead_email' => $lead->email ?? '',
                'lead_phone' => $lead->phone ?? '',
                'lead_company' => $lead->company ?? '',
                'lead_score' => $lead->score ?? 0,
                'lead_status' => $lead->status ?? '',
                ...$context->getData()
            ];

            // Substituir placeholders no prompt com valores do payload
            $finalPrompt = $this->replacePlaceholders($prompt, $payload);

            // Verificar cache se habilitado
            if ($cacheEnabled) {
                $cacheKey = 'ai_generated:' . md5($finalPrompt . $model);
                $cached = \Illuminate\Support\Facades\Cache::get($cacheKey);
                if ($cached) {
                    Log::info("Texto gerado por IA (cache) para lead {$lead->id}");
                    $context->setData($outputField, $cached);
                    $context->setData('ai_model_used', $model);
                    $context->setData('ai_cached', true);
                    $context->setData('generated_at', now()->toISOString());
                    return $context->getData();
                }
            }

            // Gerar texto usando AIService
            // Verificar se método generateText existe, senão usar generate
            $generatedText = method_exists($this->aiService, 'generateText')
                ? $this->aiService->generateText($finalPrompt, $model)
                : $this->aiService->generate([
                    'prompt' => $finalPrompt,
                    'model' => $model,
                    'provider' => $provider,
                    'max_tokens' => $maxTokens,
                    'temperature' => $temperature
                ]);

            // Extrair texto se for array
            if (is_array($generatedText)) {
                $generatedText = $generatedText['text'] ?? $generatedText['content'] ?? $generatedText['response'] ?? json_encode($generatedText);
            }

            // Cachear resultado se habilitado
            if ($cacheEnabled && $generatedText) {
                \Illuminate\Support\Facades\Cache::put($cacheKey, $generatedText, now()->addHours(24));
            }

            // Salvar resultado no contexto
            $context->setData($outputField, $generatedText);
            $context->setData('ai_model_used', $model);
            $context->setData('ai_provider', $provider);
            $context->setData('ai_cached', false);
            $context->setData('generated_at', now()->toISOString());
            $context->setData('prompt_used', $finalPrompt);

            Log::info("Texto gerado por IA para lead {$lead->id}", [
                'model' => $model,
                'provider' => $provider,
                'text_length' => strlen($generatedText)
            ]);

            return $context->getData();
        } catch (\Exception $e) {
            Log::error("Falha ao gerar texto por IA: " . $e->getMessage(), [
                'prompt' => $prompt,
                'model' => $model,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw new WorkflowExecutionException("Falha na geração de texto por IA: " . $e->getMessage());
        }
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
        return $node->next_node_id ? (string) $node->next_node_id : null;
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
}
