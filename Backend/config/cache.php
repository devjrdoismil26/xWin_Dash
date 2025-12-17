<?php

use Illuminate\Support\Str;

return [
    /*
    |--------------------------------------------------------------------------
    | Default Cache Store
    |--------------------------------------------------------------------------
    |
    | This option controls the default cache connection that gets used while
    | using this caching library. This connection is used when another is
    | not explicitly specified when executing a given caching function.
    |
    */

    'default' => env('CACHE_DRIVER', 'file'),

    /*
    |--------------------------------------------------------------------------
    | Cache Stores
    |--------------------------------------------------------------------------
    |
    | Here you may define all of the cache "stores" for your application as
    | well as their drivers. You may even define multiple stores for the
    | same cache driver to group types of items stored in your caches.
    |
    | Supported drivers: "apc", "array", "database", "file",
    |            "memcached", "redis", "dynamodb", "octane", "null"
    |
    */

    'stores' => [
        'apc' => [
            'driver' => 'apc',
        ],

        'array' => [
            'driver' => 'array',
            'serialize' => false,
        ],

        'database' => [
            'driver' => 'database',
            'table' => 'cache',
            'connection' => null,
            'lock_connection' => null,
        ],

        'file' => [
            'driver' => 'file',
            'path' => storage_path('framework/cache/data'),
            'lock_path' => storage_path('framework/cache/data'),
        ],

        'memcached' => [
            'driver' => 'memcached',
            'persistent_id' => env('MEMCACHED_PERSISTENT_ID'),
            'sasl' => [
                env('MEMCACHED_USERNAME'),
                env('MEMCACHED_PASSWORD'),
            ],
            'options' => [
                // Memcached::OPT_CONNECT_TIMEOUT => 2000,
            ],
            'servers' => [
                [
                    'host' => env('MEMCACHED_HOST', '127.0.0.1'),
                    'port' => env('MEMCACHED_PORT', 11211),
                    'weight' => 100,
                ],
            ],
        ],

        'redis' => [
            'driver' => 'redis',
            'connection' => 'cache',
            'lock_connection' => 'default',
        ],

        'dynamodb' => [
            'driver' => 'dynamodb',
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
            'table' => env('DYNAMODB_CACHE_TABLE', 'cache'),
            'endpoint' => env('DYNAMODB_ENDPOINT'),
        ],

        'octane' => [
            'driver' => 'octane',
        ],

        // Cache específico para consultas pesadas
        'queries' => [
            'driver' => 'redis',
            'connection' => 'cache',
            'prefix' => 'queries',
        ],

        // Cache para sessões de usuário
        'sessions' => [
            'driver' => 'redis',
            'connection' => 'sessions',
            'prefix' => 'sessions',
        ],

        // Cache para dados do Universe
        'universe' => [
            'driver' => 'redis',
            'connection' => 'universe',
            'prefix' => 'universe',
        ],

        // Cache para analytics e métricas
        'analytics' => [
            'driver' => 'redis',
            'connection' => 'analytics',
            'prefix' => 'analytics',
        ],

        // Cache para uploads e media
        'media' => [
            'driver' => 'redis',
            'connection' => 'media',
            'prefix' => 'media',
        ],

        // Cache para integrações externas
        'integrations' => [
            'driver' => 'redis',
            'connection' => 'integrations',
            'prefix' => 'integrations',
        ],

        // Cache de alta performance para dados críticos
        'critical' => [
            'driver' => 'memcached',
            'persistent_id' => env('MEMCACHED_PERSISTENT_ID'),
            'servers' => [
                [
                    'host' => env('MEMCACHED_HOST', '127.0.0.1'),
                    'port' => env('MEMCACHED_PORT', 11211),
                    'weight' => 100,
                ],
            ],
            'options' => class_exists('\Memcached') ? [
                \Memcached::OPT_COMPRESSION => true,
                \Memcached::OPT_SERIALIZER => \Memcached::SERIALIZER_IGBINARY,
                \Memcached::OPT_BINARY_PROTOCOL => true,
                \Memcached::OPT_NO_BLOCK => true,
                \Memcached::OPT_TCP_NODELAY => true,
                \Memcached::OPT_CONNECT_TIMEOUT => 1000,
                \Memcached::OPT_POLL_TIMEOUT => 1000,
                \Memcached::OPT_RECV_TIMEOUT => 1000,
                \Memcached::OPT_SEND_TIMEOUT => 1000,
            ] : [],
        ],

        // Cache distribuído para clusters
        'distributed' => [
            'driver' => 'redis',
            'connection' => 'cluster',
            'prefix' => 'distributed',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Cache Key Prefix
    |--------------------------------------------------------------------------
    |
    | When utilizing a RAM based store such as APC or Memcached, there might
    | be other applications utilizing the same cache. So, we'll specify a
    | value to get prefixed to all our keys so we can avoid collisions.
    |
    */

    'prefix' => env('CACHE_PREFIX', Str::slug(env('APP_NAME', 'laravel'), '_') . '_cache'),

    /*
    |--------------------------------------------------------------------------
    | Cache Tags
    |--------------------------------------------------------------------------
    |
    | Cache tags allow you to tag related pieces of cached data. This is
    | helpful when you need to flush a particular group of cache entries.
    | For example, you could tag all user-related cache entries with
    | a "users" tag, and then later clear all "users" entries at once.
    |
    */

    'tags' => [
        'users' => ['ttl' => 3600], // 1 hora
        'projects' => ['ttl' => 1800], // 30 minutos
        'dashboard' => ['ttl' => 300], // 5 minutos
        'analytics' => ['ttl' => 600], // 10 minutos
        'universe' => ['ttl' => 1800], // 30 minutos
        'media' => ['ttl' => 7200], // 2 horas
        'integrations' => ['ttl' => 900], // 15 minutos
        'workflows' => ['ttl' => 1200], // 20 minutos
        'ai_responses' => ['ttl' => 1800], // 30 minutos
        'notifications' => ['ttl' => 300], // 5 minutos
        'reports' => ['ttl' => 3600], // 1 hora
        'configurations' => ['ttl' => 7200], // 2 horas
    ],

    /*
    |--------------------------------------------------------------------------
    | Cache Performance Settings
    |--------------------------------------------------------------------------
    |
    | These settings help optimize cache performance for different scenarios.
    |
    */

    'performance' => [
        // Configurações para queries pesadas
        'heavy_queries' => [
            'ttl' => 3600, // 1 hora
            'tags' => ['analytics', 'reports'],
        ],

        // Configurações para dados de usuário
        'user_data' => [
            'ttl' => 1800, // 30 minutos
            'tags' => ['users'],
        ],

        // Configurações para dashboards
        'dashboard_data' => [
            'ttl' => 300, // 5 minutos
            'tags' => ['dashboard'],
        ],

        // Configurações para integrações
        'integration_data' => [
            'ttl' => 900, // 15 minutos
            'tags' => ['integrations'],
        ],

        // Configurações para Universe
        'universe_data' => [
            'ttl' => 1800, // 30 minutos
            'tags' => ['universe'],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Cache Warming
    |--------------------------------------------------------------------------
    |
    | Configuration for cache warming strategies.
    |
    */

    'warming' => [
        'enabled' => env('CACHE_WARMING_ENABLED', true),
        'strategies' => [
            'dashboard' => [
                'interval' => 300, // 5 minutos
                'routes' => [
                    'api.dashboard.overview',
                    'api.dashboard.analytics',
                    'api.dashboard.universe',
                ],
            ],
            'user_data' => [
                'interval' => 600, // 10 minutos
                'routes' => [
                    'api.users.profile',
                    'api.users.preferences',
                ],
            ],
        ],
    ],
];
