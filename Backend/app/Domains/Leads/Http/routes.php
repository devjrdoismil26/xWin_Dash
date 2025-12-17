<?php

use App\Domains\Leads\Http\Controllers\LeadController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'project.active'])->prefix('api/v1/leads')->name('leads.v1.')->group(function () {
    Route::apiResource('leads', LeadController::class);
    // Adicione outras rotas de API de Leads aqui
});
