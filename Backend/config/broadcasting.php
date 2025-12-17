<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default Broadcaster
    |--------------------------------------------------------------------------
    |
    | This option controls the default broadcaster that will be used by the
    | framework when an event needs to be broadcast. You may set this to
    | any of the connections defined in the "connections" array below.
    |
    | Supported: "pusher", "ably", "redis", "log", "null"
    |
    */

    'default' => env('BROADCAST_DRIVER', 'log'),

    /*
    |--------------------------------------------------------------------------
    | Broadcast Connections
    |--------------------------------------------------------------------------
    |
    | Here you may define all of the broadcast connections that will be used
    | to broadcast events to other systems or over websockets. Samples of
    | each available type of connection are provided inside this array.
    |
    */

    'connections' => [
        'pusher' => [
            'driver' => 'pusher',
            'key' => env('PUSHER_APP_KEY'),
            'secret' => env('PUSHER_APP_SECRET'),
            'app_id' => env('PUSHER_APP_ID'),
            'options' => [
                'cluster' => env('PUSHER_APP_CLUSTER'),
                'host' => env('PUSHER_HOST') ?: 'api-' . env('PUSHER_APP_CLUSTER', 'mt1') . '.pusher.com',
                'port' => env('PUSHER_PORT', 443),
                'scheme' => env('PUSHER_SCHEME', 'https'),
                'encrypted' => env('PUSHER_ENCRYPTED', true),
                'useTLS' => env('PUSHER_USE_TLS', true),
            ],
            'client_options' => [
                // Guzzle client options: https://docs.guzzlephp.org/en/stable/request-options.html
                'timeout' => env('PUSHER_CLIENT_TIMEOUT', 30),
                'connect_timeout' => env('PUSHER_CLIENT_CONNECT_TIMEOUT', 10),
            ],
        ],

        'ably' => [
            'driver' => 'ably',
            'key' => env('ABLY_KEY'),
        ],

        'redis' => [
            'driver' => 'redis',
            'connection' => 'broadcasting',
            'queue' => env('REDIS_BROADCAST_QUEUE', 'broadcast'),
        ],

        'log' => [
            'driver' => 'log',
        ],

        'null' => [
            'driver' => 'null',
        ],

        'socket.io' => [
            'driver' => 'socket.io',
            'host' => env('SOCKET_IO_HOST', '127.0.0.1'),
            'port' => env('SOCKET_IO_PORT', 6001),
            'options' => [
                'cluster' => env('SOCKET_IO_CLUSTER', 'socket.io'),
                'namespace' => env('SOCKET_IO_NAMESPACE', '/'),
                'ssl' => [
                    'verify_peer' => env('SOCKET_IO_SSL_VERIFY', true),
                ],
            ],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Broadcast Events
    |--------------------------------------------------------------------------
    |
    | Here you may register broadcast events that your application will broadcast.
    | These events will be serialized and broadcast to the client-side.
    |
    */

    'events' => [
        'chat' => [
            'new_message' => env('BROADCAST_CHAT_NEW_MESSAGE', true),
            'typing' => env('BROADCAST_CHAT_TYPING', true),
            'read_receipt' => env('BROADCAST_CHAT_READ_RECEIPT', true),
        ],
        'workflow' => [
            'status_change' => env('BROADCAST_WORKFLOW_STATUS_CHANGE', true),
            'execution_progress' => env('BROADCAST_WORKFLOW_EXECUTION_PROGRESS', true),
        ],
        'lead' => [
            'new_lead' => env('BROADCAST_LEAD_NEW', true),
            'status_change' => env('BROADCAST_LEAD_STATUS_CHANGE', true),
        ],
        'notification' => [
            'system' => env('BROADCAST_NOTIFICATION_SYSTEM', true),
            'user' => env('BROADCAST_NOTIFICATION_USER', true),
        ],
    ],
];
