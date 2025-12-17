<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Module Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for module loading and optimization
    |
    */

    'core' => [
        'enabled' => env('MODULE_CORE_ENABLED', true),
        'load_views' => env('MODULE_CORE_LOAD_VIEWS', false),
        'load_migrations' => env('MODULE_CORE_LOAD_MIGRATIONS', false),
    ],

    'workflows' => [
        'enabled' => env('MODULE_WORKFLOWS_ENABLED', true),
        'load_views' => env('MODULE_WORKFLOWS_LOAD_VIEWS', false),
        'load_migrations' => env('MODULE_WORKFLOWS_LOAD_MIGRATIONS', false),
    ],

    'universe' => [
        'enabled' => env('MODULE_UNIVERSE_ENABLED', true),
        'load_views' => env('MODULE_UNIVERSE_LOAD_VIEWS', false),
        'load_migrations' => env('MODULE_UNIVERSE_LOAD_MIGRATIONS', false),
        'load_api_routes' => env('MODULE_UNIVERSE_LOAD_API_ROUTES', true),
        'load_web_routes' => env('MODULE_UNIVERSE_LOAD_WEB_ROUTES', false),
        'load_observers' => env('MODULE_UNIVERSE_LOAD_OBSERVERS', true),
    ],

    'activity' => [
        'enabled' => env('MODULE_ACTIVITY_ENABLED', true),
        'load_views' => env('MODULE_ACTIVITY_LOAD_VIEWS', false),
        'load_migrations' => env('MODULE_ACTIVITY_LOAD_MIGRATIONS', false),
    ],

    'analytics' => [
        'enabled' => env('MODULE_ANALYTICS_ENABLED', true),
        'load_views' => env('MODULE_ANALYTICS_LOAD_VIEWS', false),
        'load_migrations' => env('MODULE_ANALYTICS_LOAD_MIGRATIONS', false),
    ],

    'email_marketing' => [
        'enabled' => env('MODULE_EMAIL_MARKETING_ENABLED', true),
        'load_views' => env('MODULE_EMAIL_MARKETING_LOAD_VIEWS', false),
        'load_migrations' => env('MODULE_EMAIL_MARKETING_LOAD_MIGRATIONS', false),
    ],

    'ai' => [
        'enabled' => env('MODULE_AI_ENABLED', true),
        'load_views' => env('MODULE_AI_LOAD_VIEWS', false),
        'load_migrations' => env('MODULE_AI_LOAD_MIGRATIONS', false),
    ],

    'adstool' => [
        'enabled' => env('MODULE_ADSTOOL_ENABLED', true),
        'load_views' => env('MODULE_ADSTOOL_LOAD_VIEWS', false),
        'load_migrations' => env('MODULE_ADSTOOL_LOAD_MIGRATIONS', false),
    ],

    'aura' => [
        'enabled' => env('MODULE_AURA_ENABLED', true),
        'load_views' => env('MODULE_AURA_LOAD_VIEWS', false),
        'load_migrations' => env('MODULE_AURA_LOAD_MIGRATIONS', false),
    ],

    'leads' => [
        'enabled' => env('MODULE_LEADS_ENABLED', true),
        'load_views' => env('MODULE_LEADS_LOAD_VIEWS', false),
        'load_migrations' => env('MODULE_LEADS_LOAD_MIGRATIONS', false),
    ],

    'media' => [
        'enabled' => env('MODULE_MEDIA_ENABLED', true),
        'load_views' => env('MODULE_MEDIA_LOAD_VIEWS', false),
        'load_migrations' => env('MODULE_MEDIA_LOAD_MIGRATIONS', false),
    ],

    'nodered' => [
        'enabled' => env('MODULE_NODERED_ENABLED', true),
        'load_views' => env('MODULE_NODERED_LOAD_VIEWS', false),
        'load_migrations' => env('MODULE_NODERED_LOAD_MIGRATIONS', false),
    ],

    'products' => [
        'enabled' => env('MODULE_PRODUCTS_ENABLED', true),
        'load_views' => env('MODULE_PRODUCTS_LOAD_VIEWS', false),
        'load_migrations' => env('MODULE_PRODUCTS_LOAD_MIGRATIONS', false),
    ],

    'projects' => [
        'enabled' => env('MODULE_PROJECTS_ENABLED', true),
        'load_views' => env('MODULE_PROJECTS_LOAD_VIEWS', false),
        'load_migrations' => env('MODULE_PROJECTS_LOAD_MIGRATIONS', false),
    ],

    'social_buffer' => [
        'enabled' => env('MODULE_SOCIAL_BUFFER_ENABLED', true),
        'load_views' => env('MODULE_SOCIAL_BUFFER_LOAD_VIEWS', false),
        'load_migrations' => env('MODULE_SOCIAL_BUFFER_LOAD_MIGRATIONS', false),
    ],

    'users' => [
        'enabled' => env('MODULE_USERS_ENABLED', true),
        'load_views' => env('MODULE_USERS_LOAD_VIEWS', false),
        'load_migrations' => env('MODULE_USERS_LOAD_MIGRATIONS', false),
    ],

    'categorization' => [
        'enabled' => env('MODULE_CATEGORIZATION_ENABLED', true),
        'load_views' => env('MODULE_CATEGORIZATION_LOAD_VIEWS', false),
        'load_migrations' => env('MODULE_CATEGORIZATION_LOAD_MIGRATIONS', false),
    ],
];