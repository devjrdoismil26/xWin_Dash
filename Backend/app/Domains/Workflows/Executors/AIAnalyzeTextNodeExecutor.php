<?php

namespace App\Domains\Workflows\Executors;

use App\Domains\AI\Services\AIService;
use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Exceptions\WorkflowExecutionException;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Leads\Models\Lead;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use Illuminate\Support\Facades\Log;

class AIAnalyzeTextNodeExecutor implements WorkflowNodeExecutor
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
        Log::info("Executando AIAnalyzeTextNodeExecutor para node {$node->id}.");

        $config = $node->configuration ?? [];
        $textField = $config['text_field'] ?? null;
        $analysisType = $config['analysis_type'] ?? 'sentiment'; // Tipo de análise padrão
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
            
            // Substituir placeholders no textField
            $finalTextField = $this->replacePlaceholder($textField, $payload);

            // Obter texto para análise
            $textToAnalyze = $payload[$finalTextField] ?? $lead->description ?? $lead->notes ?? '';

            if (empty($textToAnalyze)) {
                Log::warning("Campo de texto '{$finalTextField}' não encontrado ou vazio no payload para análise.");
                return $context->getData();
            }

            // Realizar análise baseada no tipo
            $analysisResult = [];
            switch ($analysisType) {
                case 'sentiment':
                    $analysisResult = $this->aiService->analyzeSentiment($textToAnalyze);
                    break;
                case 'keywords':
                    $analysisResult = $this->aiService->extractKeywords($textToAnalyze);
                    break;
                case 'summarize':
                    $analysisResult = $this->aiService->summarizeText($textToAnalyze);
                    break;
                case 'intent':
                    $analysisResult = $this->aiService->analyzeIntent($textToAnalyze);
                    break;
                default:
                    throw new WorkflowExecutionException("Tipo de análise de texto desconhecido: {$analysisType}.");
            }

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
     * @param WorkflowExecutionContext $context the execution context, including the result of the current node's execution
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
