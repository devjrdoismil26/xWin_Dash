<?php

namespace App\Domains\Workflows\Activities;

use App\Domains\Analytics\Services\AnalyticsService;
use Illuminate\Support\Facades\Log;

// Supondo que este serviço exista

class UpdateCampaignAnalyticsActivity
{
    protected AnalyticsService $analyticsService;

    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    /**
     * Executa a atividade de atualização de analytics de campanha.
     *
     * @param array<string, mixed> $parameters parâmetros para a atualização (ex: 'campaign_id', 'metric_name', 'value')
     * @param array<string, mixed> $payload    o payload atual do workflow
     *
     * @return array<string, mixed> o payload atualizado com o resultado da atualização de analytics
     *
     * @throws \Exception se a atualização falhar
     */
    public function execute(array $parameters, array $payload): array
    {
        Log::info("Executando UpdateCampaignAnalyticsActivity.", [
            'parameters' => array_keys($parameters)
        ]);

        $campaignId = $parameters['campaign_id'] ?? null;
        $metricName = $parameters['metric_name'] ?? null;
        $value = $parameters['value'] ?? null;
        $metadata = $parameters['metadata'] ?? [];

        // Suporte a múltiplas métricas
        $metrics = $parameters['metrics'] ?? null;

        if ($metrics && is_array($metrics)) {
            // Processar múltiplas métricas
            return $this->executeMultipleMetrics($campaignId, $metrics, $payload, $metadata);
        }

        // Processar métrica única
        if (!$campaignId || !$metricName || $value === null) {
            throw new \Exception("Parâmetros inválidos para atualização de analytics de campanha: 'campaign_id', 'metric_name' e 'value' são obrigatórios.");
        }

        try {
            // Substituir placeholders nos parâmetros com valores do payload
            $finalCampaignId = $this->replacePlaceholder($campaignId, $payload);
            $finalMetricName = $this->replacePlaceholder($metricName, $payload);
            $finalValue = $this->replacePlaceholder($value, $payload);
            
            // Converter valor para tipo apropriado
            $finalValue = $this->convertValue($finalValue);

            // Registrar métrica usando AnalyticsService
            $result = $this->analyticsService->recordCampaignMetric(
                $finalCampaignId, 
                $finalMetricName, 
                $finalValue,
                array_merge($metadata, [
                    'workflow_execution_id' => $payload['execution_id'] ?? null,
                    'workflow_id' => $payload['workflow_id'] ?? null,
                    'recorded_at' => now()->toIso8601String()
                ])
            );

            if (!$result) {
                throw new \Exception("Falha ao registrar métrica no AnalyticsService");
            }

            $payload['campaign_analytics_update_result'] = [
                'campaign_id' => $finalCampaignId, 
                'metric' => $finalMetricName, 
                'value' => $finalValue, 
                'status' => 'success',
                'timestamp' => now()->toIso8601String()
            ];
            
            Log::info("Analytics da campanha ID: {$finalCampaignId} atualizado para a métrica '{$finalMetricName}' com valor {$finalValue}.");
        } catch (\Exception $e) {
            Log::error("Falha ao atualizar analytics da campanha ID: {$campaignId}: " . $e->getMessage(), [
                'campaign_id' => $campaignId,
                'metric_name' => $metricName,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            $payload['campaign_analytics_update_result'] = [
                'campaign_id' => $campaignId,
                'status' => 'error',
                'error' => $e->getMessage()
            ];
            
            throw $e;
        }

        return $payload;
    }

    /**
     * Execute multiple metrics update
     */
    protected function executeMultipleMetrics($campaignId, array $metrics, array $payload, array $metadata): array
    {
        $results = [];
        $errors = [];

        foreach ($metrics as $metric) {
            try {
                $metricName = $metric['name'] ?? $metric['metric_name'] ?? null;
                $value = $metric['value'] ?? null;

                if (!$metricName || $value === null) {
                    $errors[] = "Métrica inválida: " . json_encode($metric);
                    continue;
                }

                $finalCampaignId = $this->replacePlaceholder($campaignId, $payload);
                $finalMetricName = $this->replacePlaceholder($metricName, $payload);
                $finalValue = $this->convertValue($this->replacePlaceholder($value, $payload));

                $result = $this->analyticsService->recordCampaignMetric(
                    $finalCampaignId,
                    $finalMetricName,
                    $finalValue,
                    array_merge($metadata, $metric['metadata'] ?? [])
                );

                if ($result) {
                    $results[] = [
                        'metric' => $finalMetricName,
                        'value' => $finalValue,
                        'status' => 'success'
                    ];
                } else {
                    $errors[] = "Falha ao registrar métrica: {$finalMetricName}";
                }
            } catch (\Exception $e) {
                $errors[] = "Erro ao processar métrica: " . $e->getMessage();
                Log::warning("Erro ao processar métrica individual", [
                    'metric' => $metric,
                    'error' => $e->getMessage()
                ]);
            }
        }

        $payload['campaign_analytics_update_result'] = [
            'campaign_id' => $this->replacePlaceholder($campaignId, $payload),
            'metrics_processed' => count($results),
            'metrics_total' => count($metrics),
            'results' => $results,
            'errors' => $errors,
            'status' => empty($errors) ? 'success' : 'partial'
        ];

        return $payload;
    }

    /**
     * Convert value to appropriate type
     */
    protected function convertValue($value)
    {
        if (is_numeric($value)) {
            return strpos($value, '.') !== false ? (float) $value : (int) $value;
        }
        if (is_string($value) && strtolower($value) === 'true') {
            return true;
        }
        if (is_string($value) && strtolower($value) === 'false') {
            return false;
        }
        return $value;
    }

    /**
     * Substitui um placeholder no texto com um valor do payload.
     *
     * @param string|null $text    o texto com placeholder (ex: "{{ campaign_id }}")
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
            return $payload[$key] ?? $matches[0]; // Retorna o placeholder original se a chave não existir
        }, $text);
    }
}
