<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Shared Services Configuration
    |--------------------------------------------------------------------------
    |
    | This file controls which shared services are enabled and their
    | specific configurations for conditional loading.
    |
    */

    'enabled' => env('SHARED_ENABLED', true),
    
    'monitoring' => [
        'enabled' => env('SHARED_MONITORING_ENABLED', true),
        'apm_enabled' => env('SHARED_APM_ENABLED', true),
        'queue_monitoring_enabled' => env('SHARED_QUEUE_MONITORING_ENABLED', true),
        'apm_middleware_enabled' => env('SHARED_APM_MIDDLEWARE_ENABLED', true),
    ],

    'alerting' => [
        'enabled' => env('SHARED_ALERTING_ENABLED', true),
        'email_alerts' => env('SHARED_EMAIL_ALERTS_ENABLED', true),
        'slack_alerts' => env('SHARED_SLACK_ALERTS_ENABLED', true),
        'webhook_alerts' => env('SHARED_WEBHOOK_ALERTS_ENABLED', true),
    ],

    'query_optimization' => [
        'enabled' => env('SHARED_QUERY_OPTIMIZATION_ENABLED', true),
        'slow_query_logging_enabled' => env('SHARED_SLOW_QUERY_LOGGING_ENABLED', true),
        'slow_query_threshold' => env('SHARED_SLOW_QUERY_THRESHOLD', 2.0),
        'query_caching_enabled' => env('SHARED_QUERY_CACHING_ENABLED', true),
    ],

    'event_system' => [
        'enabled' => env('SHARED_EVENT_SYSTEM_ENABLED', true),
        'event_store_enabled' => env('SHARED_EVENT_STORE_ENABLED', true),
        'event_dispatcher_enabled' => env('SHARED_EVENT_DISPATCHER_ENABLED', true),
        'saga_cleanup_enabled' => env('SHARED_SAGA_CLEANUP_ENABLED', true),
    ],

    'cache' => [
        'enabled' => env('SHARED_CACHE_ENABLED', true),
        'redis_enabled' => env('SHARED_REDIS_CACHE_ENABLED', true),
        'file_cache_enabled' => env('SHARED_FILE_CACHE_ENABLED', true),
        'memory_cache_enabled' => env('SHARED_MEMORY_CACHE_ENABLED', true),
    ],

    'security' => [
        'enabled' => env('SHARED_SECURITY_ENABLED', true),
        'transaction_management_enabled' => env('SHARED_TRANSACTION_MANAGEMENT_ENABLED', true),
        'audit_logging_enabled' => env('SHARED_AUDIT_LOGGING_ENABLED', true),
        'encryption_enabled' => env('SHARED_ENCRYPTION_ENABLED', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | Performance Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for performance optimization of shared services.
    |
    */

    'performance' => [
        'cache_enabled' => env('SHARED_CACHE_ENABLED', true),
        'cache_duration' => env('SHARED_CACHE_DURATION', 3600),
        'lazy_loading' => env('SHARED_LAZY_LOADING', true),
        'deferred_loading' => env('SHARED_DEFERRED_LOADING', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | Monitoring Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for monitoring shared services.
    |
    */

    'monitoring_config' => [
        'enabled' => env('SHARED_MONITORING_CONFIG_ENABLED', true),
        'log_requests' => env('SHARED_LOG_REQUESTS', true),
        'log_responses' => env('SHARED_LOG_RESPONSES', false),
        'log_errors' => env('SHARED_LOG_ERRORS', true),
        'metrics_enabled' => env('SHARED_METRICS_ENABLED', true),
    ],
];