<?php

return [
    'only' => [
        // Web routes
        'dashboard',
        'projects.*',
        'leads.*',
        'products.*',
        'users.*',
        'settings.*',
        'ai.*',
        'aura.*',
        'analytics.*',
        'email-marketing.*',
        'social-buffer.*',
        'workflows.*',
        'media.*',
        'adstool.*',
        
        // Auth routes
        'login',
        'register',
        'password.request',
        'password.email',
        'password.reset',
        'password.store',
        'password.confirm',
        'password.confirm.store',
        'verification.notice',
        'verification.verify',
        'verification.send',
        'logout',
        
        // API routes
        'api.dashboard.*',
        'api.projects.*',
        'api.leads.*',
        'api.products.*',
        'api.ai.*',
    ],
    'groups' => [
        'api' => ['api.*'],
        'web' => ['dashboard', 'projects.*', 'leads.*', 'products.*'],
    ]
];