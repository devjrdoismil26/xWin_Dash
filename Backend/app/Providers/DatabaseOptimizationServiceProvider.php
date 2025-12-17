<?php

namespace App\Providers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;

class DatabaseOptimizationServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot()
    {
        // Exemplo: Logar queries lentas
        if (config('app.env') === 'local') {
            DB::listen(function ($query) {
                if ($query->time > 100) { // Queries que demoram mais de 100ms
                    Log::warning(
                        'Slow Query',
                        [
                            'sql' => $query->sql,
                            'bindings' => $query->bindings,
                            'time' => $query->time,
                        ],
                    );
                }
            });
        }

        // Exemplo: Habilitar cache de queries para tabelas específicas (requer configuração de cache)
        // Cache::extend('query', function ($app) {
        //     return new QueryCacheStore($app['cache.store']);
        // });

        // Outras otimizações podem ser registradas aqui, como:
        // - Bindings para repositórios otimizados
        // - Configurações de conexão com banco de dados
    }
}
