<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Route Manager API Routes
|--------------------------------------------------------------------------
|
| Route management system routes
|
| SECURITY FIX (ROUTES-001): Todas as rotas protegidas com auth:sanctum
| NOTA: Essas rotas são administrativas e devem ser restritas a admins
|
*/

// ========================================
// 🚀 ROUTE MANAGER ROUTES - Sistema de Gerenciamento (Protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('route-manager')->name('api.route-manager.')->group(function () {
    // Estatísticas e informações
    Route::get('/stats', [\App\Http\Controllers\Api\RouteManagerController::class, 'stats'])->name('stats');
    Route::get('/modules', [\App\Http\Controllers\Api\RouteManagerController::class, 'modules'])->name('modules');
    Route::get('/modules/{module}', [\App\Http\Controllers\Api\RouteManagerController::class, 'moduleInfo'])->name('module.info');
    Route::get('/health', [\App\Http\Controllers\Api\RouteManagerController::class, 'healthCheck'])->name('health');
    Route::get('/performance', [\App\Http\Controllers\Api\RouteManagerController::class, 'performance'])->name('performance');
    Route::get('/config', [\App\Http\Controllers\Api\RouteManagerController::class, 'config'])->name('config');
    
    // Ações de gerenciamento (somente admin)
    Route::post('/modules/{module}/toggle', [\App\Http\Controllers\Api\RouteManagerController::class, 'toggleModule'])->name('module.toggle');
    Route::post('/cache/clear', [\App\Http\Controllers\Api\RouteManagerController::class, 'clearCache'])->name('cache.clear');
    Route::post('/reload', [\App\Http\Controllers\Api\RouteManagerController::class, 'reload'])->name('reload');
});
