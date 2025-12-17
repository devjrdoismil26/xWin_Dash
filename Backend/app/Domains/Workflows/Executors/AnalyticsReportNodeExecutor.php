<?php

namespace App\Domains\Workflows\Executors;

use App\Domains\Analytics\Services\AnalyticsService;
use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Exceptions\WorkflowExecutionException;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Leads\Models\Lead;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use Illuminate\Support\Facades\Log;

class AnalyticsReportNodeExecutor implements WorkflowNodeExecutor
{
    protected AnalyticsService $analyticsService;

    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    /**
     * Execute the action of the workflow node.
     *
     * @param WorkflowNodeModel        $node    the node to be executed
     * @param Lead                     $lead    the lead being processed
     * @param WorkflowExecutionContext $context the execution context
     *
     * @return array<string, mixed> o payload atualizado com os dados do relatório
     *
     * @throws WorkflowExecutionException se a configuração for inválida ou a geração falhar
     */
    public function execute(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): array
    {
        Log::info("Executando AnalyticsReportNodeExecutor para node {$node->id}.");

        $config = $node->configuration ?? [];
        $reportType = $config['report_type'] ?? null;
        $filters = $config['filters'] ?? [];
        $outputField = $config['output_field'] ?? 'analytics_report_data';

        if (!$reportType) {
            throw new WorkflowExecutionException("Nó de relatório de analytics inválido: 'report_type' é obrigatório.");
        }

        try {
            // Construir payload para substituição de placeholders
            $payload = [
                'lead_id' => $lead->id,
                'lead_name' => $lead->name ?? '',
                ...$context->getData()
            ];

            // Substituir placeholders nos filtros com valores do contexto
            $finalFilters = $this->replacePlaceholdersInArray($filters, $payload);

            // Adicionar filtros padrão baseados no lead e projeto
            $finalFilters['lead_id'] = $lead->id;
            $finalFilters['project_id'] = $lead->project_id ?? session('selected_project_id');

            // Gerar relatório usando AnalyticsService
            $startDate = $finalFilters['start_date'] ?? now()->subDays(30)->toDateString();
            $endDate = $finalFilters['end_date'] ?? now()->toDateString();
            
            $reportData = $this->analyticsService->generateReport(
                $reportType,
                $startDate,
                $endDate,
                $finalFilters
            );

            // Adicionar resultado ao contexto
            $context->setData($outputField, $reportData->toArray() ?? []);

            Log::info("Relatório de analytics gerado e adicionado ao contexto no campo '{$outputField}'.");

            return $context->getData();
        } catch (\Exception $e) {
            Log::error("Falha ao gerar relatório de analytics: " . $e->getMessage());
            throw new WorkflowExecutionException("Falha na geração de relatório de analytics: " . $e->getMessage());
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
        $outputField = $config['output_field'] ?? 'analytics_report_data';
        $reportData = $context->getData($outputField);

        // Se relatório foi gerado com sucesso, seguir para próximo nó
        if ($reportData && !empty($reportData)) {
            return $config['next_node_id'] ?? $node->next_node_id ?? null;
        }

        // Se falhou, seguir para nó de erro (se configurado)
        return $config['error_node_id'] ?? null;
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
                $newArray[$key] = preg_replace_callback('/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/', function ($matches) use ($payload) {
                    $k = $matches[1];
                    return $payload[$k] ?? $matches[0];
                }, $value);
            } elseif (is_array($value)) {
                $newArray[$key] = $this->replacePlaceholdersInArray($value, $payload);
            } else {
                $newArray[$key] = $value;
            }
        }
        return $newArray;
    }
}
