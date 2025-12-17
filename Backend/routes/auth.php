<?php

use App\Domains\Auth\Http\Controllers\AuthController;
use App\Domains\Auth\Http\Controllers\EmailVerificationNotificationController;
use App\Domains\Auth\Http\Controllers\NewPasswordController;
use App\Domains\Auth\Http\Controllers\PasswordResetLinkController;
use App\Domains\Auth\Http\Controllers\RegisteredUserController;
use App\Domains\Auth\Http\Controllers\VerifyEmailController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [RegisteredUserController::class, 'store'])->name('register');
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])->name('password.email');
Route::post('/reset-password', [NewPasswordController::class, 'store'])->name('password.store');

// Email verification link (the user clicks this from their email)
// This route must remain under the 'auth' middleware because Laravel's EmailVerificationRequest requires an authenticated user.
// The signature middleware provides a temporary, secure way to authenticate the user for this single action.
Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)
    ->middleware(['auth', 'signed', 'throttle:6,1'])
    ->name('verification.verify');

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::get('/me', [AuthController::class, 'me'])->name('me');

    Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');
});
