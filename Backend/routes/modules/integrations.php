<?php

/*
|--------------------------------------------------------------------------
| 🔗 Integrations API Routes
|--------------------------------------------------------------------------
*/

use Illuminate\Support\Facades\Route;
use App\Domains\Integrations\Http\Controllers\IntegrationController;

Route::middleware(['auth:sanctum'])->prefix('integrations')->name('integrations.')->group(function () {
    
    // CRUD Operations
    Route::get('/', [IntegrationController::class, 'index'])->name('index');
    Route::post('/', [IntegrationController::class, 'store'])->name('store');
    Route::get('/{id}', [IntegrationController::class, 'show'])->name('show');
    Route::put('/{id}', [IntegrationController::class, 'update'])->name('update');
    Route::delete('/{id}', [IntegrationController::class, 'destroy'])->name('destroy');
    
    // Integration Actions
    Route::post('/{id}/test-connection', [IntegrationController::class, 'testConnection'])->name('test-connection');
    Route::post('/{id}/sync', [IntegrationController::class, 'sync'])->name('sync');
    Route::get('/{id}/logs', [IntegrationController::class, 'logs'])->name('logs');
    Route::get('/{id}/status', [IntegrationController::class, 'status'])->name('status');
});
