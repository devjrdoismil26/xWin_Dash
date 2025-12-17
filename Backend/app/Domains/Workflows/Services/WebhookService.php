<?php

namespace App\Domains\Workflows\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

class WebhookService
{
    /**
     * Send webhook request
     *
     * @param string $url
     * @param array<string, mixed> $payload
     * @param array<string, mixed> $headers
     * @param string $method
     * @return array<string, mixed>
     */
    public function sendWebhook(
        string $url,
        array $payload,
        array $headers = [],
        string $method = 'POST'
    ): array {
        try {
            $defaultHeaders = [
                'Content-Type' => 'application/json',
                'User-Agent' => 'xWin-Dash-Workflows/1.0',
                'X-Timestamp' => now()->toISOString()
            ];

            $mergedHeaders = array_merge($defaultHeaders, $headers);

            $response = Http::withHeaders($mergedHeaders)
                ->timeout(30)
                ->retry(3, 1000)
                ->send($method, $url, $payload);

            $result = [
                'success' => $response->successful(),
                'status_code' => $response->status(),
                'response_body' => $response->body(),
                'response_headers' => $response->headers(),
                'execution_time' => $response->transferStats?->getHandlerStat('total_time') ?? 0,
                'timestamp' => now()->toISOString()
            ];

            if (!$response->successful()) {
                $result['error'] = "HTTP {$response->status()}: {$response->body()}";
                Log::warning('Webhook failed', [
                    'url' => $url,
                    'status' => $response->status(),
                    'response' => $response->body()
                ]);
            } else {
                Log::info('Webhook sent successfully', [
                    'url' => $url,
                    'status' => $response->status()
                ]);
            }

            return $result;
        } catch (\Exception $e) {
            Log::error('Webhook exception', [
                'url' => $url,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
                'status_code' => 0,
                'response_body' => null,
                'response_headers' => [],
                'execution_time' => 0,
                'timestamp' => now()->toISOString()
            ];
        }
    }

    /**
     * Send webhook with retry logic
     *
     * @param string $url
     * @param array<string, mixed> $payload
     * @param array<string, mixed> $options
     * @return array<string, mixed>
     */
    public function sendWebhookWithRetry(
        string $url,
        array $payload,
        array $options = []
    ): array {
        $maxRetries = $options['max_retries'] ?? 3;
        $retryDelay = $options['retry_delay'] ?? 1000;
        $timeout = $options['timeout'] ?? 30;
        $headers = $options['headers'] ?? [];

        $attempts = 0;
        $lastError = null;

        while ($attempts < $maxRetries) {
            $attempts++;

            $result = $this->sendWebhook($url, $payload, $headers);

            if ($result['success']) {
                return array_merge($result, [
                    'attempts' => $attempts,
                    'retry_successful' => $attempts > 1
                ]);
            }

            $lastError = $result;

            // Don't retry on client errors (4xx)
            if ($result['status_code'] >= 400 && $result['status_code'] < 500) {
                break;
            }

            if ($attempts < $maxRetries) {
                usleep($retryDelay * 1000); // Convert to microseconds
            }
        }

        return array_merge($lastError, [
            'attempts' => $attempts,
            'retry_successful' => false,
            'final_error' => 'Max retries exceeded'
        ]);
    }

    /**
     * Validate webhook URL
     *
     * @param string $url
     * @return array<string, mixed>
     */
    public function validateWebhookUrl(string $url): array
    {
        try {
            // Basic URL validation
            if (!filter_var($url, FILTER_VALIDATE_URL)) {
                return [
                    'valid' => false,
                    'error' => 'Invalid URL format'
                ];
            }

            // Check if URL is reachable
            $response = Http::timeout(10)->head($url);

            return [
                'valid' => true,
                'reachable' => $response->successful(),
                'status_code' => $response->status(),
                'response_time' => $response->transferStats?->getHandlerStat('total_time') ?? 0
            ];
        } catch (\Exception $e) {
            return [
                'valid' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Send test webhook
     *
     * @param string $url
     * @param array<string, mixed> $options
     * @return array<string, mixed>
     */
    public function sendTestWebhook(string $url, array $options = []): array
    {
        $testPayload = [
            'event' => 'test',
            'message' => 'This is a test webhook from xWin-Dash Workflows',
            'timestamp' => now()->toISOString(),
            'workflow_id' => $options['workflow_id'] ?? null,
            'test_id' => uniqid('test_', true)
        ];

        $headers = $options['headers'] ?? [];
        if (isset($options['secret'])) {
            $headers['X-Webhook-Secret'] = $options['secret'];
        }

        return $this->sendWebhook($url, $testPayload, $headers);
    }

    /**
     * Process incoming webhook
     *
     * @param array<string, mixed> $payload
     * @param array<string, mixed> $headers
     * @return array<string, mixed>
     */
    public function processIncomingWebhook(array $payload, array $headers = []): array
    {
        try {
            // Extract webhook information
            $webhookData = [
                'payload' => $payload,
                'headers' => $headers,
                'received_at' => now()->toISOString(),
                'source_ip' => request()->ip(),
                'user_agent' => request()->userAgent()
            ];

            // Validate webhook signature if provided
            if (isset($headers['X-Webhook-Signature'])) {
                $isValid = $this->validateWebhookSignature($payload, $headers['X-Webhook-Signature']);
                $webhookData['signature_valid'] = $isValid;

                if (!$isValid) {
                    Log::warning('Invalid webhook signature', $webhookData);
                    return [
                        'success' => false,
                        'error' => 'Invalid webhook signature'
                    ];
                }
            }

            // Store webhook for processing
            $this->storeWebhook($webhookData);

            // Trigger workflow if configured
            if (isset($payload['workflow_trigger'])) {
                $this->triggerWorkflowFromWebhook($payload);
            }

            return [
                'success' => true,
                'message' => 'Webhook processed successfully',
                'webhook_id' => $webhookData['id'] ?? null
            ];
        } catch (\Exception $e) {
            Log::error('Webhook processing failed', [
                'error' => $e->getMessage(),
                'payload' => $payload,
                'headers' => $headers
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Validate webhook signature
     *
     * @param array<string, mixed> $payload
     * @param string $signature
     * @param string $secret
     * @return bool
     */
    public function validateWebhookSignature(array $payload, string $signature, string $secret = null): bool
    {
        if (!$secret) {
            $secret = config('workflows.webhook_secret', 'default-secret');
        }

        $expectedSignature = hash_hmac('sha256', json_encode($payload), $secret);
        $providedSignature = str_replace('sha256=', '', $signature);

        return hash_equals($expectedSignature, $providedSignature);
    }

    /**
     * Store webhook data
     *
     * @param array<string, mixed> $webhookData
     * @return void
     */
    private function storeWebhook(array $webhookData): void
    {
        // Store in cache for immediate access
        $webhookId = uniqid('webhook_', true);
        $webhookData['id'] = $webhookId;

        Cache::put("webhook_{$webhookId}", $webhookData, 3600); // Store for 1 hour

        // Log for audit trail
        Log::info('Webhook stored', [
            'webhook_id' => $webhookId,
            'payload_size' => strlen(json_encode($webhookData['payload']))
        ]);
    }

    /**
     * Trigger workflow from webhook
     *
     * @param array<string, mixed> $payload
     * @return void
     */
    private function triggerWorkflowFromWebhook(array $payload): void
    {
        if (!isset($payload['workflow_trigger']['workflow_id'])) {
            return;
        }

        $workflowId = $payload['workflow_trigger']['workflow_id'];
        $triggerData = $payload['workflow_trigger']['data'] ?? [];

        // Dispatch job to trigger workflow
        // This would typically dispatch a job to process the workflow
        Log::info('Triggering workflow from webhook', [
            'workflow_id' => $workflowId,
            'trigger_data' => $triggerData
        ]);
    }

    /**
     * Get webhook statistics
     *
     * @param string $period
     * @return array<string, mixed>
     */
    public function getWebhookStats(string $period = '24h'): array
    {
        $cacheKey = "webhook_stats_{$period}";

        return Cache::remember($cacheKey, 300, function () use ($period) {
            // This would typically query a webhook logs table
            // For now, return mock data
            return [
                'period' => $period,
                'total_webhooks' => rand(100, 1000),
                'successful_webhooks' => rand(80, 95),
                'failed_webhooks' => rand(5, 20),
                'average_response_time' => rand(100, 500) / 1000, // seconds
                'webhooks_by_hour' => $this->generateMockHourlyData(),
                'top_webhook_urls' => $this->generateMockTopUrls()
            ];
        });
    }

    /**
     * Generate mock hourly data
     *
     * @return array<string, int>
     */
    private function generateMockHourlyData(): array
    {
        $data = [];
        for ($i = 0; $i < 24; $i++) {
            $data[sprintf('%02d:00', $i)] = rand(0, 50);
        }
        return $data;
    }

    /**
     * Generate mock top URLs
     *
     * @return array<string, mixed>
     */
    private function generateMockTopUrls(): array
    {
        return [
            [
                'url' => 'https://api.example.com/webhook',
                'count' => rand(50, 200),
                'success_rate' => rand(85, 99)
            ],
            [
                'url' => 'https://slack.com/api/webhook',
                'count' => rand(30, 150),
                'success_rate' => rand(90, 100)
            ],
            [
                'url' => 'https://discord.com/api/webhook',
                'count' => rand(20, 100),
                'success_rate' => rand(80, 95)
            ]
        ];
    }

    /**
     * Create webhook endpoint
     *
     * @param array<string, mixed> $config
     * @return array<string, mixed>
     */
    public function createWebhookEndpoint(array $config): array
    {
        $endpointId = uniqid('endpoint_', true);
        $secret = bin2hex(random_bytes(32));

        $endpoint = [
            'id' => $endpointId,
            'url' => $config['url'] ?? null,
            'secret' => $secret,
            'events' => $config['events'] ?? ['*'],
            'active' => true,
            'created_at' => now()->toISOString(),
            'config' => $config
        ];

        // Store endpoint configuration
        Cache::put("webhook_endpoint_{$endpointId}", $endpoint, 86400 * 30); // 30 days

        return [
            'success' => true,
            'endpoint' => $endpoint,
            'webhook_url' => route('webhooks.receive', ['endpoint' => $endpointId])
        ];
    }

    /**
     * Delete webhook endpoint
     *
     * @param string $endpointId
     * @return array<string, mixed>
     */
    public function deleteWebhookEndpoint(string $endpointId): array
    {
        $deleted = Cache::forget("webhook_endpoint_{$endpointId}");

        return [
            'success' => $deleted,
            'message' => $deleted ? 'Endpoint deleted successfully' : 'Endpoint not found'
        ];
    }

    /**
     * List webhook endpoints
     *
     * @return array<string, mixed>
     */
    public function listWebhookEndpoints(): array
    {
        // This would typically query a database
        // For now, return mock data
        return [
            'endpoints' => [
                [
                    'id' => 'endpoint_1',
                    'url' => 'https://api.example.com/webhook',
                    'events' => ['workflow.completed', 'workflow.failed'],
                    'active' => true,
                    'created_at' => now()->subDays(7)->toISOString()
                ],
                [
                    'id' => 'endpoint_2',
                    'url' => 'https://slack.com/api/webhook',
                    'events' => ['*'],
                    'active' => true,
                    'created_at' => now()->subDays(3)->toISOString()
                ]
            ],
            'total' => 2
        ];
    }
}
