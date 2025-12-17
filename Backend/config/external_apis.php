<?php

return [
    /*
    |--------------------------------------------------------------------------
    | External APIs Configuration
    |--------------------------------------------------------------------------
    |
    | Configurações para todas as APIs externas integradas no sistema
    |
    */

    'rate_limiting' => [
        'enabled' => env('RATE_LIMITING_ENABLED', true),
        'cache_driver' => env('RATE_LIMITING_CACHE_DRIVER', 'redis'),
        'default_limits' => [
            'calls_per_hour' => 100,
            'calls_per_day' => 1000,
            'burst_limit' => 5,
            'burst_window' => 60,
        ],
    ],

    'circuit_breaker' => [
        'enabled' => env('CIRCUIT_BREAKER_ENABLED', true),
        'default_config' => [
            'failure_threshold' => 5,
            'timeout' => 60,
            'half_open_max_calls' => 3,
        ],
    ],

    'retry' => [
        'enabled' => env('RETRY_ENABLED', true),
        'default_config' => [
            'max_attempts' => 3,
            'base_delay' => 1000,
            'max_delay' => 10000,
            'backoff_multiplier' => 2,
            'jitter' => true,
        ],
    ],

    'platforms' => [
        'facebook' => [
            'base_url' => 'https://graph.facebook.com/v18.0',
            'rate_limits' => [
                'calls_per_hour' => 200,
                'calls_per_day' => 4800,
                'burst_limit' => 10,
                'burst_window' => 60,
            ],
            'circuit_breaker' => [
                'failure_threshold' => 5,
                'timeout' => 60,
                'half_open_max_calls' => 3,
            ],
            'retry' => [
                'max_attempts' => 3,
                'base_delay' => 1000,
                'max_delay' => 10000,
                'backoff_multiplier' => 2,
                'jitter' => true,
            ],
        ],

        'google' => [
            'base_url' => 'https://googleads.googleapis.com/v14',
            'rate_limits' => [
                'calls_per_minute' => 100,
                'calls_per_day' => 10000,
                'burst_limit' => 20,
                'burst_window' => 60,
            ],
            'circuit_breaker' => [
                'failure_threshold' => 5,
                'timeout' => 60,
                'half_open_max_calls' => 3,
            ],
            'retry' => [
                'max_attempts' => 3,
                'base_delay' => 1000,
                'max_delay' => 10000,
                'backoff_multiplier' => 2,
                'jitter' => true,
            ],
        ],

        'twitter' => [
            'base_url' => 'https://api.twitter.com/2',
            'rate_limits' => [
                'calls_per_15min' => 300,
                'calls_per_day' => 1500,
                'burst_limit' => 15,
                'burst_window' => 60,
            ],
            'circuit_breaker' => [
                'failure_threshold' => 3,
                'timeout' => 120,
                'half_open_max_calls' => 2,
            ],
            'retry' => [
                'max_attempts' => 2,
                'base_delay' => 2000,
                'max_delay' => 15000,
                'backoff_multiplier' => 3,
                'jitter' => true,
            ],
        ],

        'linkedin' => [
            'base_url' => 'https://api.linkedin.com/v2',
            'rate_limits' => [
                'calls_per_day' => 100,
                'burst_limit' => 5,
                'burst_window' => 60,
            ],
            'circuit_breaker' => [
                'failure_threshold' => 3,
                'timeout' => 120,
                'half_open_max_calls' => 2,
            ],
            'retry' => [
                'max_attempts' => 2,
                'base_delay' => 2000,
                'max_delay' => 15000,
                'backoff_multiplier' => 3,
                'jitter' => true,
            ],
        ],

        'tiktok' => [
            'base_url' => 'https://business-api.tiktok.com/open_api/v1.3',
            'rate_limits' => [
                'calls_per_day' => 1000,
                'burst_limit' => 10,
                'burst_window' => 60,
            ],
            'circuit_breaker' => [
                'failure_threshold' => 3,
                'timeout' => 120,
                'half_open_max_calls' => 2,
            ],
            'retry' => [
                'max_attempts' => 2,
                'base_delay' => 2000,
                'max_delay' => 15000,
                'backoff_multiplier' => 3,
                'jitter' => true,
            ],
        ],

        'whatsapp' => [
            'base_url' => 'https://graph.facebook.com/v18.0',
            'rate_limits' => [
                'messages_per_day' => 1000,
                'burst_limit' => 5,
                'burst_window' => 60,
            ],
            'circuit_breaker' => [
                'failure_threshold' => 5,
                'timeout' => 60,
                'half_open_max_calls' => 3,
            ],
            'retry' => [
                'max_attempts' => 3,
                'base_delay' => 1000,
                'max_delay' => 10000,
                'backoff_multiplier' => 2,
                'jitter' => true,
            ],
        ],

        'openai' => [
            'base_url' => 'https://api.openai.com/v1',
            'rate_limits' => [
                'calls_per_minute' => 3500,
                'tokens_per_minute' => 90000,
                'burst_limit' => 50,
                'burst_window' => 60,
            ],
            'circuit_breaker' => [
                'failure_threshold' => 5,
                'timeout' => 60,
                'half_open_max_calls' => 3,
            ],
            'retry' => [
                'max_attempts' => 3,
                'base_delay' => 1000,
                'max_delay' => 10000,
                'backoff_multiplier' => 2,
                'jitter' => true,
            ],
        ],

        'claude' => [
            'base_url' => 'https://api.anthropic.com/v1',
            'rate_limits' => [
                'calls_per_minute' => 1000,
                'tokens_per_minute' => 40000,
                'burst_limit' => 20,
                'burst_window' => 60,
            ],
            'circuit_breaker' => [
                'failure_threshold' => 5,
                'timeout' => 60,
                'half_open_max_calls' => 3,
            ],
            'retry' => [
                'max_attempts' => 3,
                'base_delay' => 1000,
                'max_delay' => 10000,
                'backoff_multiplier' => 2,
                'jitter' => true,
            ],
        ],

        'gemini' => [
            'base_url' => 'https://generativelanguage.googleapis.com/v1beta',
            'rate_limits' => [
                'calls_per_minute' => 60,
                'tokens_per_minute' => 32000,
                'burst_limit' => 10,
                'burst_window' => 60,
            ],
            'circuit_breaker' => [
                'failure_threshold' => 5,
                'timeout' => 60,
                'half_open_max_calls' => 3,
            ],
            'retry' => [
                'max_attempts' => 3,
                'base_delay' => 1000,
                'max_delay' => 10000,
                'backoff_multiplier' => 2,
                'jitter' => true,
            ],
        ],
    ],

    'analytics' => [
        'enabled' => env('ANALYTICS_ENABLED', true),
        'cache_duration' => env('ANALYTICS_CACHE_DURATION', 3600), // 1 hora
        'real_time_cache_duration' => env('ANALYTICS_REALTIME_CACHE_DURATION', 300), // 5 minutos
        'historical_days' => env('ANALYTICS_HISTORICAL_DAYS', 90),
    ],

    'content_scheduling' => [
        'enabled' => env('CONTENT_SCHEDULING_ENABLED', true),
        'queue_connection' => env('CONTENT_SCHEDULING_QUEUE', 'default'),
        'max_posts_per_day' => env('CONTENT_SCHEDULING_MAX_POSTS_PER_DAY', 10),
        'min_interval_hours' => env('CONTENT_SCHEDULING_MIN_INTERVAL_HOURS', 1),
        'optimal_times' => [
            'facebook' => [
                'best_days' => ['tuesday', 'wednesday', 'thursday'],
                'best_hours' => [9, 10, 11, 13, 14, 15, 16],
                'timezone' => 'America/Sao_Paulo'
            ],
            'instagram' => [
                'best_days' => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
                'best_hours' => [11, 12, 13, 14, 15, 16, 17],
                'timezone' => 'America/Sao_Paulo'
            ],
            'twitter' => [
                'best_days' => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
                'best_hours' => [9, 10, 11, 12, 13, 14, 15, 16, 17],
                'timezone' => 'America/Sao_Paulo'
            ],
            'linkedin' => [
                'best_days' => ['tuesday', 'wednesday', 'thursday'],
                'best_hours' => [8, 9, 10, 11, 12, 13, 14, 15, 16],
                'timezone' => 'America/Sao_Paulo'
            ],
            'tiktok' => [
                'best_days' => ['tuesday', 'thursday', 'friday'],
                'best_hours' => [6, 7, 8, 9, 10, 19, 20, 21, 22],
                'timezone' => 'America/Sao_Paulo'
            ],
            'youtube' => [
                'best_days' => ['friday', 'saturday', 'sunday'],
                'best_hours' => [14, 15, 16, 17, 18, 19, 20, 21],
                'timezone' => 'America/Sao_Paulo'
            ]
        ]
    ],

    'function_calling' => [
        'enabled' => env('FUNCTION_CALLING_ENABLED', true),
        'max_functions_per_request' => env('FUNCTION_CALLING_MAX_FUNCTIONS', 10),
        'timeout' => env('FUNCTION_CALLING_TIMEOUT', 30),
    ],

    'monitoring' => [
        'enabled' => env('EXTERNAL_API_MONITORING_ENABLED', true),
        'log_level' => env('EXTERNAL_API_LOG_LEVEL', 'info'),
        'alert_thresholds' => [
            'error_rate' => 0.1, // 10%
            'response_time' => 5000, // 5 segundos
            'circuit_breaker_open' => true,
        ],
    ],
];