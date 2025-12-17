<?php

/*
|--------------------------------------------------------------------------
| 📊 Dashboard Web Routes
|--------------------------------------------------------------------------
|
| Rotas web para dashboard e widgets
| Inclui rotas para métricas e visualizações
|
| SECURITY FIX (SEC-001): Todas as rotas API agora protegidas com auth:sanctum
|
*/

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ========================================
// 📊 DASHBOARD ROUTES (Web Views - Protegidas pelo middleware global)
// ========================================

// Dashboard principal já está definido no web.php principal
// Aqui podemos adicionar rotas específicas do dashboard se necessário

// SECURITY: Todas as rotas web de dashboard protegidas
Route::middleware(['auth:sanctum'])->group(function () {
    // Widgets específicos
    Route::get('/dashboard/widgets', function () {
        return Inertia::render('Dashboard/Widgets');
    })->name('dashboard.widgets');

    // Métricas detalhadas
    Route::get('/dashboard/metrics', function () {
        return Inertia::render('Dashboard/Metrics');
    })->name('dashboard.metrics');

    // Atividades recentes
    Route::get('/dashboard/activities', function () {
        return Inertia::render('Dashboard/Activities');
    })->name('dashboard.activities');
});

// ========================================
// 📊 DASHBOARD API ROUTES (PROTEGIDAS)
// ========================================
// SECURITY: Middleware auth:sanctum aplicado para proteger todas as rotas API

Route::middleware(['auth:sanctum'])->prefix('dashboard/api')->name('dashboard.api.')->group(function () {
    
    // Complete dashboard data (Frontend React integration)
    Route::get('/data', [\App\Domains\Dashboard\Http\Controllers\DashboardController::class, 'getData'])
        ->name('data');

    // Métricas e dados
    Route::get('/metrics', [\App\Domains\Dashboard\Http\Controllers\DashboardController::class, 'getMetrics'])
        ->name('metrics');

    Route::get('/activities', [\App\Domains\Dashboard\Http\Controllers\DashboardController::class, 'getActivities'])
        ->name('activities');

    Route::get('/overview', [\App\Domains\Dashboard\Http\Controllers\DashboardController::class, 'getOverview'])
        ->name('overview');

    // Widgets
    Route::get('/widgets', [\App\Domains\Dashboard\Http\Controllers\DashboardController::class, 'getWidgets'])
        ->name('widgets');

    Route::get('/widgets/{id}', [\App\Domains\Dashboard\Http\Controllers\DashboardController::class, 'getWidget'])
        ->name('widgets.show');

    Route::post('/widgets', [\App\Domains\Dashboard\Http\Controllers\DashboardController::class, 'createWidget'])
        ->name('widgets.create');

    Route::put('/widgets/{id}', [\App\Domains\Dashboard\Http\Controllers\DashboardController::class, 'updateWidget'])
        ->name('widgets.update');

    Route::delete('/widgets/{id}', [\App\Domains\Dashboard\Http\Controllers\DashboardController::class, 'deleteWidget'])
        ->name('widgets.delete');

    Route::post('/widgets/{id}/refresh', [\App\Domains\Dashboard\Http\Controllers\DashboardController::class, 'refreshWidget'])
        ->name('widgets.refresh');

    Route::get('/widgets/{id}/data', [\App\Domains\Dashboard\Http\Controllers\DashboardController::class, 'getWidgetData'])
        ->name('widgets.data');

    // Layouts
    Route::get('/layouts', [\App\Domains\Dashboard\Http\Controllers\DashboardController::class, 'getLayouts'])
        ->name('layouts');

    Route::get('/layouts/{id}', [\App\Domains\Dashboard\Http\Controllers\DashboardController::class, 'getLayout'])
        ->name('layouts.show');

    Route::post('/layouts', [\App\Domains\Dashboard\Http\Controllers\DashboardController::class, 'saveLayout'])
        ->name('layouts.create');

    Route::put('/layouts/{id}', [\App\Domains\Dashboard\Http\Controllers\DashboardController::class, 'updateLayout'])
        ->name('layouts.update');

    Route::delete('/layouts/{id}', [\App\Domains\Dashboard\Http\Controllers\DashboardController::class, 'deleteLayout'])
        ->name('layouts.delete');

    Route::post('/layouts/{id}/set-default', [\App\Domains\Dashboard\Http\Controllers\DashboardController::class, 'setDefaultLayout'])
        ->name('layouts.set-default');

    // Export e Share
    Route::post('/export', [\App\Domains\Dashboard\Http\Controllers\DashboardController::class, 'exportDashboard'])
        ->name('export');

    Route::post('/share/{id}', [\App\Domains\Dashboard\Http\Controllers\DashboardController::class, 'shareDashboard'])
        ->name('share');

    // Alerts
    Route::get('/alerts', [\App\Domains\Dashboard\Http\Controllers\DashboardController::class, 'getAlerts'])
        ->name('alerts');

    Route::post('/alerts/{id}/read', [\App\Domains\Dashboard\Http\Controllers\DashboardController::class, 'markAlertAsRead'])
        ->name('alerts.read');

    Route::post('/alerts/read-all', [\App\Domains\Dashboard\Http\Controllers\DashboardController::class, 'markAllAlertsAsRead'])
        ->name('alerts.read-all');

    // Real-time
    Route::post('/subscribe', [\App\Domains\Dashboard\Http\Controllers\DashboardController::class, 'subscribeToUpdates'])
        ->name('subscribe');

    Route::post('/unsubscribe', [\App\Domains\Dashboard\Http\Controllers\DashboardController::class, 'unsubscribeFromUpdates'])
        ->name('unsubscribe');
});

// ========================================
// 📊 DASHBOARD SHARED ROUTES (PÚBLICAS - Apenas para visualização de dashboards compartilhados)
// ========================================
// NOTA: Esta rota é pública intencionalmente para permitir acesso via token de compartilhamento
Route::get('/dashboard/api/shared/{token}', [\App\Domains\Dashboard\Http\Controllers\DashboardController::class, 'getSharedDashboard'])
    ->name('dashboard.api.shared');
