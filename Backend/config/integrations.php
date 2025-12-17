<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Integration Providers Configuration
    |--------------------------------------------------------------------------
    |
    | This file controls which integration providers are enabled and their
    | specific configurations for conditional loading.
    |
    */

    'enabled' => env('INTEGRATIONS_ENABLED', true),
    
    'core' => [
        'enabled' => env('INTEGRATION_CORE_ENABLED', true),
        'rate_limiting' => env('INTEGRATION_RATE_LIMITING_ENABLED', true),
        'circuit_breaker' => env('INTEGRATION_CIRCUIT_BREAKER_ENABLED', true),
        'retry_mechanism' => env('INTEGRATION_RETRY_MECHANISM_ENABLED', true),
    ],

    'social_media' => [
        'enabled' => env('INTEGRATION_SOCIAL_MEDIA_ENABLED', true),
        'twitter' => env('INTEGRATION_TWITTER_ENABLED', true),
        'facebook' => env('INTEGRATION_FACEBOOK_ENABLED', true),
        'instagram' => env('INTEGRATION_INSTAGRAM_ENABLED', true),
        'linkedin' => env('INTEGRATION_LINKEDIN_ENABLED', true),
        'tiktok' => env('INTEGRATION_TIKTOK_ENABLED', true),
    ],

    'payment' => [
        'enabled' => env('INTEGRATION_PAYMENT_ENABLED', true),
        'stripe' => env('INTEGRATION_STRIPE_ENABLED', true),
        'paypal' => env('INTEGRATION_PAYPAL_ENABLED', true),
        'pagseguro' => env('INTEGRATION_PAGSEGURO_ENABLED', true),
        'mercadopago' => env('INTEGRATION_MERCADOPAGO_ENABLED', true),
    ],

    'communication' => [
        'enabled' => env('INTEGRATION_COMMUNICATION_ENABLED', true),
        'whatsapp' => env('INTEGRATION_WHATSAPP_ENABLED', true),
        'telegram' => env('INTEGRATION_TELEGRAM_ENABLED', true),
        'email' => env('INTEGRATION_EMAIL_ENABLED', true),
        'sms' => env('INTEGRATION_SMS_ENABLED', true),
    ],

    'analytics' => [
        'enabled' => env('INTEGRATION_ANALYTICS_ENABLED', true),
        'google_analytics' => env('INTEGRATION_GOOGLE_ANALYTICS_ENABLED', true),
        'facebook_pixel' => env('INTEGRATION_FACEBOOK_PIXEL_ENABLED', true),
        'mixpanel' => env('INTEGRATION_MIXPANEL_ENABLED', true),
        'hotjar' => env('INTEGRATION_HOTJAR_ENABLED', true),
    ],

    'storage' => [
        'enabled' => env('INTEGRATION_STORAGE_ENABLED', true),
        'aws_s3' => env('INTEGRATION_AWS_S3_ENABLED', true),
        'google_cloud' => env('INTEGRATION_GOOGLE_CLOUD_ENABLED', true),
        'azure_blob' => env('INTEGRATION_AZURE_BLOB_ENABLED', true),
        'cloudinary' => env('INTEGRATION_CLOUDINARY_ENABLED', true),
        'dropbox' => env('INTEGRATION_DROPBOX_ENABLED', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | Performance Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for performance optimization of integration providers.
    |
    */

    'performance' => [
        'cache_enabled' => env('INTEGRATION_CACHE_ENABLED', true),
        'cache_duration' => env('INTEGRATION_CACHE_DURATION', 3600),
        'lazy_loading' => env('INTEGRATION_LAZY_LOADING', true),
        'deferred_loading' => env('INTEGRATION_DEFERRED_LOADING', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | Monitoring Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for monitoring integration providers.
    |
    */

    'monitoring' => [
        'enabled' => env('INTEGRATION_MONITORING_ENABLED', true),
        'log_requests' => env('INTEGRATION_LOG_REQUESTS', true),
        'log_responses' => env('INTEGRATION_LOG_RESPONSES', false),
        'log_errors' => env('INTEGRATION_LOG_ERRORS', true),
        'metrics_enabled' => env('INTEGRATION_METRICS_ENABLED', true),
    ],
];