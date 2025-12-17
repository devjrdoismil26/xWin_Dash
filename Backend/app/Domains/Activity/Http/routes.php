<?php

use App\Domains\Activity\Http\Controllers\ActivityLogController;
use App\Domains\Activity\Http\Controllers\ActivityStatsController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->prefix('api/v1/activity')->name('activity.v1.')->group(function () {
    // Activity logs
    Route::get('logs', [ActivityLogController::class, 'index'])->name('logs.index');
    Route::get('logs/{id}', [ActivityLogController::class, 'show'])->name('logs.show');
    Route::delete('logs/{id}', [ActivityLogController::class, 'destroy'])->name('logs.destroy');
    
    // Bulk operations
    Route::post('logs/bulk-delete', [ActivityLogController::class, 'bulkDelete'])->name('logs.bulk-delete');
    Route::delete('logs/clear', [ActivityLogController::class, 'clear'])->name('logs.clear');
    
    // Filters
    Route::get('logs/filters', [ActivityLogController::class, 'getFilters'])->name('logs.filters');
    
    // Real-time
    Route::get('logs/realtime', [ActivityLogController::class, 'getRealtime'])->name('logs.realtime');
    Route::get('logs/stream', [ActivityLogController::class, 'stream'])->name('logs.stream');
    
    // User activity
    Route::get('logs/user/{userId}', [ActivityLogController::class, 'getUserActivity'])->name('logs.user');
    Route::get('logs/user/{userId}/stats', [ActivityLogController::class, 'getUserStats'])->name('logs.user.stats');
    
    // System health
    Route::get('logs/system-health', [ActivityLogController::class, 'getSystemHealth'])->name('logs.system-health');
    
    // Stats
    Route::get('stats', [ActivityLogController::class, 'stats'])->name('stats');
    Route::get('stats/users', [ActivityStatsController::class, 'byUser'])->name('stats.users');
    Route::get('stats/trends', [ActivityStatsController::class, 'trends'])->name('stats.trends');
    Route::get('stats/overview', [ActivityStatsController::class, 'overview'])->name('stats.overview');
    
    // Export
    Route::post('export', [ActivityLogController::class, 'export'])->name('export');
    
    // Timeline & Recent
    Route::get('timeline', [ActivityLogController::class, 'index'])->name('timeline');
    Route::get('recent', [ActivityLogController::class, 'index'])->name('recent');
});
