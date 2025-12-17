<?php

return [
    /*
    |--------------------------------------------------------------------------
    | AI Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for AI services including providers, rate limits,
    | content filtering, and security settings.
    |
    */

    /*
    |--------------------------------------------------------------------------
    | Default AI Provider
    |--------------------------------------------------------------------------
    */
    'default_provider' => env('AI_DEFAULT_PROVIDER', 'openai'),

    /*
    |--------------------------------------------------------------------------
    | AI Providers Configuration
    |--------------------------------------------------------------------------
    */
    'providers' => [
        'openai' => [
            'enabled' => env('AI_OPENAI_ENABLED', true),
            'api_key' => env('OPENAI_API_KEY'),
            'model' => env('AI_OPENAI_MODEL', 'gpt-4'),
            'max_tokens' => env('AI_OPENAI_MAX_TOKENS', 2000),
            'temperature' => env('AI_OPENAI_TEMPERATURE', 0.7),
            'timeout' => env('AI_OPENAI_TIMEOUT', 60),
        ],
        'gemini' => [
            'enabled' => env('AI_GEMINI_ENABLED', true),
            'api_key' => env('GEMINI_API_KEY'),
            'model' => env('AI_GEMINI_MODEL', 'gemini-1.5-pro'),
            'max_tokens' => env('AI_GEMINI_MAX_TOKENS', 8192),
            'temperature' => env('AI_GEMINI_TEMPERATURE', 0.7),
            'timeout' => env('AI_GEMINI_TIMEOUT', 60),
        ],
        'anthropic' => [
            'enabled' => env('AI_ANTHROPIC_ENABLED', false),
            'api_key' => env('ANTHROPIC_API_KEY'),
            'model' => env('AI_ANTHROPIC_MODEL', 'claude-3-sonnet-20240229'),
            'max_tokens' => env('AI_ANTHROPIC_MAX_TOKENS', 2000),
            'temperature' => env('AI_ANTHROPIC_TEMPERATURE', 0.6),
            'timeout' => env('AI_ANTHROPIC_TIMEOUT', 60),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Rate Limiting
    |--------------------------------------------------------------------------
    */
    'rate_limits' => [
        'requests_per_minute' => env('AI_RATE_LIMIT_PER_MINUTE', 60),
        'requests_per_hour' => env('AI_RATE_LIMIT_PER_HOUR', 1000),
        'requests_per_day' => env('AI_RATE_LIMIT_PER_DAY', 10000),
        'tokens_per_minute' => env('AI_TOKEN_LIMIT_PER_MINUTE', 100000),
        'tokens_per_hour' => env('AI_TOKEN_LIMIT_PER_HOUR', 1000000),
    ],

    /*
    |--------------------------------------------------------------------------
    | Content Filtering
    |--------------------------------------------------------------------------
    */
    'content_filtering' => [
        'enabled' => env('AI_CONTENT_FILTERING_ENABLED', true),
        'strict_mode' => env('AI_CONTENT_FILTERING_STRICT', false),
        'forbidden_keywords' => [
            // Conteúdo violento
            'violência', 'violencia', 'matar', 'assassinar', 'tortura',

            // Conteúdo sexual/adulto
            'pornografia', 'sexo explícito', 'nudez',

            // Drogas e substâncias
            'drogas', 'cocaína', 'heroína', 'maconha', 'cannabis',

            // Atividades ilegais
            'roubo', 'furto', 'fraude', 'golpe', 'phishing',

            // Spam e marketing agressivo
            'compre agora', 'oferta imperdível', 'ganhe dinheiro fácil',

            // Conteúdo discriminatório
            'racismo', 'homofobia', 'xenofobia', 'discriminação',

            // Informações médicas perigosas
            'automedicação', 'diagnóstico médico', 'receita médica',
        ],
        'forbidden_categories' => [
            'violence',
            'adult_content',
            'illegal_activities',
            'spam',
            'discrimination',
            'medical_advice',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Security Settings
    |--------------------------------------------------------------------------
    */
    'security' => [
        'log_all_requests' => env('AI_LOG_ALL_REQUESTS', true),
        'encrypt_prompts' => env('AI_ENCRYPT_PROMPTS', false),
        'sanitize_input' => env('AI_SANITIZE_INPUT', true),
        'validate_output' => env('AI_VALIDATE_OUTPUT', true),
        'max_prompt_length' => env('AI_MAX_PROMPT_LENGTH', 10000),
        'max_response_length' => env('AI_MAX_RESPONSE_LENGTH', 20000),
    ],

    /*
    |--------------------------------------------------------------------------
    | Caching
    |--------------------------------------------------------------------------
    */
    'cache' => [
        'enabled' => env('AI_CACHE_ENABLED', true),
        'ttl' => env('AI_CACHE_TTL', 3600), // 1 hour
        'store' => env('AI_CACHE_STORE', 'redis'),
        'prefix' => env('AI_CACHE_PREFIX', 'ai_responses'),
        'hash_prompts' => env('AI_CACHE_HASH_PROMPTS', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | Queue Configuration
    |--------------------------------------------------------------------------
    */
    'queue' => [
        'enabled' => env('AI_QUEUE_ENABLED', true),
        'connection' => env('AI_QUEUE_CONNECTION', 'redis'),
        'queue_name' => env('AI_QUEUE_NAME', 'ai'),
        'timeout' => env('AI_QUEUE_TIMEOUT', 300),
        'retry_attempts' => env('AI_QUEUE_RETRY_ATTEMPTS', 3),
        'retry_delay' => env('AI_QUEUE_RETRY_DELAY', 60),
    ],

    /*
    |--------------------------------------------------------------------------
    | Monitoring and Analytics
    |--------------------------------------------------------------------------
    */
    'monitoring' => [
        'enabled' => env('AI_MONITORING_ENABLED', true),
        'track_usage' => env('AI_TRACK_USAGE', true),
        'track_costs' => env('AI_TRACK_COSTS', true),
        'track_performance' => env('AI_TRACK_PERFORMANCE', true),
        'alert_on_errors' => env('AI_ALERT_ON_ERRORS', true),
        'alert_on_rate_limit' => env('AI_ALERT_ON_RATE_LIMIT', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | Features Configuration
    |--------------------------------------------------------------------------
    */
    'features' => [
        'content_generation' => env('AI_FEATURE_CONTENT_GENERATION', true),
        'text_analysis' => env('AI_FEATURE_TEXT_ANALYSIS', true),
        'translation' => env('AI_FEATURE_TRANSLATION', true),
        'summarization' => env('AI_FEATURE_SUMMARIZATION', true),
        'sentiment_analysis' => env('AI_FEATURE_SENTIMENT_ANALYSIS', true),
        'image_generation' => env('AI_FEATURE_IMAGE_GENERATION', false),
        'voice_synthesis' => env('AI_FEATURE_VOICE_SYNTHESIS', false),
    ],

    /*
    |--------------------------------------------------------------------------
    | Cost Management
    |--------------------------------------------------------------------------
    */
    'cost_management' => [
        'enabled' => env('AI_COST_MANAGEMENT_ENABLED', true),
        'daily_budget' => env('AI_DAILY_BUDGET', 100.00),
        'monthly_budget' => env('AI_MONTHLY_BUDGET', 2000.00),
        'cost_per_token' => [
            'openai' => [
                'gpt-4' => 0.00003, // $0.03 per 1K tokens
                'gpt-3.5-turbo' => 0.000002, // $0.002 per 1K tokens
            ],
            'gemini' => [
                'gemini-1.5-pro' => 0.000035, // $0.035 per 1K tokens
            ],
        ],
        'alert_thresholds' => [
            'daily_percentage' => 80,
            'monthly_percentage' => 90,
        ],
    ],
];
