<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Database Optimization Configuration
    |--------------------------------------------------------------------------
    |
    | This file controls database optimization settings and providers.
    |
    */

    'enabled' => env('DATABASE_OPTIMIZATION_ENABLED', true),
    
    'query_optimization' => [
        'enabled' => env('DATABASE_QUERY_OPTIMIZATION_ENABLED', true),
        'slow_query_logging' => env('DATABASE_SLOW_QUERY_LOGGING_ENABLED', true),
        'slow_query_threshold' => env('DATABASE_SLOW_QUERY_THRESHOLD', 100),
        'query_caching' => env('DATABASE_QUERY_CACHING_ENABLED', true),
        'query_cache_duration' => env('DATABASE_QUERY_CACHE_DURATION', 3600),
    ],

    'index_management' => [
        'enabled' => env('DATABASE_INDEX_MANAGEMENT_ENABLED', true),
        'auto_analyze' => env('DATABASE_AUTO_ANALYZE_ENABLED', true),
        'auto_optimize' => env('DATABASE_AUTO_OPTIMIZE_ENABLED', false),
        'index_monitoring' => env('DATABASE_INDEX_MONITORING_ENABLED', true),
    ],

    'connection_management' => [
        'enabled' => env('DATABASE_CONNECTION_MANAGEMENT_ENABLED', true),
        'connection_pooling' => env('DATABASE_CONNECTION_POOLING_ENABLED', true),
        'max_connections' => env('DATABASE_MAX_CONNECTIONS', 100),
        'connection_monitoring' => env('DATABASE_CONNECTION_MONITORING_ENABLED', true),
    ],

    'migration_management' => [
        'enabled' => env('DATABASE_MIGRATION_MANAGEMENT_ENABLED', true),
        'auto_validate' => env('DATABASE_AUTO_VALIDATE_MIGRATIONS_ENABLED', true),
        'backup_before_migration' => env('DATABASE_BACKUP_BEFORE_MIGRATION_ENABLED', true),
        'rollback_protection' => env('DATABASE_ROLLBACK_PROTECTION_ENABLED', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | Performance Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for database performance optimization.
    |
    */

    'performance' => [
        'cache_enabled' => env('DATABASE_CACHE_ENABLED', true),
        'cache_duration' => env('DATABASE_CACHE_DURATION', 3600),
        'lazy_loading' => env('DATABASE_LAZY_LOADING', true),
        'deferred_loading' => env('DATABASE_DEFERRED_LOADING', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | Monitoring Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for database monitoring.
    |
    */

    'monitoring' => [
        'enabled' => env('DATABASE_MONITORING_ENABLED', true),
        'log_queries' => env('DATABASE_LOG_QUERIES', true),
        'log_slow_queries' => env('DATABASE_LOG_SLOW_QUERIES', true),
        'log_connections' => env('DATABASE_LOG_CONNECTIONS', false),
        'metrics_enabled' => env('DATABASE_METRICS_ENABLED', true),
    ],
];