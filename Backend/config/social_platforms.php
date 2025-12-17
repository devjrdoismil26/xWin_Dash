<?php

return [
    'facebook' => [
        'api_version' => 'v18.0',
        'base_url' => 'https://graph.facebook.com',
        'max_text_length' => 63206,
        'supports_scheduling' => true,
        'supports_media' => true,
    ],
    'instagram' => [
        'api_version' => 'v18.0',
        'base_url' => 'https://graph.facebook.com',
        'max_text_length' => 2200,
        'supports_scheduling' => true,
        'supports_media' => true,
    ],
    'twitter' => [
        'api_version' => 'v2',
        'base_url' => 'https://api.twitter.com',
        'max_text_length' => 280,
        'supports_scheduling' => false,
        'supports_media' => true,
    ],
    'linkedin' => [
        'api_version' => 'v2',
        'base_url' => 'https://api.linkedin.com',
        'max_text_length' => 3000,
        'supports_scheduling' => false,
        'supports_media' => true,
    ],
    'default' => [
        'max_text_length' => 1000,
        'supports_scheduling' => false,
        'supports_media' => false,
    ],
];
