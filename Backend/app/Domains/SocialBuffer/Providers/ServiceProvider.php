<?php

namespace App\Domains\SocialBuffer\Providers;

use App\Domains\SocialBuffer\Contracts\FacebookPublisherInterface;
use App\Domains\SocialBuffer\Contracts\InstagramPublisherInterface;
use App\Domains\SocialBuffer\Contracts\LinkedInPublisherInterface;
use App\Domains\SocialBuffer\Contracts\PinterestPublisherInterface;
use App\Domains\SocialBuffer\Contracts\TikTokPublisherInterface;
use App\Domains\SocialBuffer\Contracts\TwitterPublisherInterface;
use App\Domains\SocialBuffer\Factories\PublisherFactory;
use App\Domains\SocialBuffer\Publishers\NullPublisher;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\ServiceProvider as BaseServiceProvider;

class ServiceProvider extends BaseServiceProvider
{
    public function register()
    {
        // Bind PublisherFactory
        $this->app->singleton(PublisherFactory::class, function (Application $app) {
            return new PublisherFactory(
                $app->make(FacebookPublisherInterface::class),
                $app->make(InstagramPublisherInterface::class),
                $app->make(LinkedInPublisherInterface::class),
                $app->make(PinterestPublisherInterface::class),
                $app->make(TikTokPublisherInterface::class),
                $app->make(TwitterPublisherInterface::class),
            );
        });

        // Binds de desenvolvimento: publishers nulos (no-op)
        $this->app->bind(FacebookPublisherInterface::class, fn () => new NullPublisher());
        $this->app->bind(InstagramPublisherInterface::class, fn () => new NullPublisher());
        $this->app->bind(TwitterPublisherInterface::class, fn () => new NullPublisher());
        $this->app->bind(LinkedInPublisherInterface::class, fn () => new NullPublisher());
        $this->app->bind(PinterestPublisherInterface::class, fn () => new NullPublisher());
        $this->app->bind(TikTokPublisherInterface::class, fn () => new NullPublisher());
    }

    public function boot(): void
    {
    }
}
