<?php

namespace App\Domains\Core\Providers;

use App\Domains\Core\Domain\CacheEntryRepositoryInterface;
use App\Domains\Core\Domain\IntegrationRepositoryInterface;
use App\Domains\Core\Domain\IntegrationSyncLogRepositoryInterface;
use App\Domains\Core\Domain\NotificationRepositoryInterface;
use App\Domains\Core\Domain\SettingRepositoryInterface;
use App\Domains\Core\Infrastructure\Persistence\Eloquent\CacheEntryRepository;
use App\Domains\Core\Infrastructure\Persistence\Eloquent\IntegrationRepository;
use App\Domains\Core\Infrastructure\Persistence\Eloquent\IntegrationSyncLogRepository;
use App\Domains\Core\Infrastructure\Persistence\Eloquent\NotificationRepository;
use App\Domains\Core\Infrastructure\Persistence\Eloquent\SettingRepository;
use App\Domains\Core\Services\NotificationService;
use App\Domains\Core\Services\SettingService;
use App\Domains\Core\Application\Services\CoreApplicationService;
use App\Domains\Core\Application\Handlers\CreateSettingHandler;
use App\Domains\Core\Application\Handlers\UpdateSettingHandler;
use App\Domains\Core\Application\Handlers\DeleteSettingHandler;
use App\Domains\Core\Application\Handlers\GetSettingHandler;
use App\Domains\Core\Application\Handlers\ListSettingsHandler;
use Illuminate\Support\ServiceProvider as BaseServiceProvider;

class CoreDomainServiceProvider extends BaseServiceProvider
{
    /**
     * Indicates if the provider is deferred.
     * 
     * @var bool
     */
    protected $defer = true;

    /**
     * The services that are provided by this provider.
     *
     * @var array
     */
    protected $provides = [
        // Repositórios essenciais
        NotificationRepositoryInterface::class,
        SettingRepositoryInterface::class,
        
        // Services essenciais
        NotificationService::class,
        SettingService::class,
        
        // Application service essencial
        CoreApplicationService::class,
    ];
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // 🚀 OTIMIZADO: Registrar apenas repositórios essenciais com lazy loading
        $this->app->bind(NotificationRepositoryInterface::class, function ($app) {
            return $app->make(NotificationRepository::class);
        });
        
        $this->app->bind(SettingRepositoryInterface::class, function ($app) {
            return $app->make(SettingRepository::class);
        });
        
        // 🚀 OTIMIZADO: Registrar services essenciais com lazy loading
        $this->app->bind(NotificationService::class, function ($app) {
            return new NotificationService(
                $app->make(NotificationRepositoryInterface::class)
            );
        });
        
        $this->app->bind(SettingService::class, function ($app) {
            return new SettingService(
                $app->make(SettingRepositoryInterface::class)
            );
        });
        
        // 🚀 OTIMIZADO: Registrar application service essencial
        $this->app->bind(CoreApplicationService::class, function ($app) {
            return new CoreApplicationService(
                $app->make(SettingService::class),
                $app->make(NotificationService::class)
            );
        });
        
        // 🚀 OTIMIZADO: Registrar handlers apenas quando necessário (lazy loading)
        $this->app->bind(CreateSettingHandler::class, function ($app) {
            return new CreateSettingHandler(
                $app->make(SettingService::class)
            );
        });
        
        $this->app->bind(UpdateSettingHandler::class, function ($app) {
            return new UpdateSettingHandler(
                $app->make(SettingService::class)
            );
        });
        
        $this->app->bind(DeleteSettingHandler::class, function ($app) {
            return new DeleteSettingHandler(
                $app->make(SettingService::class)
            );
        });
        
        $this->app->bind(GetSettingHandler::class, function ($app) {
            return new GetSettingHandler(
                $app->make(SettingService::class)
            );
        });
        
        $this->app->bind(ListSettingsHandler::class, function ($app) {
            return new ListSettingsHandler(
                $app->make(SettingService::class)
            );
        });
        
        // 🚀 OTIMIZADO: Registrar repositórios não essenciais apenas quando necessário
        $this->app->bind(CacheEntryRepositoryInterface::class, function ($app) {
            return $app->make(CacheEntryRepository::class);
        });
        
        $this->app->bind(IntegrationRepositoryInterface::class, function ($app) {
            return $app->make(IntegrationRepository::class);
        });
        
        $this->app->bind(IntegrationSyncLogRepositoryInterface::class, function ($app) {
            return $app->make(IntegrationSyncLogRepository::class);
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // 🚀 OTIMIZADO: Carregar rotas apenas se módulo Core estiver habilitado
        if (config('modules.core.enabled', true)) {
            $this->loadRoutesFrom(__DIR__.'/../Http/routes.php');
        }
        
        // 🚀 OTIMIZADO: Carregar views apenas se necessário
        if (config('modules.core.load_views', false) && is_dir(__DIR__.'/../Resources/views')) {
            $this->loadViewsFrom(__DIR__.'/../Resources/views', 'core');
        }
        
        // 🚀 OTIMIZADO: Carregar migrations apenas em ambiente de desenvolvimento ou quando necessário
        if (config('modules.core.load_migrations', app()->environment('local')) && is_dir(__DIR__.'/../../database/migrations')) {
            $this->loadMigrationsFrom(__DIR__.'/../../database/migrations');
        }
    }
}
