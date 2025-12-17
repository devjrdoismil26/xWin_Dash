<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default Mailer
    |--------------------------------------------------------------------------
    |
    | This option controls the default mailer that is used to send any email
    | messages sent by your application. Alternative mailers may be setup
    | and used as needed; however, this mailer will be used by default.
    |
    */

    'default' => env('MAIL_MAILER', 'smtp'),

    /*
    |--------------------------------------------------------------------------
    | Mailer Configurations
    |--------------------------------------------------------------------------
    |
    | Here you may configure all of the mailers used by your application plus
    | their respective settings. Several examples have been configured for
    | you and you are free to add your own as your application requires.
    |
    | Laravel supports a variety of mail "transport" drivers to be used while
    | sending an e-mail. You will specify which one you are using for your
    | mailers below. You are free to add additional mailers as required.
    |
    | Supported: "smtp", "sendmail", "mailgun", "ses", "ses-v2",
    |            "postmark", "log", "array", "failover"
    |
    */

    'mailers' => [
        'smtp' => [
            'transport' => 'smtp',
            'url' => env('MAIL_URL'),
            'host' => env('MAIL_HOST', 'smtp.mailgun.org'),
            'port' => env('MAIL_PORT', 587),
            'encryption' => env('MAIL_ENCRYPTION', 'tls'),
            'username' => env('MAIL_USERNAME'),
            'password' => env('MAIL_PASSWORD'),
            'timeout' => env('MAIL_TIMEOUT', 30),
            'local_domain' => env('MAIL_EHLO_DOMAIN'),
        ],

        'ses' => [
            'transport' => 'ses',
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
            'options' => [
                'ConfigurationSetName' => env('SES_CONFIGURATION_SET'),
                'EmailTags' => [
                    ['Name' => 'source', 'Value' => 'xwin-dash'],
                ],
            ],
        ],

        'mailgun' => [
            'transport' => 'mailgun',
            'domain' => env('MAILGUN_DOMAIN'),
            'secret' => env('MAILGUN_SECRET'),
            'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
            'scheme' => 'https',
        ],

        'postmark' => [
            'transport' => 'postmark',
            'message_stream_id' => env('POSTMARK_MESSAGE_STREAM_ID'),
            'token' => env('POSTMARK_TOKEN'),
        ],

        'sendgrid' => [
            'transport' => 'sendgrid',
            'api_key' => env('SENDGRID_API_KEY'),
        ],

        'log' => [
            'transport' => 'log',
            'channel' => env('MAIL_LOG_CHANNEL'),
        ],

        'array' => [
            'transport' => 'array',
        ],

        'failover' => [
            'transport' => 'failover',
            'mailers' => [
                'smtp',
                'ses',
                'mailgun',
                'postmark',
                'sendgrid',
                'log',
            ],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Global "From" Address
    |--------------------------------------------------------------------------
    |
    | You may wish for all e-mails sent by your application to be sent from
    | the same address. Here, you may specify a name and address that is
    | used globally for all e-mails that are sent by your application.
    |
    */

    'from' => [
        'address' => env('MAIL_FROM_ADDRESS', 'hello@example.com'),
        'name' => env('MAIL_FROM_NAME', 'Example'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Markdown Mail Settings
    |--------------------------------------------------------------------------
    |
    | If you are using Markdown based email rendering, you may configure your
    | theme and component paths here, allowing you to customize the design
    | of the emails. Or, you may simply stick with the Laravel defaults!
    |
    */

    'markdown' => [
        'theme' => 'default',
        'paths' => [
            resource_path('views/vendor/mail'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Email Marketing Settings
    |--------------------------------------------------------------------------
    |
    | Configuration specific to email marketing functionality in xWin Dash.
    |
    */

    'marketing' => [
        'batch_size' => env('EMAIL_MARKETING_BATCH_SIZE', 100),
        'throttle_seconds' => env('EMAIL_MARKETING_THROTTLE_SECONDS', 60),
        'max_per_hour' => env('EMAIL_MARKETING_MAX_PER_HOUR', 1000),
        'max_per_day' => env('EMAIL_MARKETING_MAX_PER_DAY', 5000),
        'track_opens' => env('EMAIL_MARKETING_TRACK_OPENS', true),
        'track_clicks' => env('EMAIL_MARKETING_TRACK_CLICKS', true),
        'unsubscribe_handling' => env('EMAIL_MARKETING_UNSUBSCRIBE_HANDLING', true),
        'bounce_handling' => env('EMAIL_MARKETING_BOUNCE_HANDLING', true),
        'complaint_handling' => env('EMAIL_MARKETING_COMPLAINT_HANDLING', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | Email Templates
    |--------------------------------------------------------------------------
    |
    | Configuration for email templates used in the application.
    |
    */

    'templates' => [
        'path' => env('EMAIL_TEMPLATES_PATH', resource_path('views/emails/templates')),
        'cache_enabled' => env('EMAIL_TEMPLATES_CACHE_ENABLED', true),
        'cache_ttl' => env('EMAIL_TEMPLATES_CACHE_TTL', 3600), // seconds
    ],

    /*
    |--------------------------------------------------------------------------
    | Email Testing
    |--------------------------------------------------------------------------
    |
    | Configuration for email testing functionality.
    |
    */

    'testing' => [
        'enabled' => env('EMAIL_TESTING_ENABLED', env('APP_ENV') !== 'production'),
        'forward_to' => env('EMAIL_TESTING_FORWARD_TO'),
        'prefix_subject' => env('EMAIL_TESTING_PREFIX_SUBJECT', '[TEST] '),
    ],
];
