<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Analytics Configuration
    |--------------------------------------------------------------------------
    |
    | Configurações específicas para o módulo de Analytics
    |
    */

    'enabled' => env('ANALYTICS_ENABLED', true),

    /*
    |--------------------------------------------------------------------------
    | Cache Configuration
    |--------------------------------------------------------------------------
    |
    | Configurações de cache para otimização de performance
    |
    */
    'cache' => [
        'enabled' => env('ANALYTICS_CACHE_ENABLED', true),
        'ttl' => env('ANALYTICS_CACHE_TTL', 300), // 5 minutos
        'max_size' => env('ANALYTICS_CACHE_MAX_SIZE', 1000),
        'prefix' => 'analytics_',
        'driver' => env('ANALYTICS_CACHE_DRIVER', 'redis'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Real-time Configuration
    |--------------------------------------------------------------------------
    |
    | Configurações para dados em tempo real
    |
    */
    'realtime' => [
        'enabled' => env('ANALYTICS_REALTIME_ENABLED', true),
        'websocket_url' => env('ANALYTICS_WS_URL', 'ws://localhost:6001'),
        'refresh_interval' => env('ANALYTICS_REFRESH_INTERVAL', 30000), // 30 segundos
        'max_connections' => env('ANALYTICS_MAX_CONNECTIONS', 1000),
        'heartbeat_interval' => env('ANALYTICS_HEARTBEAT_INTERVAL', 30000),
    ],

    /*
    |--------------------------------------------------------------------------
    | Data Processing Configuration
    |--------------------------------------------------------------------------
    |
    | Configurações para processamento de dados
    |
    */
    'processing' => [
        'batch_size' => env('ANALYTICS_BATCH_SIZE', 1000),
        'chunk_size' => env('ANALYTICS_CHUNK_SIZE', 100),
        'max_execution_time' => env('ANALYTICS_MAX_EXECUTION_TIME', 300), // 5 minutos
        'memory_limit' => env('ANALYTICS_MEMORY_LIMIT', '512M'),
        'queue_driver' => env('ANALYTICS_QUEUE_DRIVER', 'redis'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Export Configuration
    |--------------------------------------------------------------------------
    |
    | Configurações para exportação de dados
    |
    */
    'export' => [
        'formats' => ['json', 'csv', 'excel', 'pdf'],
        'max_size' => env('ANALYTICS_EXPORT_MAX_SIZE', 100000), // 100k registros
        'timeout' => env('ANALYTICS_EXPORT_TIMEOUT', 600), // 10 minutos
        'storage_driver' => env('ANALYTICS_EXPORT_STORAGE', 'local'),
        'temp_directory' => env('ANALYTICS_TEMP_DIR', storage_path('app/temp/analytics')),
    ],

    /*
    |--------------------------------------------------------------------------
    | Integrations Configuration
    |--------------------------------------------------------------------------
    |
    | Configurações para integrações externas
    |
    */
    'integrations' => [
        'google_analytics' => [
            'enabled' => env('GOOGLE_ANALYTICS_ENABLED', false),
            'client_id' => env('GOOGLE_ANALYTICS_CLIENT_ID'),
            'client_secret' => env('GOOGLE_ANALYTICS_CLIENT_SECRET'),
            'property_id' => env('GOOGLE_ANALYTICS_PROPERTY_ID'),
            'view_id' => env('GOOGLE_ANALYTICS_VIEW_ID'),
            'scopes' => ['https://www.googleapis.com/auth/analytics.readonly'],
        ],
        'facebook_analytics' => [
            'enabled' => env('FACEBOOK_ANALYTICS_ENABLED', false),
            'app_id' => env('FACEBOOK_APP_ID'),
            'app_secret' => env('FACEBOOK_APP_SECRET'),
            'access_token' => env('FACEBOOK_ACCESS_TOKEN'),
            'api_version' => env('FACEBOOK_API_VERSION', 'v18.0'),
        ],
        'custom_apis' => [
            'enabled' => env('CUSTOM_APIS_ENABLED', false),
            'endpoints' => [
                'traffic' => env('CUSTOM_TRAFFIC_ENDPOINT'),
                'conversions' => env('CUSTOM_CONVERSIONS_ENDPOINT'),
                'users' => env('CUSTOM_USERS_ENDPOINT'),
            ],
            'api_key' => env('CUSTOM_API_KEY'),
            'timeout' => env('CUSTOM_API_TIMEOUT', 30),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Security Configuration
    |--------------------------------------------------------------------------
    |
    | Configurações de segurança
    |
    */
    'security' => [
        'rate_limiting' => [
            'enabled' => env('ANALYTICS_RATE_LIMITING_ENABLED', true),
            'max_requests' => env('ANALYTICS_RATE_LIMIT_MAX', 100),
            'decay_minutes' => env('ANALYTICS_RATE_LIMIT_DECAY', 1),
        ],
        'data_encryption' => [
            'enabled' => env('ANALYTICS_ENCRYPTION_ENABLED', true),
            'algorithm' => env('ANALYTICS_ENCRYPTION_ALGORITHM', 'AES-256-CBC'),
            'key' => env('ANALYTICS_ENCRYPTION_KEY'),
        ],
        'access_control' => [
            'require_permissions' => env('ANALYTICS_REQUIRE_PERMISSIONS', true),
            'permissions' => [
                'analytics:read',
                'analytics:write',
                'analytics:export',
                'analytics:admin',
            ],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Monitoring Configuration
    |--------------------------------------------------------------------------
    |
    | Configurações para monitoramento e métricas
    |
    */
    'monitoring' => [
        'enabled' => env('ANALYTICS_MONITORING_ENABLED', true),
        'metrics' => [
            'performance' => env('ANALYTICS_MONITOR_PERFORMANCE', true),
            'errors' => env('ANALYTICS_MONITOR_ERRORS', true),
            'usage' => env('ANALYTICS_MONITOR_USAGE', true),
        ],
        'alerts' => [
            'enabled' => env('ANALYTICS_ALERTS_ENABLED', true),
            'thresholds' => [
                'response_time' => env('ANALYTICS_ALERT_RESPONSE_TIME', 5000), // 5 segundos
                'error_rate' => env('ANALYTICS_ALERT_ERROR_RATE', 5), // 5%
                'memory_usage' => env('ANALYTICS_ALERT_MEMORY_USAGE', 80), // 80%
            ],
            'channels' => ['email', 'slack', 'webhook'],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Database Configuration
    |--------------------------------------------------------------------------
    |
    | Configurações específicas do banco de dados para Analytics
    |
    */
    'database' => [
        'connection' => env('ANALYTICS_DB_CONNECTION', 'mysql'),
        'table_prefix' => env('ANALYTICS_TABLE_PREFIX', 'analytics_'),
        'indexes' => [
            'created_at',
            'updated_at',
            'user_id',
            'project_id',
            'event_type',
        ],
        'partitions' => [
            'enabled' => env('ANALYTICS_PARTITIONS_ENABLED', true),
            'strategy' => env('ANALYTICS_PARTITION_STRATEGY', 'monthly'),
            'retention_months' => env('ANALYTICS_RETENTION_MONTHS', 12),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Performance Configuration
    |--------------------------------------------------------------------------
    |
    | Configurações para otimização de performance
    |
    */
    'performance' => [
        'query_optimization' => [
            'enabled' => env('ANALYTICS_QUERY_OPTIMIZATION', true),
            'max_query_time' => env('ANALYTICS_MAX_QUERY_TIME', 30), // 30 segundos
            'query_cache_ttl' => env('ANALYTICS_QUERY_CACHE_TTL', 300), // 5 minutos
        ],
        'data_aggregation' => [
            'enabled' => env('ANALYTICS_DATA_AGGREGATION', true),
            'aggregation_interval' => env('ANALYTICS_AGGREGATION_INTERVAL', 3600), // 1 hora
            'precompute_metrics' => env('ANALYTICS_PRECOMPUTE_METRICS', true),
        ],
        'compression' => [
            'enabled' => env('ANALYTICS_COMPRESSION_ENABLED', true),
            'algorithm' => env('ANALYTICS_COMPRESSION_ALGORITHM', 'gzip'),
            'level' => env('ANALYTICS_COMPRESSION_LEVEL', 6),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Default Values
    |--------------------------------------------------------------------------
    |
    | Valores padrão para configurações
    |
    */
    'defaults' => [
        'date_range' => env('ANALYTICS_DEFAULT_DATE_RANGE', '30days'),
        'report_type' => env('ANALYTICS_DEFAULT_REPORT_TYPE', 'overview'),
        'metrics' => [
            'page_views',
            'unique_visitors',
            'bounce_rate',
            'conversion_rate',
        ],
        'refresh_interval' => env('ANALYTICS_DEFAULT_REFRESH_INTERVAL', 30000),
        'export_format' => env('ANALYTICS_DEFAULT_EXPORT_FORMAT', 'csv'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Feature Flags
    |--------------------------------------------------------------------------
    |
    | Flags de funcionalidades
    |
    */
    'features' => [
        'ai_insights' => env('ANALYTICS_AI_INSIGHTS_ENABLED', true),
        'predictive_analytics' => env('ANALYTICS_PREDICTIVE_ENABLED', false),
        'anomaly_detection' => env('ANALYTICS_ANOMALY_DETECTION_ENABLED', true),
        'custom_dashboards' => env('ANALYTICS_CUSTOM_DASHBOARDS_ENABLED', true),
        'scheduled_reports' => env('ANALYTICS_SCHEDULED_REPORTS_ENABLED', true),
        'data_export' => env('ANALYTICS_DATA_EXPORT_ENABLED', true),
        'real_time_updates' => env('ANALYTICS_REAL_TIME_ENABLED', true),
    ],
];