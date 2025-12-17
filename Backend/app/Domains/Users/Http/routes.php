<?php

use Illuminate\Support\Facades\Route;

// ✅ PUBLIC ROUTES - Registro de usuários
Route::prefix('api/v1/users')->name('users.v1.')->group(function () {
    Route::post('register', [\App\Domains\Users\Http\Controllers\UserController::class, 'register'])->name('register');
});

// ✅ PROTECTED ROUTES - Gerenciamento de usuários
Route::middleware(['auth:sanctum', 'project.active'])->prefix('api/v1/users')->name('users.v1.')->group(function () {
    
    // ✅ USER MANAGEMENT - CRUD completo de usuários
    Route::apiResource('users', \App\Domains\Users\Http\Controllers\Api\UsersApiController::class);
    
    // ✅ USER SEARCH - Busca de usuários
    Route::get('search', [\App\Domains\Users\Http\Controllers\Api\UsersApiController::class, 'search'])->name('search');
    
    // ✅ USER FILTERS - Filtros específicos
    Route::get('by-role/{role}', [\App\Domains\Users\Http\Controllers\Api\UsersApiController::class, 'getByRole'])->name('by-role');
    Route::get('by-status/{status}', [\App\Domains\Users\Http\Controllers\Api\UsersApiController::class, 'getByStatus'])->name('by-status');
    
    // ✅ USER ACTIONS - Ações específicas
    Route::patch('users/{user}/status', [\App\Domains\Users\Http\Controllers\Api\UsersApiController::class, 'updateStatus'])->name('update-status');
    Route::patch('users/{user}/role', [\App\Domains\Users\Http\Controllers\Api\UsersApiController::class, 'updateRole'])->name('update-role');
    Route::post('users/{user}/reset-password', [\App\Domains\Users\Http\Controllers\Api\UsersApiController::class, 'resetPassword'])->name('reset-password');
    Route::post('users/{user}/send-verification', [\App\Domains\Users\Http\Controllers\Api\UsersApiController::class, 'sendVerificationEmail'])->name('send-verification');
    
    // ✅ USER STATISTICS - Estatísticas
    Route::get('statistics', [\App\Domains\Users\Http\Controllers\Api\UsersApiController::class, 'getStatistics'])->name('statistics');
    
    // ✅ BULK OPERATIONS - Operações em lote
    Route::post('bulk-update', [\App\Domains\Users\Http\Controllers\Api\UsersApiController::class, 'bulkUpdate'])->name('bulk-update');
    Route::post('bulk-delete', [\App\Domains\Users\Http\Controllers\Api\UsersApiController::class, 'bulkDelete'])->name('bulk-delete');
    
    // ✅ IMPORT/EXPORT - Importação e exportação
    Route::get('export', [\App\Domains\Users\Http\Controllers\Api\UsersApiController::class, 'export'])->name('export');
    Route::post('import', [\App\Domains\Users\Http\Controllers\Api\UsersApiController::class, 'import'])->name('import');
    
    // ✅ USER PREFERENCES - Preferências do usuário
    Route::prefix('users/{user}/preferences')->name('users.preferences.')->group(function () {
        Route::get('/', [\App\Domains\Users\Http\Controllers\UserController::class, 'getPreferences'])->name('index');
        Route::put('/', [\App\Domains\Users\Http\Controllers\UserController::class, 'updatePreferences'])->name('update');
    });
    
    // ✅ USER ACTIVITY - Atividade do usuário
    Route::prefix('users/{user}/activity')->name('users.activity.')->group(function () {
        Route::get('/', [\App\Domains\Users\Http\Controllers\UserController::class, 'getActivity'])->name('index');
    });

    // ✅ NOTIFICATIONS - Notificações
    Route::prefix('notifications')->name('notifications.')->group(function () {
        Route::get('/', [\App\Domains\Users\Http\Controllers\NotificationController::class, 'index'])->name('index');
        Route::get('unread', [\App\Domains\Users\Http\Controllers\NotificationController::class, 'unread'])->name('unread');
        Route::patch('{id}/mark-as-read', [\App\Domains\Users\Http\Controllers\NotificationController::class, 'markAsRead'])->name('mark-as-read');
        Route::post('mark-all-as-read', [\App\Domains\Users\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('mark-all-as-read');
        Route::delete('{id}', [\App\Domains\Users\Http\Controllers\NotificationController::class, 'destroy'])->name('destroy');
        Route::post('delete-all', [\App\Domains\Users\Http\Controllers\NotificationController::class, 'destroyAll'])->name('destroy-all');
    });
});
