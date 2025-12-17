<?php

use App\Domains\Analytics\Http\Controllers\ExportController;
use App\Domains\Analytics\Http\Controllers\KPIsController;
use App\Domains\Analytics\Http\Controllers\MetricsController;
use App\Domains\Analytics\Http\Controllers\ReportsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Analytics API Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum'])->prefix('analytics')->group(function () {
    
    // Metrics
    Route::prefix('metrics')->name('analytics.metrics.')->group(function () {
        Route::get('/', [MetricsController::class, 'index'])->name('index');
        Route::post('/calculate', [MetricsController::class, 'calculate'])->name('calculate');
        Route::get('/{id}', [MetricsController::class, 'show'])->name('show');
    });

    // KPIs
    Route::prefix('kpis')->name('analytics.kpis.')->group(function () {
        Route::get('/', [KPIsController::class, 'index'])->name('index');
        Route::post('/', [KPIsController::class, 'store'])->name('store');
        Route::put('/{id}', [KPIsController::class, 'update'])->name('update');
        Route::delete('/{id}', [KPIsController::class, 'destroy'])->name('destroy');
    });

    // Reports
    Route::prefix('reports')->name('analytics.reports.')->group(function () {
        Route::get('/', [ReportsController::class, 'index'])->name('index');
        Route::post('/generate', [ReportsController::class, 'generate'])->name('generate');
        Route::get('/{id}', [ReportsController::class, 'show'])->name('show');
        Route::delete('/{id}', [ReportsController::class, 'destroy'])->name('destroy');
    });

    // Export
    Route::prefix('export')->name('analytics.export.')->group(function () {
        Route::post('/csv', [ExportController::class, 'csv'])->name('csv');
        Route::post('/pdf', [ExportController::class, 'pdf'])->name('pdf');
        Route::post('/excel', [ExportController::class, 'excel'])->name('excel');
    });

    // Trends (usando MetricsController)
    Route::get('/trends', [MetricsController::class, 'index'])->name('analytics.trends');
});
