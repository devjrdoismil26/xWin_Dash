<?php

/*
|--------------------------------------------------------------------------
| 🔗 External Integrations Web Routes
|--------------------------------------------------------------------------
|
| Rotas web para gerenciamento de integrações externas
| Inclui monitoramento, analytics e function calling
|
| SECURITY FIX (ROUTES-001): Todas as rotas protegidas com auth:sanctum
|
*/

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ========================================
// 🔗 EXTERNAL INTEGRATIONS ROUTES (Protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('external-integrations')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('ExternalIntegrations/Dashboard');
    })->name('external-integrations.dashboard');
    
    Route::get('/monitoring', function () {
        return Inertia::render('ExternalIntegrations/Monitoring');
    })->name('external-integrations.monitoring');
    
    Route::get('/analytics', function () {
        return Inertia::render('ExternalIntegrations/Analytics');
    })->name('external-integrations.analytics');
});

// ========================================
// 🔗 EXTERNAL INTEGRATIONS API ROUTES (Protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('api/external-integrations')->name('api.external-integrations.')->group(function () {
    // Status e monitoramento
    Route::get('/status', [\App\Http\Controllers\ExternalIntegrationsController::class, 'getStatus'])
        ->name('status');
    
    Route::get('/logs', [\App\Http\Controllers\ExternalIntegrationsController::class, 'getLogs'])
        ->name('logs');
    
    Route::post('/test-connectivity', [\App\Http\Controllers\ExternalIntegrationsController::class, 'testConnectivity'])
        ->name('test-connectivity');
    
    // Rate Limiting
    Route::get('/rate-limits', [\App\Http\Controllers\ExternalIntegrationsController::class, 'getRateLimitStats'])
        ->name('rate-limits');
    
    // Circuit Breaker
    Route::get('/circuit-breakers', [\App\Http\Controllers\ExternalIntegrationsController::class, 'getCircuitBreakerStatus'])
        ->name('circuit-breakers');
    
    Route::post('/circuit-breakers/reset', [\App\Http\Controllers\ExternalIntegrationsController::class, 'resetCircuitBreaker'])
        ->name('circuit-breakers.reset');
    
    // Analytics
    Route::get('/analytics/aggregated', [\App\Http\Controllers\ExternalIntegrationsController::class, 'getAggregatedMetrics'])
        ->name('analytics.aggregated');
    
    Route::get('/analytics/performance-report', [\App\Http\Controllers\ExternalIntegrationsController::class, 'getPerformanceReport'])
        ->name('analytics.performance-report');
    
    // Content Scheduling
    Route::get('/scheduling/optimal-times', [\App\Http\Controllers\ExternalIntegrationsController::class, 'getOptimalTimes'])
        ->name('scheduling.optimal-times');
    
    Route::get('/scheduling/stats', [\App\Http\Controllers\ExternalIntegrationsController::class, 'getSchedulingStats'])
        ->name('scheduling.stats');
    
    // Function Calling
    Route::get('/function-calling/functions', [\App\Http\Controllers\ExternalIntegrationsController::class, 'getAvailableFunctions'])
        ->name('function-calling.functions');
    
    Route::post('/function-calling/execute', [\App\Http\Controllers\ExternalIntegrationsController::class, 'executeFunction'])
        ->name('function-calling.execute');
});
