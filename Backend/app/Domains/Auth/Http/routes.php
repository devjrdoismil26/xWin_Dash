<?php

use App\Domains\Auth\Http\Controllers\AuthController;
use App\Domains\Auth\Http\Controllers\AuthenticatedSessionController;
use App\Domains\Auth\Http\Controllers\ConfirmablePasswordController;
use App\Domains\Auth\Http\Controllers\EmailVerificationNotificationController;
use App\Domains\Auth\Http\Controllers\NewPasswordController;
use App\Domains\Auth\Http\Controllers\PasswordController;
use App\Domains\Auth\Http\Controllers\PasswordResetLinkController;
use App\Domains\Auth\Http\Controllers\SessionController;
use App\Domains\Auth\Http\Controllers\TokenController;
use App\Domains\Auth\Http\Controllers\VerifyEmailController;
use Illuminate\Support\Facades\Route;

// Authentication routes (public)
Route::prefix('api/v1/auth')->name('auth.v1.')->group(function () {
    
    // ✅ LOGIN - Autenticação
    Route::post('login', [AuthenticatedSessionController::class, 'store'])->name('login');

    // ✅ PASSWORD RESET - Recuperação de senha
    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');
    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');

    // ✅ EMAIL VERIFICATION - Verificação de email
    Route::get('verify-email/{id}/{hash}', [VerifyEmailController::class, '__invoke'])
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware(['auth:sanctum', 'throttle:6,1'])
        ->name('verification.send');
});

// Authenticated routes
Route::middleware(['auth:sanctum'])->prefix('api/v1/auth')->name('auth.v1.')->group(function () {
    
    // ✅ LOGOUT - Encerrar sessão
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    // ✅ PASSWORD MANAGEMENT - Gerenciamento de senha
    Route::put('password', [PasswordController::class, 'update'])->name('password.update');
    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store'])
        ->name('password.confirm');

    // ✅ TOKEN MANAGEMENT - Gerenciamento de tokens
    Route::get('tokens', [TokenController::class, 'index'])->name('tokens.index');
    Route::post('tokens', [TokenController::class, 'store'])->name('tokens.store');
    Route::delete('tokens/{id}', [TokenController::class, 'destroy'])->name('tokens.destroy');

    // ✅ USER INFO - Informações do usuário autenticado
    Route::get('user', [AuthController::class, 'user'])->name('user');
    Route::put('user', [AuthController::class, 'updateProfile'])->name('user.update');
    
    // ✅ PERMISSIONS - Permissões do usuário
    Route::get('permissions', [AuthController::class, 'getPermissions'])->name('permissions');
    
    // ✅ SESSIONS - Sessões do usuário
    Route::get('sessions', [SessionController::class, 'index'])->name('sessions.index');
    Route::delete('sessions/{id}', [SessionController::class, 'destroy'])->name('sessions.destroy');
    Route::delete('sessions', [SessionController::class, 'destroyAll'])->name('sessions.destroy-all');
});

