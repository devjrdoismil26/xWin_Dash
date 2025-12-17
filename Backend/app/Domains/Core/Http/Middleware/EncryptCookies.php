<?php

namespace App\Domains\Core\Http\Middleware;

use Illuminate\Cookie\Middleware\EncryptCookies as Middleware;

class EncryptCookies extends Middleware
{
    /**
     * The names of the cookies that should not be encrypted.
     *
     * @var array<int, string>
     */
    protected $except = [
        'laravel_session',
        'XSRF-TOKEN',
        'remember_token',
    ];
}
