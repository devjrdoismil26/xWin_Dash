<?php

return [
    
    /*
    |--------------------------------------------------------------------------
    | PyLab Configuration
    |--------------------------------------------------------------------------
    |
    | Configurações para integração com PyLab
    | Laboratório de IA avançada
    |
    */

    'url' => env('PYLAB_URL', 'http://localhost:8000'),
    
    'timeout' => env('PYLAB_TIMEOUT', 300), // 5 minutos
    
    'retry_attempts' => env('PYLAB_RETRY_ATTEMPTS', 3),
    
    'retry_delay' => env('PYLAB_RETRY_DELAY', 1000), // milissegundos
    
    'cache_ttl' => env('PYLAB_CACHE_TTL', 3600), // 1 hora
    
    /*
    |--------------------------------------------------------------------------
    | Authentication
    |--------------------------------------------------------------------------
    |
    | Configurações de autenticação com PyLab (se necessário)
    |
    */
    
    'auth' => [
        'enabled' => env('PYLAB_AUTH_ENABLED', false),
        'token' => env('PYLAB_AUTH_TOKEN'),
        'username' => env('PYLAB_AUTH_USERNAME'),
        'password' => env('PYLAB_AUTH_PASSWORD'),
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Models Configuration
    |--------------------------------------------------------------------------
    |
    | Configurações dos modelos disponíveis no PyLab
    |
    */
    
    'models' => [
        'image_generation' => [
            'default' => 'Stable Diffusion XL',
            'available' => [
                'Stable Diffusion XL',
                'Stable Diffusion 2.1',
                'Stable Diffusion 1.5'
            ]
        ],
        
        'video_generation' => [
            'default' => 'ModelScope T2V',
            'available' => [
                'ModelScope T2V',
                'RunwayML Gen-2',
                'Pika Labs'
            ]
        ],
        
        'text_analysis' => [
            'default' => 'GPT-4',
            'available' => [
                'GPT-4',
                'GPT-3.5-turbo',
                'Claude-3',
                'Gemini Pro'
            ]
        ],
        
        'image_analysis' => [
            'default' => 'CLIP + BLIP',
            'available' => [
                'CLIP + BLIP',
                'GPT-4 Vision',
                'Claude-3 Vision'
            ]
        ],
        
        'code_generation' => [
            'default' => 'CodeT5 + GPT-4',
            'available' => [
                'CodeT5 + GPT-4',
                'StarCoder',
                'CodeLlama',
                'GPT-4'
            ]
        ]
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Generation Limits
    |--------------------------------------------------------------------------
    |
    | Limites para gerações via PyLab
    |
    */
    
    'limits' => [
        'image' => [
            'max_width' => 2048,
            'max_height' => 2048,
            'max_steps' => 100,
            'max_batch_size' => 4,
            'max_prompt_length' => 1000
        ],
        
        'video' => [
            'max_duration' => 30, // segundos
            'max_fps' => 60,
            'max_prompt_length' => 1000,
            'supported_qualities' => ['hd', 'full_hd', '4k']
        ],
        
        'text_analysis' => [
            'max_text_length' => 50000,
            'max_batch_size' => 10
        ],
        
        'image_analysis' => [
            'max_file_size' => 10 * 1024 * 1024, // 10MB
            'supported_formats' => ['jpg', 'jpeg', 'png', 'webp']
        ],
        
        'code_generation' => [
            'max_code_length' => 10000,
            'max_description_length' => 2000
        ]
    ],
    
    /*
    |--------------------------------------------------------------------------
    | File Storage
    |--------------------------------------------------------------------------
    |
    | Configurações de armazenamento de arquivos gerados
    |
    */
    
    'storage' => [
        'disk' => env('PYLAB_STORAGE_DISK', 'public'),
        'path' => env('PYLAB_STORAGE_PATH', 'pylab/generated'),
        'retention_days' => env('PYLAB_RETENTION_DAYS', 30),
        'cleanup_enabled' => env('PYLAB_CLEANUP_ENABLED', true)
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Monitoring & Logging
    |--------------------------------------------------------------------------
    |
    | Configurações de monitoramento e logging
    |
    */
    
    'monitoring' => [
        'enabled' => env('PYLAB_MONITORING_ENABLED', true),
        'log_requests' => env('PYLAB_LOG_REQUESTS', true),
        'log_responses' => env('PYLAB_LOG_RESPONSES', false),
        'metrics_enabled' => env('PYLAB_METRICS_ENABLED', true)
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Rate Limiting
    |--------------------------------------------------------------------------
    |
    | Configurações de rate limiting
    |
    */
    
    'rate_limiting' => [
        'enabled' => env('PYLAB_RATE_LIMITING_ENABLED', true),
        'max_requests_per_minute' => env('PYLAB_MAX_REQUESTS_PER_MINUTE', 60),
        'max_requests_per_hour' => env('PYLAB_MAX_REQUESTS_PER_HOUR', 1000),
        'max_requests_per_day' => env('PYLAB_MAX_REQUESTS_PER_DAY', 10000)
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Webhooks
    |--------------------------------------------------------------------------
    |
    | Configurações de webhooks para notificações
    |
    */
    
    'webhooks' => [
        'enabled' => env('PYLAB_WEBHOOKS_ENABLED', false),
        'secret' => env('PYLAB_WEBHOOK_SECRET'),
        'url' => env('PYLAB_WEBHOOK_URL'),
        'events' => [
            'generation_completed',
            'generation_failed',
            'generation_cancelled'
        ]
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Development
    |--------------------------------------------------------------------------
    |
    | Configurações para desenvolvimento
    |
    */
    
    'development' => [
        'mock_responses' => env('PYLAB_MOCK_RESPONSES', false),
        'debug_mode' => env('PYLAB_DEBUG_MODE', false),
        'test_mode' => env('PYLAB_TEST_MODE', false)
    ]
    
];