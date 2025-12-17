<?php

use App\Domains\Projects\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->prefix('api/v1/projects')->name('projects.v1.')->group(function () {
    Route::apiResource('projects', ProjectController::class);
    Route::post('projects/{project}/set-active', [ProjectController::class, 'setActiveProject'])->name('set-active');
    // Adicione outras rotas de API de Projects aqui
});
