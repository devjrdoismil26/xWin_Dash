<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Activity Log Configuration
    |--------------------------------------------------------------------------
    |
    | Configurações para o módulo de logs de atividade
    |
    */

    'enabled' => env('ACTIVITY_ENABLED', true),

    /*
    |--------------------------------------------------------------------------
    | Cache Configuration
    |--------------------------------------------------------------------------
    |
    | Configurações de cache para otimização de performance
    |
    */

    'cache' => [
        'enabled' => env('ACTIVITY_CACHE_ENABLED', true),
        'ttl' => env('ACTIVITY_CACHE_TTL', 300), // 5 minutos
        'max_size' => env('ACTIVITY_CACHE_MAX_SIZE', 1000),
        'prefix' => 'activity_logs_',
    ],

    /*
    |--------------------------------------------------------------------------
    | Pagination Configuration
    |--------------------------------------------------------------------------
    |
    | Configurações de paginação
    |
    */

    'pagination' => [
        'default_per_page' => env('ACTIVITY_DEFAULT_PER_PAGE', 15),
        'max_per_page' => env('ACTIVITY_MAX_PER_PAGE', 100),
        'available_sizes' => [10, 15, 25, 50, 100],
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
        'enabled' => env('ACTIVITY_EXPORT_ENABLED', true),
        'max_size' => env('ACTIVITY_EXPORT_MAX_SIZE', 10000),
        'formats' => ['csv', 'json', 'pdf'],
        'default_format' => 'csv',
    ],

    /*
    |--------------------------------------------------------------------------
    | Real-time Configuration
    |--------------------------------------------------------------------------
    |
    | Configurações para atualizações em tempo real
    |
    */

    'realtime' => [
        'enabled' => env('ACTIVITY_REALTIME_ENABLED', true),
        'interval' => env('ACTIVITY_REALTIME_INTERVAL', 30000), // 30 segundos
        'max_updates' => env('ACTIVITY_REALTIME_MAX_UPDATES', 50),
    ],

    /*
    |--------------------------------------------------------------------------
    | Cleanup Configuration
    |--------------------------------------------------------------------------
    |
    | Configurações para limpeza automática de logs antigos
    |
    */

    'cleanup' => [
        'enabled' => env('ACTIVITY_CLEANUP_ENABLED', true),
        'default_days' => env('ACTIVITY_CLEANUP_DEFAULT_DAYS', 30),
        'max_days' => env('ACTIVITY_CLEANUP_MAX_DAYS', 365),
        'schedule' => env('ACTIVITY_CLEANUP_SCHEDULE', 'daily'),
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
        'log_sensitive_data' => env('ACTIVITY_LOG_SENSITIVE_DATA', false),
        'mask_fields' => [
            'password',
            'password_confirmation',
            'token',
            'secret',
            'key',
            'api_key',
        ],
        'rate_limit' => [
            'enabled' => env('ACTIVITY_RATE_LIMIT_ENABLED', true),
            'max_requests' => env('ACTIVITY_RATE_LIMIT_MAX', 100),
            'per_minutes' => env('ACTIVITY_RATE_LIMIT_MINUTES', 1),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Log Types Configuration
    |--------------------------------------------------------------------------
    |
    | Configurações para tipos de log
    |
    */

    'log_types' => [
        'user' => [
            'login',
            'logout',
            'register',
            'password_reset',
            'profile_update',
        ],
        'system' => [
            'startup',
            'shutdown',
            'maintenance',
            'backup',
            'restore',
        ],
        'security' => [
            'failed_login',
            'suspicious_activity',
            'permission_denied',
            'access_granted',
            'access_revoked',
        ],
        'api' => [
            'request',
            'response',
            'error',
            'rate_limit_exceeded',
        ],
        'crud' => [
            'create',
            'read',
            'update',
            'delete',
            'bulk_operation',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Performance Configuration
    |--------------------------------------------------------------------------
    |
    | Configurações de performance
    |
    */

    'performance' => [
        'batch_size' => env('ACTIVITY_BATCH_SIZE', 1000),
        'chunk_size' => env('ACTIVITY_CHUNK_SIZE', 100),
        'memory_limit' => env('ACTIVITY_MEMORY_LIMIT', '256M'),
        'time_limit' => env('ACTIVITY_TIME_LIMIT', 300), // 5 minutos
    ],

    /*
    |--------------------------------------------------------------------------
    | Database Configuration
    |--------------------------------------------------------------------------
    |
    | Configurações específicas do banco de dados
    |
    */

    'database' => [
        'connection' => env('ACTIVITY_DB_CONNECTION', 'mysql'),
        'table' => env('ACTIVITY_DB_TABLE', 'activity_logs'),
        'indexes' => [
            'created_at',
            'log_name',
            'causer_type',
            'causer_id',
            'subject_type',
            'subject_id',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Monitoring Configuration
    |--------------------------------------------------------------------------
    |
    | Configurações de monitoramento
    |
    */

    'monitoring' => [
        'enabled' => env('ACTIVITY_MONITORING_ENABLED', true),
        'metrics' => [
            'total_logs',
            'logs_per_minute',
            'error_rate',
            'response_time',
            'cache_hit_rate',
        ],
        'alerts' => [
            'error_threshold' => env('ACTIVITY_ERROR_THRESHOLD', 10),
            'response_time_threshold' => env('ACTIVITY_RESPONSE_TIME_THRESHOLD', 1000), // ms
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Integration Configuration
    |--------------------------------------------------------------------------
    |
    | Configurações de integração com outros módulos
    |
    */

    'integrations' => [
        'users' => [
            'enabled' => true,
            'track_profile_changes' => true,
            'track_login_attempts' => true,
        ],
        'projects' => [
            'enabled' => true,
            'track_project_changes' => true,
            'track_member_changes' => true,
        ],
        'leads' => [
            'enabled' => true,
            'track_lead_changes' => true,
            'track_conversion_events' => true,
        ],
        'products' => [
            'enabled' => true,
            'track_product_changes' => true,
            'track_inventory_changes' => true,
        ],
    ],
];