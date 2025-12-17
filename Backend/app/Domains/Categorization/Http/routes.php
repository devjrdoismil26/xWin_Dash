<?php

use App\Domains\Categorization\Http\Controllers\TagController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'project.active'])->prefix('api/v1/categorization')
    ->name('categorization.v1.')->group(function () {
        Route::apiResource('tags', TagController::class);
        // Adicione outras rotas de API de Categorization aqui
    });
