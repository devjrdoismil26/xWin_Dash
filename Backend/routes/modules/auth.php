<?php

/*
|--------------------------------------------------------------------------
| 🔐 Auth Web Routes
|--------------------------------------------------------------------------
|
| Rotas web para autenticação
| Inclui login, registro e recuperação de senha
|
| SECURITY FIX (ROUTES-001): 
| - Rotas de token e logout protegidas com auth:sanctum
| - Rotas de login e reset password são públicas (intencionalmente)
|
*/

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ========================================
// 🔐 AUTH ROUTES (Web específicas - Públicas)
// ========================================

// Página de sucesso após ação de auth
Route::get('/auth/success', function () {
    return Inertia::render('Auth/Success');
})->name('auth.success');

// ========================================
// 🔐 AUTH API ROUTES - Login/Register (Públicas)
// ========================================

Route::prefix('auth')->name('auth.')->group(function () {
    // Login é público
    Route::post('/login', [\App\Domains\Auth\Http\Controllers\AuthController::class, 'login'])
        ->name('login');
});

// ========================================
// 🔐 AUTH API ROUTES - Autenticadas
// ========================================

Route::middleware(['auth:sanctum'])->prefix('auth')->name('auth.')->group(function () {
    Route::post('/logout', [\App\Domains\Auth\Http\Controllers\AuthController::class, 'logout'])
        ->name('logout');
    
    Route::get('/me', [\App\Domains\Auth\Http\Controllers\AuthController::class, 'me'])
        ->name('me');
});

// ========================================
// 🔐 AUTH TOKEN ROUTES (Protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('auth/tokens')->name('auth.tokens.')->group(function () {
    Route::get('/', [\App\Domains\Auth\Http\Controllers\TokenController::class, 'index'])
        ->name('index');
    
    Route::post('/', [\App\Domains\Auth\Http\Controllers\TokenController::class, 'store'])
        ->name('store');
    
    Route::delete('/{id}', [\App\Domains\Auth\Http\Controllers\TokenController::class, 'destroy'])
        ->name('destroy');
});

// ========================================
// 🔐 AUTH PASSWORD ROUTES (Públicas - reset flow)
// ========================================

Route::prefix('auth/password')->name('auth.password.')->group(function () {
    Route::post('/reset-link', [\App\Domains\Auth\Http\Controllers\PasswordResetLinkController::class, 'store'])
        ->name('reset-link');
    
    Route::post('/reset', [\App\Domains\Auth\Http\Controllers\NewPasswordController::class, 'store'])
        ->name('reset');
});

// Confirmação de senha requer autenticação
Route::middleware(['auth:sanctum'])->prefix('auth/password')->name('auth.password.')->group(function () {
    Route::post('/confirm', [\App\Domains\Auth\Http\Controllers\ConfirmablePasswordController::class, 'store'])
        ->name('confirm');
});

// ========================================
// 🔐 AUTH EMAIL VERIFICATION ROUTES (Mistas)
// ========================================

Route::prefix('auth/email')->name('auth.email.')->group(function () {
    // Verificação de email usa signed URL (público)
    Route::get('/verify/{id}/{hash}', [\App\Domains\Auth\Http\Controllers\VerifyEmailController::class, 'verify'])
        ->name('verify')
        ->middleware('signed');
});

Route::middleware(['auth:sanctum'])->prefix('auth/email')->name('auth.email.')->group(function () {
    // Reenvio de verificação requer auth
    Route::post('/verification-notification', [\App\Domains\Auth\Http\Controllers\EmailVerificationNotificationController::class, 'store'])
        ->name('verification-notification');
});
