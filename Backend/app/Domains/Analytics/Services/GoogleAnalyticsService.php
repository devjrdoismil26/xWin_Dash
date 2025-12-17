<?php

namespace App\Domains\Analytics\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class GoogleAnalyticsService
{
    protected string $baseUrl;
    protected string $propertyId;
    protected string $accessToken;

    public function __construct()
    {
        $this->baseUrl = config('services.google_analytics.base_url', 'https://analyticsdata.googleapis.com/v1beta');
        $this->propertyId = config('services.google_analytics.property_id', '');
        $this->accessToken = config('services.google_analytics.access_token', '');
    }

    /**
     * Define o token de acesso.
     */
    public function setAccessToken(string $accessToken): void
    {
        $this->accessToken = $accessToken;
    }

    /**
     * Define o property ID.
     */
    public function setPropertyId(string $propertyId): void
    {
        $this->propertyId = $propertyId;
    }

    /**
     * Obtém relatório básico de Analytics.
     *
     * @param array $metrics Métricas a serem obtidas
     * @param array $dimensions Dimensões para agrupamento
     * @param string $startDate Data de início (YYYY-MM-DD)
     * @param string $endDate Data de fim (YYYY-MM-DD)
     * @param array $filters Filtros opcionais
     *
     * @return array
     */
    public function getReport(
        array $metrics = ['activeUsers', 'sessions'],
        array $dimensions = ['date'],
        string $startDate = '7daysAgo',
        string $endDate = 'today',
        array $filters = []
    ): array {
        $cacheKey = 'analytics_report_' . md5(json_encode(compact('metrics', 'dimensions', 'startDate', 'endDate', 'filters')));

        return Cache::remember($cacheKey, 3600, function () use ($metrics, $dimensions, $startDate, $endDate, $filters) {
            return $this->fetchReport($metrics, $dimensions, $startDate, $endDate, $filters);
        });
    }

    /**
     * Busca relatório da API do Google Analytics.
     */
    protected function fetchReport(array $metrics, array $dimensions, string $startDate, string $endDate, array $filters): array
    {
        Log::info("Obtendo relatório do Google Analytics", compact('metrics', 'dimensions', 'startDate', 'endDate'));

        try {
            $payload = [
                'dateRanges' => [
                    [
                        'startDate' => $startDate,
                        'endDate' => $endDate,
                    ]
                ],
                'metrics' => array_map(function ($metric) {
                    return ['name' => $metric];
                }, $metrics),
                'dimensions' => array_map(function ($dimension) {
                    return ['name' => $dimension];
                }, $dimensions),
            ];

            // Adicionar filtros se fornecidos
            if (!empty($filters)) {
                $payload['dimensionFilter'] = $this->buildFilters($filters);
            }

            $response = Http::withToken($this->accessToken)
                ->withHeaders(['Content-Type' => 'application/json'])
                ->post("{$this->baseUrl}/properties/{$this->propertyId}:runReport", $payload);

            if ($response->successful()) {
                $data = $response->json();
                Log::info("Relatório do Google Analytics obtido com sucesso");
                return $this->processReportData($data);
            } else {
                Log::error("Falha ao obter relatório do Google Analytics: " . $response->body());
                throw new \Exception("Google Analytics API Error: " . $response->body());
            }
        } catch (\Exception $e) {
            Log::error("Erro ao conectar com Google Analytics: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Processa dados do relatório para formato mais amigável.
     */
    protected function processReportData(array $data): array
    {
        $processed = [
            'totals' => [],
            'rows' => [],
            'metadata' => [
                'metrics' => $data['metricHeaders'] ?? [],
                'dimensions' => $data['dimensionHeaders'] ?? [],
            ]
        ];

        // Processar totais
        if (isset($data['totals'])) {
            foreach ($data['totals'] as $total) {
                foreach ($total['metricValues'] as $index => $value) {
                    $metricName = $data['metricHeaders'][$index]['name'] ?? "metric_{$index}";
                    $processed['totals'][$metricName] = $value['value'];
                }
            }
        }

        // Processar linhas de dados
        if (isset($data['rows'])) {
            foreach ($data['rows'] as $row) {
                $processedRow = [];

                // Dimensões
                foreach ($row['dimensionValues'] as $index => $dimension) {
                    $dimensionName = $data['dimensionHeaders'][$index]['name'] ?? "dimension_{$index}";
                    $processedRow[$dimensionName] = $dimension['value'];
                }

                // Métricas
                foreach ($row['metricValues'] as $index => $metric) {
                    $metricName = $data['metricHeaders'][$index]['name'] ?? "metric_{$index}";
                    $processedRow[$metricName] = $metric['value'];
                }

                $processed['rows'][] = $processedRow;
            }
        }

        return $processed;
    }

    /**
     * Constrói filtros para a query.
     */
    protected function buildFilters(array $filters): array
    {
        $filterExpression = [
            'andGroup' => [
                'expressions' => []
            ]
        ];

        foreach ($filters as $filter) {
            $expression = [
                'filter' => [
                    'fieldName' => $filter['dimension'],
                    'stringFilter' => [
                        'matchType' => $filter['operator'] ?? 'EXACT',
                        'value' => $filter['value']
                    ]
                ]
            ];

            $filterExpression['andGroup']['expressions'][] = $expression;
        }

        return $filterExpression;
    }

    /**
     * Obtém dados de páginas mais visitadas.
     */
    public function getTopPages(int $limit = 10, string $startDate = '30daysAgo', string $endDate = 'today'): array
    {
        return $this->getReport(
            ['screenPageViews', 'activeUsers'],
            ['pagePath', 'pageTitle'],
            $startDate,
            $endDate
        );
    }

    /**
     * Obtém dados de fontes de tráfego.
     */
    public function getTrafficSources(string $startDate = '30daysAgo', string $endDate = 'today'): array
    {
        return $this->getReport(
            ['sessions', 'activeUsers', 'engagedSessions'],
            ['sessionDefaultChannelGrouping', 'sessionSource'],
            $startDate,
            $endDate
        );
    }

    /**
     * Obtém métricas de engajamento em tempo real.
     */
    public function getRealTimeMetrics(): array
    {
        Log::info("Obtendo métricas em tempo real do Google Analytics");

        try {
            $response = Http::withToken($this->accessToken)
                ->get("{$this->baseUrl}/properties/{$this->propertyId}:runRealtimeReport", [
                    'metrics' => [
                        ['name' => 'activeUsers'],
                        ['name' => 'screenPageViews']
                    ],
                    'dimensions' => [
                        ['name' => 'country'],
                        ['name' => 'deviceCategory']
                    ]
                ]);

            if ($response->successful()) {
                return $this->processReportData($response->json());
            } else {
                Log::error("Falha ao obter métricas em tempo real: " . $response->body());
                throw new \Exception("Google Analytics Realtime API Error: " . $response->body());
            }
        } catch (\Exception $e) {
            Log::error("Erro ao obter métricas em tempo real: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Obtém eventos customizados.
     */
    public function getCustomEvents(string $eventName, string $startDate = '7daysAgo', string $endDate = 'today'): array
    {
        return $this->getReport(
            ['eventCount', 'totalUsers'],
            ['eventName', 'date'],
            $startDate,
            $endDate,
            [
                [
                    'dimension' => 'eventName',
                    'operator' => 'EXACT',
                    'value' => $eventName
                ]
            ]
        );
    }

    /**
     * Verifica conectividade com a API.
     */
    public function canConnect(): bool
    {
        try {
            $response = Http::withToken($this->accessToken)
                ->get("{$this->baseUrl}/properties/{$this->propertyId}/metadata");
            return $response->successful();
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Obtém informações da propriedade.
     */
    public function getPropertyInfo(): array
    {
        try {
            $response = Http::withToken($this->accessToken)
                ->get("https://analyticsadmin.googleapis.com/v1beta/properties/{$this->propertyId}");

            if ($response->successful()) {
                return $response->json();
            } else {
                throw new \Exception("Falha ao obter informações da propriedade: " . $response->body());
            }
        } catch (\Exception $e) {
            Log::error("Erro ao obter informações da propriedade: " . $e->getMessage());
            throw $e;
        }
    }
}
