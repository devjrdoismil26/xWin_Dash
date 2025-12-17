<?php

namespace App\Domains\Workflows\Executors;

use App\Domains\AI\Services\AIService;
use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Exceptions\WorkflowExecutionException;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Leads\Models\Lead;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use Illuminate\Support\Facades\Log;

class AIGenerateImageNodeExecutor implements WorkflowNodeExecutor
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
     * @return array<string, mixed> o payload atualizado com a URL da imagem gerada
     *
     * @throws WorkflowExecutionException se a configuração for inválida ou a geração falhar
     */
    public function execute(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): array
    {
        Log::info("Executando AIGenerateImageNodeExecutor para node {$node->id}.");

        $config = $node->configuration ?? [];
        $prompt = $config['prompt'] ?? null;
        $model = $config['model'] ?? 'dall-e-2';
        $size = $config['size'] ?? '1024x1024';
        $outputField = $config['output_field'] ?? 'generated_image_url';

        if (!$prompt) {
            throw new WorkflowExecutionException("Nó de geração de imagem por IA inválido: 'prompt' é obrigatório.");
        }

        try {
            // Construir payload para substituição de placeholders
            $payload = [
                'lead_id' => $lead->id,
                'lead_name' => $lead->name ?? '',
                'lead_email' => $lead->email ?? '',
                ...$context->getData()
            ];

            // Substituir placeholders no prompt com valores do contexto
            $finalPrompt = $this->replacePlaceholders($prompt, $payload);

            // Gerar imagem usando AIService
            $imageUrl = $this->aiService->generateImage($finalPrompt, $model, $size);

            // Adicionar resultado ao contexto
            $context->setData($outputField, $imageUrl);
            $context->setData('ai_image_generation_metadata', [
                'prompt' => $finalPrompt,
                'model' => $model,
                'size' => $size,
                'generated_at' => now()->toIso8601String()
            ]);

            Log::info("Imagem gerada por IA e URL adicionada ao contexto no campo '{$outputField}'.");
        } catch (\Exception $e) {
            Log::error("Falha ao gerar imagem por IA: " . $e->getMessage());
            throw new WorkflowExecutionException("Falha na geração de imagem por IA: " . $e->getMessage());
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
        $outputField = $config['output_field'] ?? 'generated_image_url';
        $imageUrl = $context->getData($outputField);

        // Se imagem foi gerada com sucesso, seguir para próximo nó
        if ($imageUrl && !empty($imageUrl)) {
            return $config['next_node_id'] ?? $node->next_node_id ?? null;
        }

        // Se falhou, seguir para nó de erro (se configurado)
        return $config['error_node_id'] ?? null;
    }

    /**
     * Substitui placeholders no texto com valores do payload.
     *
     * @param string $text    o texto com placeholders (ex: "Uma imagem de {{ subject }}")
     * @param array  $payload o payload do workflow
     *
     * @return string o texto com placeholders substituídos
     */
    protected function replacePlaceholders(string $text, array $payload): string
    {
        return preg_replace_callback('/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/', function ($matches) use ($payload) {
            $key = $matches[1];
            return $payload[$key] ?? $matches[0]; // Retorna o placeholder original se a chave não existir
        }, $text);
    }
}
