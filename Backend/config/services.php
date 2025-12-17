<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
        'scheme' => 'https',
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'sendgrid' => [
        'api_key' => env('SENDGRID_API_KEY'),
    ],

    'aws' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect' => env('GOOGLE_REDIRECT_URI', '/oauth/google/callback'),
    ],

    // AI Services Configuration
    'openai' => [
        'api_key' => env('OPENAI_API_KEY'),
        'base_url' => env('OPENAI_BASE_URL', 'https://api.openai.com/v1'),
        'organization' => env('OPENAI_ORGANIZATION'),
        'model' => env('OPENAI_MODEL', 'gpt-3.5-turbo'),
        'moderation_endpoint' => env('OPENAI_MODERATION_ENDPOINT', 'https://api.openai.com/v1/moderations'),
    ],

    'anthropic' => [
        'api_key' => env('ANTHROPIC_API_KEY'),
        'base_url' => env('ANTHROPIC_BASE_URL', 'https://api.anthropic.com/v1'),
    ],

    'gemini' => [
        'api_key' => env('GEMINI_API_KEY'),
        // Usar AI Studio API em vez de GCP API
        'base_url' => env('GEMINI_BASE_URL', 'https://generativelanguage.googleapis.com/v1beta'),
        'model' => env('GEMINI_MODEL', 'gemini-1.5-pro'),
        'max_tokens' => env('GEMINI_MAX_TOKENS', 8192),
        'temperature' => env('GEMINI_TEMPERATURE', 0.7),
        'top_p' => env('GEMINI_TOP_P', 0.95),
        'top_k' => env('GEMINI_TOP_K', 40),
        'cache_ttl' => env('GEMINI_CACHE_TTL', 3600),
        // Configurações específicas para Veo2
        'video_generation' => [
            'enabled' => env('GEMINI_VIDEO_ENABLED', true),
            'max_duration' => env('GEMINI_VIDEO_MAX_DURATION', 60),
            'default_quality' => env('GEMINI_VIDEO_QUALITY', 'hd'),
            'supported_formats' => ['mp4', 'webm'],
        ],
        'image_generation' => [
            'enabled' => env('GEMINI_IMAGE_ENABLED', true),
            'max_resolution' => env('GEMINI_IMAGE_MAX_RESOLUTION', 2048),
            'default_quality' => env('GEMINI_IMAGE_QUALITY', 'hd'),
        ],
    ],

    'facebook' => [
        'client_id' => env('FACEBOOK_CLIENT_ID'),
        'client_secret' => env('FACEBOOK_CLIENT_SECRET'),
        'access_token' => env('FACEBOOK_ACCESS_TOKEN'),
        'base_url' => env('FACEBOOK_BASE_URL', 'https://graph.facebook.com/v18.0'),
        'redirect' => env('FACEBOOK_REDIRECT_URI', '/oauth/facebook/callback'),
    ],

    'twitter' => [
        'client_id' => env('TWITTER_CLIENT_ID'),
        'client_secret' => env('TWITTER_CLIENT_SECRET'),
        'bearer_token' => env('TWITTER_BEARER_TOKEN'),
        'consumer_key' => env('TWITTER_CONSUMER_KEY'),
        'consumer_secret' => env('TWITTER_CONSUMER_SECRET'),
        'base_url' => env('TWITTER_BASE_URL', 'https://api.twitter.com/2'),
        'redirect' => env('TWITTER_REDIRECT_URI', '/oauth/twitter/callback'),
    ],

    'instagram' => [
        'client_id' => env('INSTAGRAM_CLIENT_ID'),
        'client_secret' => env('INSTAGRAM_CLIENT_SECRET'),
        'access_token' => env('INSTAGRAM_ACCESS_TOKEN'),
        'base_url' => env('INSTAGRAM_BASE_URL', 'https://graph.instagram.com/v18.0'),
        'redirect' => env('INSTAGRAM_REDIRECT_URI', '/oauth/instagram/callback'),
    ],

    'linkedin' => [
        'client_id' => env('LINKEDIN_CLIENT_ID'),
        'client_secret' => env('LINKEDIN_CLIENT_SECRET'),
        'base_url' => env('LINKEDIN_BASE_URL', 'https://api.linkedin.com/v2'),
        'redirect' => env('LINKEDIN_REDIRECT_URI', '/oauth/linkedin/callback'),
    ],

    'pinterest' => [
        'client_id' => env('PINTEREST_CLIENT_ID'),
        'client_secret' => env('PINTEREST_CLIENT_SECRET'),
        'access_token' => env('PINTEREST_ACCESS_TOKEN'),
        'base_url' => env('PINTEREST_BASE_URL', 'https://api.pinterest.com/v5'),
        'redirect' => env('PINTEREST_REDIRECT_URI', '/oauth/pinterest/callback'),
    ],

    'tiktok' => [
        'client_id' => env('TIKTOK_CLIENT_ID'),
        'client_secret' => env('TIKTOK_CLIENT_SECRET'),
        'access_token' => env('TIKTOK_ACCESS_TOKEN'),
        'base_url' => env('TIKTOK_BASE_URL', 'https://open-api.tiktok.com'),
        'redirect' => env('TIKTOK_REDIRECT_URI', '/oauth/tiktok/callback'),
    ],

    'whatsapp' => [
        'provider' => env('WHATSAPP_PROVIDER', 'meta'), // meta, twilio, etc.
        'api_url' => env('WHATSAPP_API_URL', 'https://graph.facebook.com/v18.0'),
        'access_token' => env('WHATSAPP_ACCESS_TOKEN', ''),
        'phone_number_id' => env('WHATSAPP_CLOUD_API_PHONE_NUMBER_ID'),
        'third_party_api' => [
            'base_url' => env('WHATSAPP_THIRD_PARTY_API_BASE_URL', 'https://api.provedorwhatsapp.com'),
        ],
        'meta' => [
            'app_id' => env('WHATSAPP_META_APP_ID'),
            'app_secret' => env('WHATSAPP_META_APP_SECRET'),
            'access_token' => env('WHATSAPP_META_ACCESS_TOKEN'),
            'base_url' => env('WHATSAPP_META_BASE_URL', 'https://graph.facebook.com/v18.0'),
            'phone_number_id' => env('WHATSAPP_META_PHONE_NUMBER_ID'),
            'business_account_id' => env('WHATSAPP_META_BUSINESS_ACCOUNT_ID'),
            'webhook_verify_token' => env('WHATSAPP_META_WEBHOOK_VERIFY_TOKEN'),
            'webhook_url' => env('WHATSAPP_META_WEBHOOK_URL'),
        ],
        'twilio' => [
            'account_sid' => env('WHATSAPP_TWILIO_ACCOUNT_SID'),
            'auth_token' => env('WHATSAPP_TWILIO_AUTH_TOKEN'),
            'from' => env('WHATSAPP_TWILIO_FROM'),
        ],
        'rate_limits' => [
            'messages_per_minute' => env('WHATSAPP_RATE_LIMIT_MESSAGES_PER_MINUTE', 60),
            'messages_per_day' => env('WHATSAPP_RATE_LIMIT_MESSAGES_PER_DAY', 1000),
        ],
    ],

    'analytics' => [
        'provider' => env('ANALYTICS_PROVIDER', 'internal'), // internal, google, mixpanel, etc.
        'google' => [
            'tracking_id' => env('ANALYTICS_GOOGLE_TRACKING_ID'),
            'view_id' => env('ANALYTICS_GOOGLE_VIEW_ID'),
            'service_account_credentials_json' => env('ANALYTICS_GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_JSON'),
        ],
        'mixpanel' => [
            'token' => env('ANALYTICS_MIXPANEL_TOKEN'),
        ],
    ],

    'sms' => [
        'provider' => env('SMS_PROVIDER', 'twilio'), // twilio, vonage, etc.
        'twilio' => [
            'account_sid' => env('SMS_TWILIO_ACCOUNT_SID', env('WHATSAPP_TWILIO_ACCOUNT_SID')),
            'auth_token' => env('SMS_TWILIO_AUTH_TOKEN', env('WHATSAPP_TWILIO_AUTH_TOKEN')),
            'from' => env('SMS_TWILIO_FROM'),
        ],
        'vonage' => [
            'key' => env('SMS_VONAGE_KEY'),
            'secret' => env('SMS_VONAGE_SECRET'),
            'from' => env('SMS_VONAGE_FROM'),
        ],
    ],

    'payment' => [
        'provider' => env('PAYMENT_PROVIDER', 'stripe'), // stripe, paypal, etc.
        'stripe' => [
            'key' => env('PAYMENT_STRIPE_KEY'),
            'secret' => env('PAYMENT_STRIPE_SECRET'),
            'webhook_secret' => env('PAYMENT_STRIPE_WEBHOOK_SECRET'),
        ],
        'paypal' => [
            'client_id' => env('PAYMENT_PAYPAL_CLIENT_ID'),
            'secret' => env('PAYMENT_PAYPAL_SECRET'),
            'environment' => env('PAYMENT_PAYPAL_ENVIRONMENT', 'sandbox'), // sandbox, production
        ],
    ],

    'monitoring' => [
        'provider' => env('MONITORING_PROVIDER', 'newrelic'), // newrelic, datadog, etc.
        'newrelic' => [
            'license_key' => env('MONITORING_NEWRELIC_LICENSE_KEY'),
            'app_name' => env('MONITORING_NEWRELIC_APP_NAME', env('APP_NAME')),
        ],
        'datadog' => [
            'api_key' => env('MONITORING_DATADOG_API_KEY'),
            'app_key' => env('MONITORING_DATADOG_APP_KEY'),
        ],
    ],

    'nodered' => [
        'webhook_url' => env('NODERED_WEBHOOK_URL'),
        'webhook_token' => env('NODERED_WEBHOOK_TOKEN'),
    ],

    // removed duplicate openai block (merged into the one above)

    'google_ads' => [
        'developer_token' => env('GOOGLE_ADS_DEVELOPER_TOKEN'),
        'client_id' => env('GOOGLE_ADS_CLIENT_ID'),
        'client_secret' => env('GOOGLE_ADS_CLIENT_SECRET'),
        'refresh_token' => env('GOOGLE_ADS_REFRESH_TOKEN'),
        'customer_id' => env('GOOGLE_ADS_CUSTOMER_ID'),
    ],

    'facebook_ads' => [
        'app_id' => env('FACEBOOK_ADS_APP_ID'),
        'app_secret' => env('FACEBOOK_ADS_APP_SECRET'),
        'access_token' => env('FACEBOOK_ADS_ACCESS_TOKEN'),
    ],

    // 🤖 PyLab AI Laboratory Configuration
    'pylab' => [
        'url' => env('PYLAB_SERVICE_URL', 'http://ai_service:8000'),
        'timeout' => env('PYLAB_TIMEOUT', 300), // 5 minutes timeout
        'storage_driver' => env('PYLAB_STORAGE_DRIVER', 'public'),
        'max_concurrent_tasks' => env('PYLAB_MAX_CONCURRENT_TASKS', 3),
        'health_check_interval' => env('PYLAB_HEALTH_CHECK_INTERVAL', 30), // seconds
        'retry_attempts' => env('PYLAB_RETRY_ATTEMPTS', 3),
        'cleanup_old_tasks_after' => env('PYLAB_CLEANUP_OLD_TASKS_AFTER', 24), // hours
    ],

    // 💬 Chat Lab Configuration
    'chat_lab' => [
        'base_url' => env('CHAT_LAB_BASE_URL', 'http://localhost:8000'),
        'timeout' => env('CHAT_LAB_TIMEOUT', 30),
        'api_key' => env('CHAT_LAB_API_KEY', ''),
    ],
];
