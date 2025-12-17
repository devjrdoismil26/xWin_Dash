<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Universe Module Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for the Universe module including monitoring, cache,
    | and performance settings.
    |
    */

    'monitoring' => [
        'enabled' => env('UNIVERSE_MONITORING_ENABLED', true),
        'interval' => env('UNIVERSE_MONITORING_INTERVAL', 300), // 5 minutes
        'email_alert_to' => env('UNIVERSE_MONITORING_EMAIL_TO', 'admin@xwin-dash.com'),
        'slack_webhook_url' => env('UNIVERSE_MONITORING_SLACK_WEBHOOK'),
        'thresholds' => [
            'memory_usage' => [
                'warning' => env('UNIVERSE_MEMORY_WARNING', 80),
                'critical' => env('UNIVERSE_MEMORY_CRITICAL', 90),
            ],
            'response_time' => [
                'warning' => env('UNIVERSE_RESPONSE_WARNING', 2.0),
                'critical' => env('UNIVERSE_RESPONSE_CRITICAL', 5.0),
            ],
            'error_rate' => [
                'warning' => env('UNIVERSE_ERROR_WARNING', 5.0),
                'critical' => env('UNIVERSE_ERROR_CRITICAL', 10.0),
            ],
        ],
    ],

    'cache' => [
        'enabled' => env('UNIVERSE_CACHE_ENABLED', true),
        'ttl' => [
            'templates' => env('UNIVERSE_CACHE_TEMPLATES_TTL', 3600),
            'instances' => env('UNIVERSE_CACHE_INSTANCES_TTL', 1800),
            'analytics' => env('UNIVERSE_CACHE_ANALYTICS_TTL', 900),
            'system_config' => env('UNIVERSE_CACHE_SYSTEM_TTL', 7200),
        ],
        'prefix' => env('UNIVERSE_CACHE_PREFIX', 'universe:'),
    ],

    'performance' => [
        'enabled' => env('UNIVERSE_PERFORMANCE_ENABLED', true),
        'batch_size' => env('UNIVERSE_BATCH_SIZE', 100),
        'max_memory_usage' => env('UNIVERSE_MAX_MEMORY', '256M'),
        'slow_query_threshold' => env('UNIVERSE_SLOW_QUERY_THRESHOLD', 1.0),
    ],

    'api' => [
        'rate_limit' => env('UNIVERSE_API_RATE_LIMIT', 1000),
        'rate_limit_window' => env('UNIVERSE_API_RATE_WINDOW', 60),
        'timeout' => env('UNIVERSE_API_TIMEOUT', 30),
        'max_retries' => env('UNIVERSE_API_MAX_RETRIES', 3),
    ],

    'features' => [
        'ai_enabled' => env('UNIVERSE_AI_ENABLED', true),
        'analytics_enabled' => env('UNIVERSE_ANALYTICS_ENABLED', true),
        'automation_enabled' => env('UNIVERSE_AUTOMATION_ENABLED', true),
        'marketplace_enabled' => env('UNIVERSE_MARKETPLACE_ENABLED', true),
    ],

    'security' => [
        'encrypt_sensitive_data' => env('UNIVERSE_ENCRYPT_DATA', true),
        'audit_log_enabled' => env('UNIVERSE_AUDIT_LOG_ENABLED', true),
        'max_file_size' => env('UNIVERSE_MAX_FILE_SIZE', '10M'),
        'allowed_file_types' => ['json', 'xml', 'csv', 'txt'],
    ],

    'integrations' => [
        'openai' => [
            'enabled' => env('UNIVERSE_OPENAI_ENABLED', false),
            'api_key' => env('UNIVERSE_OPENAI_API_KEY'),
            'model' => env('UNIVERSE_OPENAI_MODEL', 'gpt-3.5-turbo'),
        ],
        'gemini' => [
            'enabled' => env('UNIVERSE_GEMINI_ENABLED', false),
            'api_key' => env('UNIVERSE_GEMINI_API_KEY'),
            'model' => env('UNIVERSE_GEMINI_MODEL', 'gemini-pro'),
        ],
    ],

    'notifications' => [
        'email' => [
            'enabled' => env('UNIVERSE_EMAIL_NOTIFICATIONS', true),
            'from_address' => env('UNIVERSE_EMAIL_FROM', 'noreply@xwin-dash.com'),
            'from_name' => env('UNIVERSE_EMAIL_FROM_NAME', 'xWin Dash Universe'),
        ],
        'slack' => [
            'enabled' => env('UNIVERSE_SLACK_NOTIFICATIONS', false),
            'webhook_url' => env('UNIVERSE_SLACK_WEBHOOK_URL'),
            'channel' => env('UNIVERSE_SLACK_CHANNEL', '#universe-alerts'),
        ],
    ],

    'logging' => [
        'enabled' => env('UNIVERSE_LOGGING_ENABLED', true),
        'level' => env('UNIVERSE_LOG_LEVEL', 'info'),
        'channels' => [
            'monitoring' => env('UNIVERSE_LOG_MONITORING_CHANNEL', 'daily'),
            'performance' => env('UNIVERSE_LOG_PERFORMANCE_CHANNEL', 'daily'),
            'errors' => env('UNIVERSE_LOG_ERRORS_CHANNEL', 'daily'),
        ],
    ],
];