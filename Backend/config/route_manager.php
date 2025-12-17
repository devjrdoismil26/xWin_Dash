<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Route Manager Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for the Route Manager system
    |
    */

    'enabled' => env('ROUTE_MANAGER_ENABLED', true),

    'cache' => [
        'enabled' => env('ROUTE_MANAGER_CACHE_ENABLED', true),
        'duration' => env('ROUTE_MANAGER_CACHE_DURATION', 60), // minutes
        'key' => env('ROUTE_MANAGER_CACHE_KEY', 'route_manager_cache'),
    ],

    'performance' => [
        'lazy_loading' => env('ROUTE_MANAGER_LAZY_LOADING', true),
        'conditional_loading' => env('ROUTE_MANAGER_CONDITIONAL_LOADING', true),
        'priority_loading' => env('ROUTE_MANAGER_PRIORITY_LOADING', true),
    ],

    'monitoring' => [
        'enabled' => env('ROUTE_MANAGER_MONITORING_ENABLED', true),
        'log_loading' => env('ROUTE_MANAGER_LOG_LOADING', false),
        'health_check' => env('ROUTE_MANAGER_HEALTH_CHECK', true),
    ],

    'modules' => [
        'auto_discover' => env('ROUTE_MANAGER_AUTO_DISCOVER', true),
        'validate_files' => env('ROUTE_MANAGER_VALIDATE_FILES', true),
        'fallback_loading' => env('ROUTE_MANAGER_FALLBACK_LOADING', true),
    ],
];