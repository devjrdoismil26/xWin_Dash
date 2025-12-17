<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Features Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains configuration for all features in the application,
    | including the new ADStool and SocialBuffer features.
    |
    */

    'adstool' => [
        'enabled' => env('ADSTOOL_ENABLED', true),
        'platforms' => [
            'google' => [
                'enabled' => env('ADSTOOL_GOOGLE_ENABLED', true),
                'api_version' => 'v13',
                'developer_token' => env('GOOGLE_ADS_DEVELOPER_TOKEN'),
                'client_id' => env('GOOGLE_ADS_CLIENT_ID'),
                'client_secret' => env('GOOGLE_ADS_CLIENT_SECRET'),
                'refresh_token' => env('GOOGLE_ADS_REFRESH_TOKEN'),
            ],
            'facebook' => [
                'enabled' => env('ADSTOOL_FACEBOOK_ENABLED', true),
                'api_version' => 'v18.0',
                'app_id' => env('FACEBOOK_ADS_APP_ID'),
                'app_secret' => env('FACEBOOK_ADS_APP_SECRET'),
                'access_token' => env('FACEBOOK_ADS_ACCESS_TOKEN'),
            ],
            'instagram' => [
                'enabled' => env('ADSTOOL_INSTAGRAM_ENABLED', true),
                'api_version' => 'v18.0',
                'app_id' => env('INSTAGRAM_ADS_APP_ID'),
                'app_secret' => env('INSTAGRAM_ADS_APP_SECRET'),
                'access_token' => env('INSTAGRAM_ADS_ACCESS_TOKEN'),
            ],
        ],
        'sync' => [
            'interval_minutes' => env('ADSTOOL_SYNC_INTERVAL', 60),
            'batch_size' => env('ADSTOOL_SYNC_BATCH_SIZE', 50),
            'retry_attempts' => env('ADSTOOL_SYNC_RETRY_ATTEMPTS', 3),
        ],
        'budget_alerts' => [
            'thresholds' => [50, 75, 90, 95], // Percentage thresholds
            'notification_channels' => ['email', 'webhook', 'workflow'],
        ],
        'reporting' => [
            'default_metrics' => [
                'impressions',
                'clicks',
                'cost',
                'ctr',
                'cpc',
                'conversions',
                'conversion_rate',
                'roas',
            ],
            'export_formats' => ['pdf', 'excel', 'csv'],
        ],
    ],

    'socialbuffer' => [
        'enabled' => env('SOCIALBUFFER_ENABLED', true),
        'platforms' => [
            'facebook' => [
                'enabled' => env('SOCIALBUFFER_FACEBOOK_ENABLED', true),
                'api_version' => 'v18.0',
                'app_id' => env('FACEBOOK_APP_ID'),
                'app_secret' => env('FACEBOOK_APP_SECRET'),
                'max_text_length' => 63206,
                'supports_scheduling' => true,
                'supports_media' => true,
                'optimal_times' => ['09:00', '13:00', '15:00'],
            ],
            'instagram' => [
                'enabled' => env('SOCIALBUFFER_INSTAGRAM_ENABLED', true),
                'api_version' => 'v18.0',
                'app_id' => env('INSTAGRAM_APP_ID'),
                'app_secret' => env('INSTAGRAM_APP_SECRET'),
                'max_text_length' => 2200,
                'supports_scheduling' => true,
                'supports_media' => true,
                'optimal_times' => ['11:00', '14:00', '17:00'],
            ],
            'twitter' => [
                'enabled' => env('SOCIALBUFFER_TWITTER_ENABLED', true),
                'api_version' => 'v2',
                'bearer_token' => env('TWITTER_BEARER_TOKEN'),
                'api_key' => env('TWITTER_API_KEY'),
                'api_secret' => env('TWITTER_API_SECRET'),
                'max_text_length' => 280,
                'supports_scheduling' => false,
                'supports_media' => true,
                'optimal_times' => ['08:00', '12:00', '17:00', '19:00'],
            ],
            'linkedin' => [
                'enabled' => env('SOCIALBUFFER_LINKEDIN_ENABLED', true),
                'api_version' => 'v2',
                'client_id' => env('LINKEDIN_CLIENT_ID'),
                'client_secret' => env('LINKEDIN_CLIENT_SECRET'),
                'max_text_length' => 3000,
                'supports_scheduling' => false,
                'supports_media' => true,
                'optimal_times' => ['08:00', '12:00', '17:00'],
            ],
        ],
        'scheduling' => [
            'max_future_days' => env('SOCIALBUFFER_MAX_FUTURE_DAYS', 365),
            'batch_processing_size' => env('SOCIALBUFFER_BATCH_SIZE', 100),
            'retry_attempts' => env('SOCIALBUFFER_RETRY_ATTEMPTS', 3),
            'retry_delay_minutes' => env('SOCIALBUFFER_RETRY_DELAY', 15),
        ],
        'content_generation' => [
            'enabled' => env('SOCIALBUFFER_AI_ENABLED', true),
            'provider' => env('SOCIALBUFFER_AI_PROVIDER', 'openai'),
            'api_key' => env('OPENAI_API_KEY'),
            'model' => env('SOCIALBUFFER_AI_MODEL', 'gpt-3.5-turbo'),
            'max_tokens' => env('SOCIALBUFFER_AI_MAX_TOKENS', 500),
        ],
        'analytics' => [
            'sync_interval_hours' => env('SOCIALBUFFER_ANALYTICS_SYNC_INTERVAL', 6),
            'retention_days' => env('SOCIALBUFFER_ANALYTICS_RETENTION_DAYS', 365),
            'metrics' => [
                'engagement',
                'reach',
                'impressions',
                'clicks',
                'likes',
                'comments',
                'shares',
                'saves',
            ],
        ],
    ],

    'workflows' => [
        'enabled' => env('WORKFLOWS_ENABLED', true),
        'execution' => [
            'timeout_seconds' => env('WORKFLOW_TIMEOUT', 300),
            'max_retries' => env('WORKFLOW_MAX_RETRIES', 3),
            'retry_delay_seconds' => env('WORKFLOW_RETRY_DELAY', 60),
        ],
        'logging' => [
            'enabled' => env('WORKFLOW_LOGGING_ENABLED', true),
            'retention_days' => env('WORKFLOW_LOG_RETENTION_DAYS', 30),
            'detailed_logging' => env('WORKFLOW_DETAILED_LOGGING', false),
        ],
        'triggers' => [
            'webhook_timeout_seconds' => env('WORKFLOW_WEBHOOK_TIMEOUT', 30),
            'schedule_precision_minutes' => env('WORKFLOW_SCHEDULE_PRECISION', 1),
        ],
        'integrations' => [
            'adstool' => [
                'enabled' => true,
                'auto_trigger_events' => [
                    'campaign_created',
                    'campaign_performance_updated',
                    'campaign_budget_alert',
                ],
            ],
            'socialbuffer' => [
                'enabled' => true,
                'auto_trigger_events' => [
                    'post_scheduled',
                    'post_published',
                    'post_engagement_threshold',
                    'optimal_time_reached',
                ],
            ],
        ],
    ],

    'nodered' => [
        'enabled' => env('NODERED_ENABLED', true),
        'url' => env('NODERED_URL', 'http://localhost:1880'),
        'admin_auth' => [
            'type' => env('NODERED_AUTH_TYPE', 'credentials'),
            'users' => [
                [
                    'username' => env('NODERED_ADMIN_USERNAME', 'admin'),
                    'password' => env('NODERED_ADMIN_PASSWORD_HASH'),
                    'permissions' => '*',
                ],
            ],
        ],
        'integration' => [
            'webhook_base_url' => env('APP_URL') . '/api/workflows/trigger',
            'api_endpoints' => [
                'adstool' => env('APP_URL') . '/api/adstool',
                'socialbuffer' => env('APP_URL') . '/api/socialbuffer',
                'workflows' => env('APP_URL') . '/api/workflows',
            ],
        ],
        'custom_nodes' => [
            'adstool-nodes' => [
                'enabled' => true,
                'version' => '1.0.0',
                'nodes' => [
                    'campaign-trigger',
                    'campaign-action',
                    'budget-condition',
                    'performance-condition',
                ],
            ],
            'socialbuffer-nodes' => [
                'enabled' => true,
                'version' => '1.0.0',
                'nodes' => [
                    'post-trigger',
                    'schedule-action',
                    'publish-action',
                    'content-generator',
                    'platform-condition',
                ],
            ],
        ],
    ],

    'permissions' => [
        'adstool' => [
            'view_campaigns' => 'View campaigns',
            'create_campaigns' => 'Create campaigns',
            'edit_campaigns' => 'Edit campaigns',
            'delete_campaigns' => 'Delete campaigns',
            'manage_budgets' => 'Manage campaign budgets',
            'view_reports' => 'View campaign reports',
            'sync_data' => 'Sync campaign data',
        ],
        'socialbuffer' => [
            'view_posts' => 'View posts',
            'create_posts' => 'Create posts',
            'edit_posts' => 'Edit posts',
            'delete_posts' => 'Delete posts',
            'schedule_posts' => 'Schedule posts',
            'publish_posts' => 'Publish posts',
            'manage_social_accounts' => 'Manage social accounts',
            'view_analytics' => 'View post analytics',
            'generate_content' => 'Generate AI content',
        ],
        'workflows' => [
            'view_workflows' => 'View workflows',
            'create_workflows' => 'Create workflows',
            'edit_workflows' => 'Edit workflows',
            'delete_workflows' => 'Delete workflows',
            'execute_workflows' => 'Execute workflows',
            'view_logs' => 'View workflow logs',
        ],
    ],

    'rate_limits' => [
        'adstool' => [
            'api_calls_per_minute' => env('ADSTOOL_RATE_LIMIT', 60),
            'sync_operations_per_hour' => env('ADSTOOL_SYNC_RATE_LIMIT', 100),
        ],
        'socialbuffer' => [
            'posts_per_hour' => env('SOCIALBUFFER_POST_RATE_LIMIT', 50),
            'content_generation_per_hour' => env('SOCIALBUFFER_AI_RATE_LIMIT', 20),
            'api_calls_per_minute' => env('SOCIALBUFFER_API_RATE_LIMIT', 100),
        ],
        'workflows' => [
            'executions_per_minute' => env('WORKFLOW_EXECUTION_RATE_LIMIT', 30),
            'triggers_per_minute' => env('WORKFLOW_TRIGGER_RATE_LIMIT', 100),
        ],
    ],

    'monitoring' => [
        'health_checks' => [
            'adstool' => [
                'enabled' => true,
                'interval_minutes' => 5,
                'endpoints' => [
                    'google_ads_api',
                    'facebook_ads_api',
                ],
            ],
            'socialbuffer' => [
                'enabled' => true,
                'interval_minutes' => 5,
                'endpoints' => [
                    'facebook_api',
                    'instagram_api',
                    'twitter_api',
                    'linkedin_api',
                ],
            ],
            'workflows' => [
                'enabled' => true,
                'interval_minutes' => 2,
                'check_execution_queue' => true,
            ],
        ],
        'alerts' => [
            'channels' => ['email', 'slack', 'webhook'],
            'thresholds' => [
                'error_rate_percentage' => 5,
                'response_time_ms' => 5000,
                'queue_size' => 1000,
            ],
        ],
    ],
];
