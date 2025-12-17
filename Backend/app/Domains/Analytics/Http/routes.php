<?php

use App\Domains\Analytics\Http\Controllers\AnalyticsController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'project.active'])->prefix('api/v1/analytics')->name('analytics.v1.')->group(function () {
    Route::get('summary', [AnalyticsController::class, 'getSummary']);
    Route::get('detailed-report', [AnalyticsController::class, 'getDetailedReport']);
    // Adicione outras rotas de API do Analytics aqui
});
