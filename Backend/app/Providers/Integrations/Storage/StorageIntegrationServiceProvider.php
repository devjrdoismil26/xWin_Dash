<?php

namespace App\Providers\Integrations\Storage;

use Illuminate\Support\ServiceProvider;
use App\Services\RateLimiterService;
use App\Services\CircuitBreakerService;
use App\Services\RetryService;

/**
 * 💾 Storage Integration Service Provider
 * 
 * Registra serviços de integração com plataformas de armazenamento
 */
class StorageIntegrationServiceProvider extends ServiceProvider
{
    /**
     * Indica se o provider deve ser carregado apenas quando necessário
     */
    protected $defer = true;

    /**
     * Lista de serviços fornecidos por este provider
     */
    public function provides(): array
    {
        return [
            \App\Services\Storage\AwsS3Service::class,
            \App\Services\Storage\GoogleCloudStorageService::class,
            \App\Services\Storage\AzureBlobService::class,
            \App\Services\Storage\CloudinaryService::class,
            \App\Services\Storage\DropboxService::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // AWS S3 Service
        $this->app->bind(\App\Services\Storage\AwsS3Service::class, function ($app) {
            return new \App\Services\Storage\AwsS3Service(
                config('services.aws.access_key_id'),
                config('services.aws.secret_access_key'),
                config('services.aws.region'),
                config('services.aws.bucket'),
                $app->make(RateLimiterService::class),
                $app->make(CircuitBreakerService::class),
                $app->make(RetryService::class)
            );
        });

        // Google Cloud Storage Service
        $this->app->bind(\App\Services\Storage\GoogleCloudStorageService::class, function ($app) {
            return new \App\Services\Storage\GoogleCloudStorageService(
                config('services.google_cloud.project_id'),
                config('services.google_cloud.bucket'),
                config('services.google_cloud.key_file'),
                $app->make(RateLimiterService::class),
                $app->make(CircuitBreakerService::class),
                $app->make(RetryService::class)
            );
        });

        // Azure Blob Service
        $this->app->bind(\App\Services\Storage\AzureBlobService::class, function ($app) {
            return new \App\Services\Storage\AzureBlobService(
                config('services.azure.account_name'),
                config('services.azure.account_key'),
                config('services.azure.container'),
                $app->make(RateLimiterService::class),
                $app->make(CircuitBreakerService::class),
                $app->make(RetryService::class)
            );
        });

        // Cloudinary Service
        $this->app->bind(\App\Services\Storage\CloudinaryService::class, function ($app) {
            return new \App\Services\Storage\CloudinaryService(
                config('services.cloudinary.cloud_name'),
                config('services.cloudinary.api_key'),
                config('services.cloudinary.api_secret'),
                $app->make(RateLimiterService::class),
                $app->make(CircuitBreakerService::class),
                $app->make(RetryService::class)
            );
        });

        // Dropbox Service
        $this->app->bind(\App\Services\Storage\DropboxService::class, function ($app) {
            return new \App\Services\Storage\DropboxService(
                config('services.dropbox.access_token'),
                $app->make(RateLimiterService::class),
                $app->make(CircuitBreakerService::class),
                $app->make(RetryService::class)
            );
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('integrations.storage.enabled', true)) {
            // Registrar listeners de eventos específicos de storage
            // Event::listen(StorageEvent::class, StorageListener::class);
        }
    }
}