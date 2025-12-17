<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Domain Providers Configuration
    |--------------------------------------------------------------------------
    |
    | This file controls which domain providers are enabled and their
    | specific configurations for conditional loading.
    |
    */

    'enabled' => env('DOMAINS_ENABLED', true),
    
    'core' => [
        'enabled' => env('DOMAINS_CORE_ENABLED', true),
        'domains' => [
            'Core',
            'Users',
            'Auth',
        ],
        'auto_discovery' => env('DOMAINS_CORE_AUTO_DISCOVERY', true),
    ],

    'business' => [
        'enabled' => env('DOMAINS_BUSINESS_ENABLED', true),
        'domains' => [
            'Projects',
            'Products',
            'Leads',
            'Categorization',
        ],
        'auto_discovery' => env('DOMAINS_BUSINESS_AUTO_DISCOVERY', true),
    ],

    'integration' => [
        'enabled' => env('DOMAINS_INTEGRATION_ENABLED', true),
        'domains' => [
            'AI',
            'SocialBuffer',
            'Aura',
            'NodeRed',
            'ADStool',
        ],
        'auto_discovery' => env('DOMAINS_INTEGRATION_AUTO_DISCOVERY', true),
    ],

    'utility' => [
        'enabled' => env('DOMAINS_UTILITY_ENABLED', true),
        'domains' => [
            'Analytics',
            'EmailMarketing',
            'Activity',
            'Media',
        ],
        'auto_discovery' => env('DOMAINS_UTILITY_AUTO_DISCOVERY', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | Performance Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for performance optimization of domain providers.
    |
    */

    'performance' => [
        'cache_enabled' => env('DOMAINS_CACHE_ENABLED', true),
        'cache_duration' => env('DOMAINS_CACHE_DURATION', 3600),
        'lazy_loading' => env('DOMAINS_LAZY_LOADING', true),
        'deferred_loading' => env('DOMAINS_DEFERRED_LOADING', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | Monitoring Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for monitoring domain providers.
    |
    */

    'monitoring' => [
        'enabled' => env('DOMAINS_MONITORING_ENABLED', true),
        'log_registration' => env('DOMAINS_LOG_REGISTRATION', true),
        'log_boot' => env('DOMAINS_LOG_BOOT', false),
        'metrics_enabled' => env('DOMAINS_METRICS_ENABLED', true),
    ],
];