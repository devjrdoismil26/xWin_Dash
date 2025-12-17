<?php

namespace App\Domains\AI\Providers;

use App\Domains\AI\Contracts\AIGenerationRepositoryInterface;
use App\Domains\AI\Domain\ChatbotRepositoryInterface;
use App\Domains\AI\Infrastructure\Persistence\Eloquent\AIGenerationRepository;
use App\Domains\AI\Infrastructure\Persistence\Eloquent\ChatbotRepository;
use Illuminate\Support\ServiceProvider as BaseServiceProvider;

class ServiceProvider extends BaseServiceProvider
{
    /**
     * Register any application services.
     * @return void
     */
    public function register(): void
    {
        $this->app->bind(AIGenerationRepositoryInterface::class, AIGenerationRepository::class);
        $this->app->bind(ChatbotRepositoryInterface::class, ChatbotRepository::class);

        // Register PyLab client and AI services (from AIDomainServiceProvider)
        $this->app->singleton(\App\Domains\AI\Infrastructure\Http\PyLabClient::class);
        $this->app->singleton(\App\Domains\AI\Services\AIVideoGenerationService::class);
        $this->app->singleton(\App\Domains\AI\Services\ChatService::class);

        // Bind services that have contracts
        // Ex: $this->app->bind(GeminiServiceContract::class, GeminiService::class);
    }

    /**
     * Bootstrap any application services.
     * @return void
     */
    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__ . '/../Http/routes.php');
    }
}
