<?php

declare(strict_types=1);

/*
|--------------------------------------------------------------------------
| Core Domain Routes
|--------------------------------------------------------------------------
|
| Routes específicas do domínio Core.
| Este arquivo é requerido pelo RouteServiceProvider do Core.
|
*/

use App\Domains\Core\Http\Controllers\NotificationController;
use App\Domains\Core\Http\Controllers\SettingController;
use App\Domains\Core\Http\Controllers\IntegrationController;
use App\Domains\Core\Http\Controllers\CacheController;
use Illuminate\Support\Facades\Route;

Route::prefix('api/v1/core')->middleware(['auth:sanctum'])->group(function () {
    
    // ✅ Rotas de Notificações
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index'])->name('core.notifications.index');
        Route::post('/{id}/mark-read', [NotificationController::class, 'markAsRead'])->name('core.notifications.mark-read');
        Route::delete('/{id}', [NotificationController::class, 'destroy'])->name('core.notifications.destroy');
        Route::post('/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('core.notifications.mark-all-read');
        Route::get('/stats', [NotificationController::class, 'stats'])->name('core.notifications.stats');
    });
    
    // ✅ Rotas de Configurações
    Route::prefix('settings')->group(function () {
        Route::get('/', [SettingController::class, 'index'])->name('core.settings.index');
        Route::post('/', [SettingController::class, 'store'])->name('core.settings.store');
        Route::get('/{key}', [SettingController::class, 'show'])->name('core.settings.show');
        Route::put('/{key}', [SettingController::class, 'update'])->name('core.settings.update');
        Route::delete('/{key}', [SettingController::class, 'destroy'])->name('core.settings.destroy');
        Route::get('/category/{category}', [SettingController::class, 'getByCategory'])->name('core.settings.category');
    });
    
    // ✅ Rotas de Integrações
    Route::prefix('integrations')->group(function () {
        Route::get('/', [IntegrationController::class, 'index'])->name('core.integrations.index');
        Route::post('/', [IntegrationController::class, 'store'])->name('core.integrations.store');
        Route::get('/{id}', [IntegrationController::class, 'show'])->name('core.integrations.show');
        Route::put('/{id}', [IntegrationController::class, 'update'])->name('core.integrations.update');
        Route::delete('/{id}', [IntegrationController::class, 'destroy'])->name('core.integrations.destroy');
        Route::post('/{id}/sync', [IntegrationController::class, 'sync'])->name('core.integrations.sync');
        Route::get('/{id}/logs', [IntegrationController::class, 'getSyncLogs'])->name('core.integrations.logs');
        Route::post('/{id}/test', [IntegrationController::class, 'testConnection'])->name('core.integrations.test');
    });
    
    // ✅ Rotas de Cache
    Route::prefix('cache')->group(function () {
        Route::get('/', [CacheController::class, 'index'])->name('core.cache.index');
        Route::post('/', [CacheController::class, 'store'])->name('core.cache.store');
        Route::get('/{key}', [CacheController::class, 'show'])->name('core.cache.show');
        Route::put('/{key}', [CacheController::class, 'update'])->name('core.cache.update');
        Route::delete('/{key}', [CacheController::class, 'destroy'])->name('core.cache.destroy');
        Route::post('/clear', [CacheController::class, 'clear'])->name('core.cache.clear');
        Route::post('/clear-pattern', [CacheController::class, 'clearByPattern'])->name('core.cache.clear-pattern');
    });
    
    // ✅ Rotas de Sistema
    Route::prefix('system')->group(function () {
        Route::get('/health', function () {
            return response()->json([
                'status' => 'healthy',
                'timestamp' => now()->toISOString(),
                'version' => config('app.version', '1.0.0')
            ]);
        })->name('core.system.health');
        
        Route::get('/info', function () {
            return response()->json([
                'app_name' => config('app.name'),
                'app_env' => config('app.env'),
                'app_debug' => config('app.debug'),
                'php_version' => PHP_VERSION,
                'laravel_version' => app()->version(),
                'memory_usage' => memory_get_usage(true),
                'memory_peak' => memory_get_peak_usage(true)
            ]);
        })->name('core.system.info');
    });
});
