<?php

namespace App\Domains\Workflows\Executors;

use App\Domains\AI\Services\AIService;
use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Exceptions\WorkflowExecutionException;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Leads\Models\Lead;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use Illuminate\Support\Facades\Log;

class AITextAnalysisNodeExecutor implements WorkflowNodeExecutor
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
     * @return array<string, mixed> o payload atualizado com os resultados da análise
     *
     * @throws WorkflowExecutionException se a configuração for inválida ou a análise falhar
     */
    public function execute(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): array
    {
        Log::info("Executando AITextAnalysisNodeExecutor para node {$node->id}.");

        $config = $node->configuration ?? [];
        $textField = $config['text_field'] ?? null;
        $analysisType = $config['analysis_type'] ?? 'sentiment';
        $outputField = $config['output_field'] ?? 'ai_analysis_result';

        if (!$textField) {
            throw new WorkflowExecutionException("Nó de análise de texto por IA inválido: 'text_field' é obrigatório.");
        }

        try {
            // Construir payload para substituição de placeholders
            $payload = [
                'lead_id' => $lead->id,
                'lead_name' => $lead->name ?? '',
                'lead_description' => $lead->description ?? '',
                'lead_notes' => $lead->notes ?? '',
                ...$context->getData()
            ];

            // Substituir placeholders com valores do contexto
            $finalTextField = $this->replacePlaceholder($textField, $payload);

            // Obter texto para análise
            $textToAnalyze = $payload[$finalTextField] ?? $lead->description ?? $lead->notes ?? '';

            if (empty($textToAnalyze)) {
                Log::warning("Campo de texto '{$finalTextField}' não encontrado ou vazio no payload para análise.");
                return $context->getData();
            }

            // Realizar análise baseada no tipo
            $analysisResult = $this->performAnalysis($textToAnalyze, $analysisType);

            // Adicionar resultado ao contexto
            $context->setData($outputField, $analysisResult);
            $context->setData('analysis_metadata', [
                'analysis_type' => $analysisType,
                'text_field' => $finalTextField,
                'text_length' => strlen($textToAnalyze),
                'analyzed_at' => now()->toIso8601String()
            ]);

            Log::info("Análise de texto por IA concluída e adicionada ao contexto no campo '{$outputField}'.");

            return $context->getData();
        } catch (\Exception $e) {
            Log::error("Falha ao realizar análise de texto por IA: " . $e->getMessage());
            throw new WorkflowExecutionException("Falha na análise de texto por IA: " . $e->getMessage());
        }
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
        $outputField = $config['output_field'] ?? 'ai_analysis_result';
        $analysisResult = $context->getData($outputField);

        // Se análise foi bem-sucedida, seguir para próximo nó
        if ($analysisResult && !empty($analysisResult)) {
            return $config['next_node_id'] ?? $node->next_node_id ?? null;
        }

        // Se falhou, seguir para nó de erro (se configurado)
        return $config['error_node_id'] ?? null;
    }

    /**
     * Realiza a análise de texto.
     */
    private function performAnalysis(string $text, string $analysisType): mixed
    {
        return match ($analysisType) {
            'sentiment' => $this->aiService->analyzeSentiment($text),
            'keywords' => $this->aiService->extractKeywords($text),
            'summarize' => $this->aiService->summarizeText($text),
            'intent' => $this->aiService->analyzeIntent($text),
            default => throw new WorkflowExecutionException("Tipo de análise de texto desconhecido: {$analysisType}.")
        };
    }

    /**
     * Substitui um placeholder no texto com um valor do payload.
     *
     * @param string|null $text    o texto com placeholder (ex: "{{ text_field }}")
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
