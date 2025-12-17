<?php

namespace App\Domains\Auth\Providers;

use Illuminate\Support\ServiceProvider;
use App\Domains\Auth\Domain\Contracts\UserRepositoryInterface;
use App\Domains\Auth\Domain\Contracts\SessionRepositoryInterface;
use App\Domains\Auth\Infrastructure\Repositories\EloquentUserRepository;
use App\Domains\Auth\Infrastructure\Repositories\EloquentSessionRepository;

class AuthServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(UserRepositoryInterface::class, EloquentUserRepository::class);
        $this->app->bind(SessionRepositoryInterface::class, EloquentSessionRepository::class);
    }

    public function boot(): void
    {
        //
    }
}
