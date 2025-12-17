<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cache Optimization Configuration
    |--------------------------------------------------------------------------
    |
    | This file controls cache optimization settings for better performance.
    |
    */

    'enabled' => env('CACHE_OPTIMIZATION_ENABLED', true),

    'drivers' => [
        'file' => [
            'enabled' => env('CACHE_FILE_ENABLED', true),
            'path' => storage_path('framework/cache/data'),
            'compression' => env('CACHE_FILE_COMPRESSION', true),
            'serialization' => env('CACHE_FILE_SERIALIZATION', 'php'),
        ],
        
        'redis' => [
            'enabled' => env('CACHE_REDIS_ENABLED', false),
            'connection' => env('CACHE_REDIS_CONNECTION', 'default'),
            'compression' => env('CACHE_REDIS_COMPRESSION', true),
            'serialization' => env('CACHE_REDIS_SERIALIZATION', 'json'),
        ],
        
        'database' => [
            'enabled' => env('CACHE_DATABASE_ENABLED', false),
            'table' => env('CACHE_DATABASE_TABLE', 'cache'),
            'connection' => env('CACHE_DATABASE_CONNECTION', 'default'),
        ],
    ],

    'performance' => [
        'default_ttl' => env('CACHE_DEFAULT_TTL', 3600),
        'max_memory' => env('CACHE_MAX_MEMORY', '128M'),
        'gc_probability' => env('CACHE_GC_PROBABILITY', 1),
        'gc_divisor' => env('CACHE_GC_DIVISOR', 100),
        'lazy_loading' => env('CACHE_LAZY_LOADING', true),
        'preload' => env('CACHE_PRELOAD', false),
    ],

    'monitoring' => [
        'enabled' => env('CACHE_MONITORING_ENABLED', true),
        'log_hits' => env('CACHE_LOG_HITS', false),
        'log_misses' => env('CACHE_LOG_MISSES', true),
        'log_writes' => env('CACHE_LOG_WRITES', false),
        'metrics_enabled' => env('CACHE_METRICS_ENABLED', true),
    ],

    'tags' => [
        'enabled' => env('CACHE_TAGS_ENABLED', true),
        'default_tags' => ['app', 'laravel'],
        'auto_tagging' => env('CACHE_AUTO_TAGGING', true),
    ],
];