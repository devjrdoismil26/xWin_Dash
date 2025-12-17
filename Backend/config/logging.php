<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default Log Channel
    |--------------------------------------------------------------------------
    |
    | This option defines the default log channel that gets used when writing
    | messages to the logs. The name specified in this option should match
    | one of the channels defined in the "channels" configuration array.
    |
    */

    'default' => env('LOG_CHANNEL', 'stack'),

    /*
    |--------------------------------------------------------------------------
    | Deprecations Log Channel
    |--------------------------------------------------------------------------
    |
    | This option controls the log channel that should be used to log warnings
    | regarding deprecated PHP and library features. This allows you to get
    | your application ready for upcoming major versions of dependencies.
    |
    */

    'deprecations' => [
        'channel' => env('LOG_DEPRECATIONS_CHANNEL', 'null'),
        'trace' => env('LOG_DEPRECATIONS_TRACE', false),
    ],

    /*
    |--------------------------------------------------------------------------
    | Log Channels
    |--------------------------------------------------------------------------
    |
    | Here you may configure the log channels for your application. Out of
    | the box, Laravel uses the Monolog PHP logging library. This gives
    | you a variety of powerful log handlers / formatters to utilize.
    |
    | Available Drivers: "single", "daily", "slack", "syslog",
    |                    "errorlog", "monolog",
    |                    "custom", "stack"
    |
    */

    'channels' => [
        'stack' => [
            'driver' => 'stack',
            'channels' => explode(',', env('LOG_STACK_CHANNELS', 'daily')),
            'ignore_exceptions' => false,
        ],

        'single' => [
            'driver' => 'single',
            'path' => storage_path('logs/laravel.log'),
            'level' => env('LOG_LEVEL', 'debug'),
            'replace_placeholders' => true,
        ],

        'daily' => [
            'driver' => 'daily',
            'path' => storage_path('logs/laravel.log'),
            'level' => env('LOG_LEVEL', 'debug'),
            'days' => env('LOG_DAILY_DAYS', 14),
            'replace_placeholders' => true,
        ],

        'slack' => [
            'driver' => 'slack',
            'url' => env('LOG_SLACK_WEBHOOK_URL'),
            'username' => env('LOG_SLACK_USERNAME', 'xWin Dash Log'),
            'emoji' => env('LOG_SLACK_EMOJI', ':boom:'),
            'level' => env('LOG_SLACK_LEVEL', 'critical'),
            'replace_placeholders' => true,
        ],

        'papertrail' => [
            'driver' => 'monolog',
            'level' => env('LOG_PAPERTRAIL_LEVEL', 'debug'),
            'handler' => env('LOG_PAPERTRAIL_HANDLER', Monolog\Handler\SyslogUdpHandler::class),
            'handler_with' => [
                'host' => env('PAPERTRAIL_URL'),
                'port' => env('PAPERTRAIL_PORT'),
                'connectionString' => 'tls://' . env('PAPERTRAIL_URL') . ':' . env('PAPERTRAIL_PORT'),
            ],
            'processors' => [
                Monolog\Processor\PsrLogMessageProcessor::class,
            ],
        ],

        'stderr' => [
            'driver' => 'monolog',
            'level' => env('LOG_STDERR_LEVEL', 'debug'),
            'handler' => Monolog\Handler\StreamHandler::class,
            'formatter' => env('LOG_STDERR_FORMATTER'),
            'with' => [
                'stream' => 'php://stderr',
            ],
            'processors' => [
                Monolog\Processor\PsrLogMessageProcessor::class,
            ],
        ],

        'syslog' => [
            'driver' => 'syslog',
            'level' => env('LOG_SYSLOG_LEVEL', 'debug'),
            'facility' => env('LOG_SYSLOG_FACILITY', LOG_USER),
            'replace_placeholders' => true,
        ],

        'errorlog' => [
            'driver' => 'errorlog',
            'level' => env('LOG_ERRORLOG_LEVEL', 'debug'),
            'replace_placeholders' => true,
        ],

        'newrelic' => [
            'driver' => 'monolog',
            'level' => env('LOG_NEWRELIC_LEVEL', 'debug'),
            'handler' => Monolog\Handler\NewRelicHandler::class,
            'formatter' => Monolog\Formatter\NormalizerFormatter::class,
        ],

        'cloudwatch' => [
            'driver' => 'custom',
            'via' => \App\Logging\CreateCloudWatchLogDriver::class,
            'sdk' => [
                'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
                'version' => 'latest',
                'credentials' => [
                    'key' => env('AWS_ACCESS_KEY_ID'),
                    'secret' => env('AWS_SECRET_ACCESS_KEY'),
                ],
            ],
            'retention' => env('CLOUDWATCH_LOG_RETENTION', 14),
            'group' => env('CLOUDWATCH_LOG_GROUP', 'xwin-dash'),
            'stream' => env('CLOUDWATCH_LOG_STREAM', '{instance}'),
            'level' => env('CLOUDWATCH_LOG_LEVEL', 'info'),
        ],

        'workflows' => [
            'driver' => 'daily',
            'path' => storage_path('logs/workflows.log'),
            'level' => env('LOG_WORKFLOWS_LEVEL', 'debug'),
            'days' => env('LOG_WORKFLOWS_DAYS', 7),
            'replace_placeholders' => true,
        ],

        'emails' => [
            'driver' => 'daily',
            'path' => storage_path('logs/emails.log'),
            'level' => env('LOG_EMAILS_LEVEL', 'debug'),
            'days' => env('LOG_EMAILS_DAYS', 7),
            'replace_placeholders' => true,
        ],

        'whatsapp' => [
            'driver' => 'daily',
            'path' => storage_path('logs/whatsapp.log'),
            'level' => env('LOG_WHATSAPP_LEVEL', 'debug'),
            'days' => env('LOG_WHATSAPP_DAYS', 7),
            'replace_placeholders' => true,
        ],

        'ai' => [
            'driver' => 'daily',
            'path' => storage_path('logs/ai.log'),
            'level' => env('LOG_AI_LEVEL', 'debug'),
            'days' => env('LOG_AI_DAYS', 7),
            'replace_placeholders' => true,
        ],

        'security' => [
            'driver' => 'daily',
            'path' => storage_path('logs/security.log'),
            'level' => env('LOG_SECURITY_LEVEL', 'info'),
            'days' => env('LOG_SECURITY_DAYS', 30),
            'replace_placeholders' => true,
        ],

        'audit' => [
            'driver' => 'daily',
            'path' => storage_path('logs/audit.log'),
            'level' => 'info',
            'days' => 30,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Log Monitoring
    |--------------------------------------------------------------------------
    |
    | Here you may configure settings for monitoring logs and alerting.
    |
    */

    'monitoring' => [
        'enabled' => env('LOG_MONITORING_ENABLED', true),
        'alert_channels' => explode(',', env('LOG_MONITORING_ALERT_CHANNELS', 'slack,email')),
        'alert_level' => env('LOG_MONITORING_ALERT_LEVEL', 'error'),
        'alert_email' => env('LOG_MONITORING_ALERT_EMAIL', env('ADMIN_EMAIL')),
    ],
];
