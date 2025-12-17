<?php

namespace App\Domains\SocialBuffer\Providers;

use App\Domains\SocialBuffer\Domain\AnalyticsRepositoryInterface;
use App\Domains\SocialBuffer\Domain\HashtagGroupRepositoryInterface;
use App\Domains\SocialBuffer\Domain\InteractionRepositoryInterface;
use App\Domains\SocialBuffer\Domain\MediaRepositoryInterface;
use App\Domains\SocialBuffer\Domain\PostRepositoryInterface;
use App\Domains\SocialBuffer\Domain\ScheduleRepositoryInterface;
use App\Domains\SocialBuffer\Domain\ShortenedLinkRepositoryInterface;
use App\Domains\SocialBuffer\Domain\SocialAccountRepositoryInterface;
use App\Domains\SocialBuffer\Infrastructure\Persistence\Eloquent\AnalyticsRepository;
use App\Domains\SocialBuffer\Infrastructure\Persistence\Eloquent\HashtagGroupRepository;
use App\Domains\SocialBuffer\Infrastructure\Persistence\Eloquent\InteractionRepository;
use App\Domains\SocialBuffer\Infrastructure\Persistence\Eloquent\MediaRepository;
use App\Domains\SocialBuffer\Infrastructure\Persistence\Eloquent\PostRepository;
use App\Domains\SocialBuffer\Infrastructure\Persistence\Eloquent\ScheduleRepository;
use App\Domains\SocialBuffer\Infrastructure\Persistence\Eloquent\ShortenedLinkRepository;
use App\Domains\SocialBuffer\Infrastructure\Persistence\Eloquent\SocialAccountRepository;
use Illuminate\Support\ServiceProvider;

class SocialBufferDomainServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register()
    {
        $this->app->bind(
            AnalyticsRepositoryInterface::class,
            AnalyticsRepository::class,
        );

        $this->app->bind(
            HashtagGroupRepositoryInterface::class,
            HashtagGroupRepository::class,
        );

        $this->app->bind(
            InteractionRepositoryInterface::class,
            InteractionRepository::class,
        );

        $this->app->bind(
            MediaRepositoryInterface::class,
            MediaRepository::class,
        );

        $this->app->bind(
            PostRepositoryInterface::class,
            PostRepository::class,
        );

        $this->app->bind(
            ScheduleRepositoryInterface::class,
            ScheduleRepository::class,
        );

        $this->app->bind(
            ShortenedLinkRepositoryInterface::class,
            ShortenedLinkRepository::class,
        );

        // Bind explícito para o tipo concreto usado no controller legacy
        $this->app->bind(
            \App\Domains\SocialBuffer\Repositories\ShortenedLinkRepository::class,
            ShortenedLinkRepository::class,
        );

        $this->app->bind(
            SocialAccountRepositoryInterface::class,
            SocialAccountRepository::class,
        );

        // Services
        $this->app->bind(
            \App\Domains\SocialBuffer\Contracts\PostServiceInterface::class,
            \App\Domains\SocialBuffer\Services\PostService::class,
        );

        $this->app->bind(
            \App\Domains\SocialBuffer\Contracts\ScheduleServiceInterface::class,
            \App\Domains\SocialBuffer\Services\ScheduleService::class,
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
    }
}
