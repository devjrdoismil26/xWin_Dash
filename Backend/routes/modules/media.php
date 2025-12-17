<?php

/*
|--------------------------------------------------------------------------
| 📁 Media API Routes
|--------------------------------------------------------------------------
|
| Rotas API para gerenciamento de mídia
| Inclui endpoints para upload, organização e manipulação de arquivos
|
| SECURITY FIX (SEC-002): Todas as rotas API agora protegidas com auth:sanctum
|
*/

use Illuminate\Support\Facades\Route;

// ========================================
// 📁 MEDIA API ROUTES (PROTEGIDAS)
// ========================================
// SECURITY: Middleware auth:sanctum aplicado para proteger todas as rotas API

Route::middleware(['auth:sanctum'])->prefix('media/api')->name('media.api.')->group(function () {
    
    // Library endpoint
    Route::get('/library', [\App\Domains\Media\Http\Controllers\LibraryController::class, 'library'])
        ->name('library');
    
    // Media endpoints
    Route::get('/media', [\App\Domains\Media\Http\Controllers\MediaController::class, 'index'])
        ->name('media.index');
    
    Route::post('/media', [\App\Domains\Media\Http\Controllers\MediaController::class, 'store'])
        ->name('media.store');
    
    Route::get('/media/{id}', [\App\Domains\Media\Http\Controllers\MediaController::class, 'show'])
        ->name('media.show');
    
    Route::put('/media/{id}', [\App\Domains\Media\Http\Controllers\MediaController::class, 'update'])
        ->name('media.update');
    
    Route::delete('/media/{id}', [\App\Domains\Media\Http\Controllers\MediaController::class, 'destroy'])
        ->name('media.destroy');
    
    Route::post('/media/optimize', [\App\Domains\Media\Http\Controllers\MediaController::class, 'optimize'])
        ->name('media.optimize');
    
    Route::post('/media/bulk-delete', [\App\Domains\Media\Http\Controllers\MediaController::class, 'bulkDelete'])
        ->name('media.bulkDelete');
    
    // AI endpoints
    Route::post('/media/{id}/ai/tags', [\App\Domains\Media\Http\Controllers\MediaController::class, 'generateAITags'])
        ->name('media.ai.tags');
    
    Route::post('/media/{id}/ai/description', [\App\Domains\Media\Http\Controllers\MediaController::class, 'generateAIDescription'])
        ->name('media.ai.description');
    
    Route::post('/media/{id}/ai/detect-objects', [\App\Domains\Media\Http\Controllers\MediaController::class, 'detectObjects'])
        ->name('media.ai.detectObjects');
    
    Route::post('/media/{id}/ai/recognize-faces', [\App\Domains\Media\Http\Controllers\MediaController::class, 'recognizeFaces'])
        ->name('media.ai.recognizeFaces');
    
    Route::post('/media/{id}/ai/extract-text', [\App\Domains\Media\Http\Controllers\MediaController::class, 'extractText'])
        ->name('media.ai.extractText');
    
    Route::post('/media/{id}/ai/categorize', [\App\Domains\Media\Http\Controllers\MediaController::class, 'categorizeMedia'])
        ->name('media.ai.categorize');
    
    // Folder endpoints
    Route::get('/folders', [\App\Domains\Media\Http\Controllers\FolderController::class, 'index'])
        ->name('folders.index');
    
    Route::post('/folders', [\App\Domains\Media\Http\Controllers\FolderController::class, 'store'])
        ->name('folders.store');
    
    Route::put('/folders/{id}', [\App\Domains\Media\Http\Controllers\FolderController::class, 'update'])
        ->name('folders.update');
    
    Route::delete('/folders/{id}', [\App\Domains\Media\Http\Controllers\FolderController::class, 'destroy'])
        ->name('folders.destroy');
    
    Route::post('/folders/move', [\App\Domains\Media\Http\Controllers\FolderController::class, 'move'])
        ->name('folders.move');
});
