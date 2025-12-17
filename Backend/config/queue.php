<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default Queue Connection Name
    |--------------------------------------------------------------------------
    |
    | Laravel's queue API supports an assortment of back-ends via a single
    | API, giving you convenient access to each back-end using the same
    | syntax for every one. Here you may define a default connection.
    |
    */

    'default' => env('QUEUE_CONNECTION', 'sync'),

    /*
    |--------------------------------------------------------------------------
    | Queue Connections
    |--------------------------------------------------------------------------
    |
    | Here you may configure the connection information for each server that
    | is used by your application. A default configuration has been added
    | for each back-end shipped with Laravel. You are free to add more.
    |
    | Drivers: "sync", "database", "beanstalkd", "sqs", "redis", "null"
    |
    */

    'connections' => [
        'sync' => [
            'driver' => 'sync',
        ],

        'database' => [
            'driver' => 'database',
            'table' => 'jobs',
            'queue' => 'default',
            'retry_after' => 90,
            'after_commit' => false,
        ],

        'beanstalkd' => [
            'driver' => 'beanstalkd',
            'host' => 'localhost',
            'queue' => 'default',
            'retry_after' => 90,
            'block_for' => 0,
            'after_commit' => false,
        ],

        'sqs' => [
            'driver' => 'sqs',
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'prefix' => env('SQS_PREFIX', 'https://sqs.us-east-1.amazonaws.com/your-account-id'),
            'queue' => env('SQS_QUEUE', 'default'),
            'suffix' => env('SQS_SUFFIX'),
            'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
            'after_commit' => false,
        ],

        'redis' => [
            'driver' => 'redis',
            'connection' => 'default',
            'queue' => env('REDIS_QUEUE', 'default'),
            'retry_after' => 90,
            'block_for' => null,
            'after_commit' => false,
        ],

        // High priority queue for critical tasks
        'high' => [
            'driver' => 'redis',
            'connection' => 'default',
            'queue' => 'high',
            'retry_after' => 60,
            'block_for' => null,
            'after_commit' => false,
        ],

        // Email processing queue
        'emails' => [
            'driver' => 'redis',
            'connection' => 'default',
            'queue' => 'emails',
            'retry_after' => 120,
            'block_for' => null,
            'after_commit' => false,
        ],

        // WhatsApp/Aura processing queue
        'whatsapp' => [
            'driver' => 'redis',
            'connection' => 'default',
            'queue' => 'whatsapp',
            'retry_after' => 90,
            'block_for' => null,
            'after_commit' => false,
        ],

        // Queue sharding for high scale
        'shard-1' => [
            'driver' => 'redis',
            'connection' => 'default',
            'queue' => 'shard-1',
            'retry_after' => 90,
            'block_for' => null,
            'after_commit' => false,
        ],

        'shard-2' => [
            'driver' => 'redis',
            'connection' => 'default',
            'queue' => 'shard-2',
            'retry_after' => 90,
            'block_for' => null,
            'after_commit' => false,
        ],

        'shard-3' => [
            'driver' => 'redis',
            'connection' => 'default',
            'queue' => 'shard-3',
            'retry_after' => 90,
            'block_for' => null,
            'after_commit' => false,
        ],

        // Priority queues for different job types
        'critical' => [
            'driver' => 'redis',
            'connection' => 'default',
            'queue' => 'critical',
            'retry_after' => 30,
            'block_for' => null,
            'after_commit' => false,
        ],

        'normal' => [
            'driver' => 'redis',
            'connection' => 'default',
            'queue' => 'normal',
            'retry_after' => 90,
            'block_for' => null,
            'after_commit' => false,
        ],

        'low' => [
            'driver' => 'redis',
            'connection' => 'default',
            'queue' => 'low',
            'retry_after' => 180,
            'block_for' => null,
            'after_commit' => false,
        ],

        // Workflow execution queue
        'workflows' => [
            'driver' => 'redis',
            'connection' => 'default',
            'queue' => 'workflows',
            'retry_after' => 180,
            'block_for' => null,
            'after_commit' => false,
        ],

        // ADStool processing queue
        'adstool' => [
            'driver' => 'redis',
            'connection' => 'default',
            'queue' => 'adstool',
            'retry_after' => 120,
            'block_for' => null,
            'after_commit' => false,
        ],

        // SocialBuffer processing queue
        'socialbuffer' => [
            'driver' => 'redis',
            'connection' => 'default',
            'queue' => 'socialbuffer',
            'retry_after' => 90,
            'block_for' => null,
            'after_commit' => false,
        ],

        // AI processing queue (longer timeout for AI operations)
        'ai' => [
            'driver' => 'redis',
            'connection' => 'default',
            'queue' => 'ai',
            'retry_after' => 300,
            'block_for' => null,
            'after_commit' => false,
        ],

        // Analytics and reporting queue
        'analytics' => [
            'driver' => 'redis',
            'connection' => 'default',
            'queue' => 'analytics',
            'retry_after' => 240,
            'block_for' => null,
            'after_commit' => false,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Job Batching
    |--------------------------------------------------------------------------
    |
    | The following options configure the database and table that store job
    | batching information. These options can be updated to any database
    | connection and table which has been defined by your application.
    |
    */

    'batching' => [
        'database' => env('DB_CONNECTION', 'mysql'),
        'table' => 'job_batches',
    ],

    /*
    |--------------------------------------------------------------------------
    | Failed Queue Jobs
    |--------------------------------------------------------------------------
    |
    | These options configure the behavior of failed queue job logging so you
    | can control which database and table are used to store the jobs that
    | have failed. You may change them to any database / table you wish.
    |
    */

    'failed' => [
        'driver' => env('QUEUE_FAILED_DRIVER', 'database'),
        'database' => env('DB_CONNECTION', 'mysql'),
        'table' => 'failed_jobs',
    ],

    /*
    |--------------------------------------------------------------------------
    | Queue Priority Configuration
    |--------------------------------------------------------------------------
    |
    | Define the priority order for queue processing. Higher priority queues
    | will be processed first when multiple queues are being monitored.
    |
    */

    'priorities' => [
        'high' => 10,
        'emails' => 8,
        'whatsapp' => 8,
        'workflows' => 7,
        'adstool' => 6,
        'socialbuffer' => 6,
        'default' => 5,
        'ai' => 4,
        'analytics' => 3,
        'low' => 1,
    ],

    /*
    |--------------------------------------------------------------------------
    | Queue Worker Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for queue workers including timeouts, memory limits,
    | and retry settings.
    |
    */

    'workers' => [
        'default' => [
            'timeout' => env('QUEUE_WORKER_TIMEOUT', 60),
            'memory' => env('QUEUE_WORKER_MEMORY', 128),
            'tries' => env('QUEUE_WORKER_TRIES', 3),
            'backoff' => [10, 30, 60], // Exponential backoff in seconds
        ],
        'high' => [
            'timeout' => 30,
            'memory' => 128,
            'tries' => 5,
            'backoff' => [5, 15, 30],
        ],
        'emails' => [
            'timeout' => 120,
            'memory' => 256,
            'tries' => 3,
            'backoff' => [30, 60, 120],
        ],
        'whatsapp' => [
            'timeout' => 90,
            'memory' => 128,
            'tries' => 3,
            'backoff' => [15, 30, 60],
        ],
        'workflows' => [
            'timeout' => 180,
            'memory' => 256,
            'tries' => 2,
            'backoff' => [60, 120],
        ],
        'adstool' => [
            'timeout' => 120,
            'memory' => 256,
            'tries' => 3,
            'backoff' => [30, 60, 120],
        ],
        'socialbuffer' => [
            'timeout' => 90,
            'memory' => 128,
            'tries' => 3,
            'backoff' => [15, 30, 60],
        ],
        'ai' => [
            'timeout' => 300,
            'memory' => 512,
            'tries' => 2,
            'backoff' => [60, 180],
        ],
        'analytics' => [
            'timeout' => 240,
            'memory' => 512,
            'tries' => 2,
            'backoff' => [120, 300],
        ],
        'low' => [
            'timeout' => 300,
            'memory' => 256,
            'tries' => 1,
            'backoff' => [300],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Queue Monitoring
    |--------------------------------------------------------------------------
    |
    | Configuration for queue monitoring and alerting.
    |
    */

    'monitoring' => [
        'enabled' => env('QUEUE_MONITORING_ENABLED', true),
        'thresholds' => [
            'queue_size_warning' => env('QUEUE_SIZE_WARNING', 100),
            'queue_size_critical' => env('QUEUE_SIZE_CRITICAL', 500),
            'failed_jobs_warning' => env('FAILED_JOBS_WARNING', 10),
            'failed_jobs_critical' => env('FAILED_JOBS_CRITICAL', 50),
            'processing_time_warning' => env('PROCESSING_TIME_WARNING', 300), // seconds
        ],
        'alert_channels' => [
            'email' => env('QUEUE_ALERT_EMAIL', true),
            'slack' => env('QUEUE_ALERT_SLACK', false),
            'webhook' => env('QUEUE_ALERT_WEBHOOK', false),
        ],
    ],
];
