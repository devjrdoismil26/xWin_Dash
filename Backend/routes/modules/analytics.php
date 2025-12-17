<?php

/*
|--------------------------------------------------------------------------
| 📈 Analytics Web Routes
|--------------------------------------------------------------------------
|
| Rotas web para análise de dados e relatórios
| Inclui dashboards e métricas avançadas
|
| SECURITY FIX (ROUTES-001): Todas as rotas protegidas com auth:sanctum
|
*/

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ========================================
// 📈 ANALYTICS ROUTES (Páginas Web - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('analytics')->group(function () {
    Route::get('/overview', function () {
        return Inertia::render('Analytics/Overview');
    })->name('analytics.overview');
    
    Route::get('/reports', function () {
        return Inertia::render('Analytics/Reports');
    })->name('analytics.reports');
    
    Route::get('/custom', function () {
        return Inertia::render('Analytics/Custom');
    })->name('analytics.custom');
});

// ========================================
// 📊 ANALYTICS DATA ROUTES (API - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('analytics')->name('analytics.')->group(function () {
    Route::get('/report-data', [\App\Domains\Analytics\Http\Controllers\AnalyticsController::class, 'getReportData'])
        ->name('report-data');
    
    Route::get('/summary', [\App\Domains\Analytics\Http\Controllers\AnalyticsController::class, 'getSummary'])
        ->name('summary');
    
    Route::get('/detailed-report', [\App\Domains\Analytics\Http\Controllers\AnalyticsController::class, 'getDetailedReport'])
        ->name('detailed-report');
    
    Route::get('/dashboard', [\App\Domains\Analytics\Http\Controllers\AnalyticsController::class, 'getDashboard'])
        ->name('dashboard');
    
    Route::get('/metrics', [\App\Domains\Analytics\Http\Controllers\AnalyticsController::class, 'getMetrics'])
        ->name('metrics');
    
    Route::get('/insights', [\App\Domains\Analytics\Http\Controllers\AnalyticsController::class, 'getInsights'])
        ->name('insights');
    
    Route::get('/google-analytics', [\App\Domains\Analytics\Http\Controllers\AnalyticsController::class, 'getGoogleAnalytics'])
        ->name('google-analytics');
    
    Route::post('/export', [\App\Domains\Analytics\Http\Controllers\AnalyticsController::class, 'export'])
        ->name('export');
});

// ========================================
// 📊 ANALYTICS API ROUTES (Frontend React - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('analytics/api')->name('analytics.api.')->group(function () {
    Route::get('/dashboard', [\App\Domains\Analytics\Http\Controllers\DashboardController::class, 'dashboard'])
        ->name('dashboard');
    
    Route::get('/manager', [\App\Domains\Analytics\Http\Controllers\DashboardController::class, 'manager'])
        ->name('manager');
    
    Route::get('/reports/{id}', [\App\Domains\Analytics\Http\Controllers\DashboardController::class, 'report'])
        ->name('reports.show');
});
