<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Server Side Rendering
    |--------------------------------------------------------------------------
    |
    | These options configures if and how Inertia uses Server Side Rendering
    | to pre-render the initial visits to your application's pages.
    |
    | You can use the `inertia:start-ssr` Artisan command to start a local
    | SSR server, or configure it to use a remote server.
    |
    */

    'ssr' => [
        'enabled' => false,
        'url' => env('INERTIA_SSR_URL', 'http://127.0.0.1:13714'),
        'bundle' => base_path('bootstrap/ssr/ssr.mjs'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Testing
    |--------------------------------------------------------------------------
    |
    | The following options configure how Inertia's client-side testing
    | library is loaded. This is useful when running unit tests that
    | need to interact with your Inertia components.
    |
    */

    'testing' => [
        'ensure_pages_exist' => true,
    ],
];
