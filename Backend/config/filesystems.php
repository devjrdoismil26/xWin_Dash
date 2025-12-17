<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default Filesystem Disk
    |--------------------------------------------------------------------------
    |
    | Here you may specify the default filesystem disk that should be used
    | by the framework. The "local" disk, as well as a variety of cloud
    | based disks are available to your application. Just store away!
    |
    */

    'default' => env('FILESYSTEM_DISK', 'local'),

    /*
    |--------------------------------------------------------------------------
    | Filesystem Disks
    |--------------------------------------------------------------------------
    |
    | Here you may configure as many filesystem "disks" as you wish, and you
    | may even configure multiple disks of the same driver. Defaults have
    | been set up for each driver as an example of the required values.
    |
    | Supported Drivers: "local", "ftp", "sftp", "s3"
    |
    */

    'disks' => [
        'local' => [
            'driver' => 'local',
            'root' => storage_path('app'),
            'throw' => false,
        ],

        'public' => [
            'driver' => 'local',
            'root' => storage_path('app/public'),
            'url' => env('APP_URL') . '/storage',
            'visibility' => 'public',
            'throw' => false,
        ],

        's3' => [
            'driver' => 's3',
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'region' => env('AWS_DEFAULT_REGION'),
            'bucket' => env('AWS_BUCKET'),
            'url' => env('AWS_URL'),
            'endpoint' => env('AWS_ENDPOINT'),
            'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
            'throw' => false,
            'cache' => [
                'store' => env('AWS_CACHE_STORE', 'redis'),
                'expire' => env('AWS_CACHE_EXPIRE', 600), // 10 minutes
                'prefix' => env('AWS_CACHE_PREFIX', 'aws_s3_'),
            ],
        ],

        'media' => [
            'driver' => env('MEDIA_DISK_DRIVER', 's3'),
            'key' => env('MEDIA_DISK_KEY', env('AWS_ACCESS_KEY_ID')),
            'secret' => env('MEDIA_DISK_SECRET', env('AWS_SECRET_ACCESS_KEY')),
            'region' => env('MEDIA_DISK_REGION', env('AWS_DEFAULT_REGION')),
            'bucket' => env('MEDIA_DISK_BUCKET', env('AWS_BUCKET')),
            'url' => env('MEDIA_DISK_URL', env('AWS_URL')),
            'endpoint' => env('MEDIA_DISK_ENDPOINT', env('AWS_ENDPOINT')),
            'use_path_style_endpoint' => env('MEDIA_DISK_USE_PATH_STYLE_ENDPOINT', env('AWS_USE_PATH_STYLE_ENDPOINT', false)),
            'throw' => false,
            'visibility' => 'public',
            'root' => env('MEDIA_DISK_ROOT', 'media'),
        ],

        'backups' => [
            'driver' => env('BACKUP_DISK_DRIVER', 's3'),
            'key' => env('BACKUP_DISK_KEY', env('AWS_ACCESS_KEY_ID')),
            'secret' => env('BACKUP_DISK_SECRET', env('AWS_SECRET_ACCESS_KEY')),
            'region' => env('BACKUP_DISK_REGION', env('AWS_DEFAULT_REGION')),
            'bucket' => env('BACKUP_DISK_BUCKET', env('AWS_BUCKET')),
            'url' => env('BACKUP_DISK_URL', env('AWS_URL')),
            'endpoint' => env('BACKUP_DISK_ENDPOINT', env('AWS_ENDPOINT')),
            'use_path_style_endpoint' => env('BACKUP_DISK_USE_PATH_STYLE_ENDPOINT', env('AWS_USE_PATH_STYLE_ENDPOINT', false)),
            'throw' => false,
            'visibility' => 'private',
            'root' => env('BACKUP_DISK_ROOT', 'backups'),
        ],

        'exports' => [
            'driver' => env('EXPORT_DISK_DRIVER', 'local'),
            'root' => env('EXPORT_DISK_ROOT', storage_path('app/exports')),
            'url' => env('EXPORT_DISK_URL', env('APP_URL') . '/storage/exports'),
            'visibility' => env('EXPORT_DISK_VISIBILITY', 'private'),
            'throw' => false,
        ],

        'imports' => [
            'driver' => env('IMPORT_DISK_DRIVER', 'local'),
            'root' => env('IMPORT_DISK_ROOT', storage_path('app/imports')),
            'url' => env('IMPORT_DISK_URL', env('APP_URL') . '/storage/imports'),
            'visibility' => env('IMPORT_DISK_VISIBILITY', 'private'),
            'throw' => false,
        ],

        'templates' => [
            'driver' => env('TEMPLATE_DISK_DRIVER', 'local'),
            'root' => env('TEMPLATE_DISK_ROOT', storage_path('app/templates')),
            'url' => env('TEMPLATE_DISK_URL', env('APP_URL') . '/storage/templates'),
            'visibility' => env('TEMPLATE_DISK_VISIBILITY', 'private'),
            'throw' => false,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Symbolic Links
    |--------------------------------------------------------------------------
    |
    | Here you may configure the symbolic links that will be created when the
    | `storage:link` Artisan command is executed. The array keys should be
    | the locations of the links and the values should be their targets.
    |
    */

    'links' => [
        public_path('storage') => storage_path('app/public'),
        public_path('exports') => storage_path('app/exports'),
        public_path('templates') => storage_path('app/templates'),
    ],

    /*
    |--------------------------------------------------------------------------
    | File Upload Limits
    |--------------------------------------------------------------------------
    |
    | Here you may configure the maximum file size and allowed file types
    | for uploads in different contexts of the application.
    |
    */

    'uploads' => [
        'profile_image' => [
            'max_size' => env('UPLOAD_PROFILE_IMAGE_MAX_SIZE', 2048), // KB
            'allowed_types' => ['jpg', 'jpeg', 'png', 'gif'],
        ],
        'lead_attachment' => [
            'max_size' => env('UPLOAD_LEAD_ATTACHMENT_MAX_SIZE', 10240), // KB
            'allowed_types' => ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv'],
        ],
        'email_attachment' => [
            'max_size' => env('UPLOAD_EMAIL_ATTACHMENT_MAX_SIZE', 5120), // KB
            'allowed_types' => ['jpg', 'jpeg', 'png', 'gif', 'pdf'],
        ],
        'whatsapp_media' => [
            'max_size' => env('UPLOAD_WHATSAPP_MEDIA_MAX_SIZE', 16384), // KB
            'allowed_types' => ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'mp3', 'mp4', 'webp'],
        ],
    ],
];
