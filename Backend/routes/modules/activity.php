<?php

/*
|--------------------------------------------------------------------------
| 📊 Activity Web Routes
|--------------------------------------------------------------------------
|
| Rotas web para log de atividades
| Inclui histórico e auditoria
|
| SECURITY FIX (ROUTES-001): Todas as rotas protegidas com auth:sanctum
|
*/

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ========================================
// 📊 ACTIVITY ROUTES (Páginas Web - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/activity-log', function () {
        return Inertia::render('Activity/Log');
    })->name('activity.log');

    Route::get('/activity/audit', function () {
        return Inertia::render('Activity/Audit');
    })->name('activity.audit');
});

// ========================================
// 📊 ACTIVITY LOG ROUTES (API - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('activity')->name('activity.')->group(function () {
    Route::get('/', [\App\Domains\Activity\Http\Controllers\ActivityLogController::class, 'index'])
        ->name('index');
    
    Route::get('/stats', [\App\Domains\Activity\Http\Controllers\ActivityLogController::class, 'stats'])
        ->name('stats');
    
    Route::get('/filters', [\App\Domains\Activity\Http\Controllers\ActivityLogController::class, 'getFilters'])
        ->name('filters');
    
    Route::get('/realtime', [\App\Domains\Activity\Http\Controllers\ActivityLogController::class, 'getRealtime'])
        ->name('realtime');
    
    Route::get('/system-health', [\App\Domains\Activity\Http\Controllers\ActivityLogController::class, 'getSystemHealth'])
        ->name('system-health');
    
    Route::get('/stream', [\App\Domains\Activity\Http\Controllers\ActivityLogController::class, 'stream'])
        ->name('stream');
    
    Route::get('/user/{userId}', [\App\Domains\Activity\Http\Controllers\ActivityLogController::class, 'getUserActivity'])
        ->name('user-activity');
    
    Route::get('/user/{userId}/stats', [\App\Domains\Activity\Http\Controllers\ActivityLogController::class, 'getUserStats'])
        ->name('user-stats');
    
    Route::post('/export', [\App\Domains\Activity\Http\Controllers\ActivityLogController::class, 'export'])
        ->name('export');
    
    Route::post('/bulk-delete', [\App\Domains\Activity\Http\Controllers\ActivityLogController::class, 'bulkDelete'])
        ->name('bulk-delete');
    
    Route::post('/clear', [\App\Domains\Activity\Http\Controllers\ActivityLogController::class, 'clear'])
        ->name('clear');
    
    Route::get('/{id}', [\App\Domains\Activity\Http\Controllers\ActivityLogController::class, 'show'])
        ->name('show');
    
    Route::delete('/{id}', [\App\Domains\Activity\Http\Controllers\ActivityLogController::class, 'destroy'])
        ->name('destroy');
});
