<?php

declare(strict_types=1);

return [
    /*
    |--------------------------------------------------------------------------
    | Workflow Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for workflow system including webhooks, rate limiting,
    | and execution settings.
    |
    */

    // Webhook configuration
    'webhook_secret' => env('WORKFLOW_WEBHOOK_SECRET', 'your-webhook-secret-here'),
    'webhook_signature_required' => env('WORKFLOW_WEBHOOK_SIGNATURE_REQUIRED', true),
    'webhook_rate_limit' => env('WORKFLOW_WEBHOOK_RATE_LIMIT', 60), // requests per minute

    // Rate limiting for webhooks
    'webhook_rate_limit' => [
        'requests_per_minute' => env('WEBHOOK_RATE_LIMIT', 60),
        'burst_limit' => env('WEBHOOK_BURST_LIMIT', 10),
    ],

    // Circuit breaker settings
    'circuit_breaker' => [
        'failure_threshold' => env('WORKFLOW_CIRCUIT_BREAKER_FAILURE_THRESHOLD', 5),
        'retry_timeout' => env('WORKFLOW_CIRCUIT_BREAKER_RETRY_TIMEOUT', 60),
        'timeout' => env('WORKFLOW_CIRCUIT_BREAKER_TIMEOUT', 30),
    ],

    // Execution settings
    'execution' => [
        'max_concurrent_workflows' => env('MAX_CONCURRENT_WORKFLOWS', 100),
        'workflow_timeout' => env('WORKFLOW_TIMEOUT', 300), // 5 minutes
        'node_timeout' => env('NODE_TIMEOUT', 60), // 1 minute
        'retry_attempts' => env('WORKFLOW_RETRY_ATTEMPTS', 3),
    ],

    // Queue settings
    'queues' => [
        'workflow_execution' => env('WORKFLOW_EXECUTION_QUEUE', 'workflows'),
        'webhook_processing' => env('WEBHOOK_PROCESSING_QUEUE', 'webhooks'),
        'high_priority' => env('HIGH_PRIORITY_QUEUE', 'critical'),
    ],

    // Monitoring and alerting
    'monitoring' => [
        'enable_metrics' => env('WORKFLOW_METRICS_ENABLED', true),
        'alert_on_failure' => env('WORKFLOW_ALERT_ON_FAILURE', true),
        'alert_threshold' => env('WORKFLOW_ALERT_THRESHOLD', 5), // failures per hour
    ],

    // Webhook authentication methods
    'webhook_auth_methods' => [
        'token' => [
            'header' => 'X-Webhook-Token',
            'required' => true,
        ],
        'api_key' => [
            'header' => 'X-API-Key',
            'required' => false,
        ],
        'basic_auth' => [
            'required' => false,
        ],
    ],

    // Default webhook payload schema
    'default_webhook_schema' => [
        'lead_email' => 'string (optional)',
        'lead_phone' => 'string (optional)',
        'lead_name' => 'string (optional)',
        'custom_data' => 'object (optional)',
        'workflow_context' => 'object (auto-generated)',
    ],

    // Webhook validation rules
    'webhook_validation_rules' => [
        'lead_email' => 'nullable|email',
        'lead_phone' => 'nullable|string|max:20',
        'lead_name' => 'nullable|string|max:255',
        'custom_data' => 'nullable|array',
    ],

    // Security settings
    'security' => [
        'allowed_ips' => env('WEBHOOK_ALLOWED_IPS', ''), // comma-separated IPs
        'require_https' => env('WEBHOOK_REQUIRE_HTTPS', true),
        'max_payload_size' => env('WEBHOOK_MAX_PAYLOAD_SIZE', 1024 * 1024), // 1MB
    ],
];
