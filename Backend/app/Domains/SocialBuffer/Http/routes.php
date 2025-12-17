<?php

use App\Domains\SocialBuffer\Http\Controllers\EngagementController;
use App\Domains\SocialBuffer\Http\Controllers\HashtagController;
use App\Domains\SocialBuffer\Http\Controllers\LinkShortenerController;
use App\Domains\SocialBuffer\Http\Controllers\MediaController;
use App\Domains\SocialBuffer\Http\Controllers\PostController;
use App\Domains\SocialBuffer\Http\Controllers\ScheduleController;
use App\Domains\SocialBuffer\Http\Controllers\SocialAccountController;
use Illuminate\Support\Facades\Route;

// Rotas para o domínio SocialBuffer (Gerenciamento de Redes Sociais)
// Todas as rotas aqui estarão sob o prefixo 'api/social-buffer' e protegidas por autenticação.
Route::middleware(['auth:sanctum', 'project.active'])->prefix('api/v1/social-buffer')->name('social-buffer.v1.')->group(function () {

    // Rotas para SocialAccountController
    Route::apiResource('social-accounts', SocialAccountController::class);
    Route::post('social-accounts/{social_account}/refresh-token', [SocialAccountController::class, 'refreshToken']);
    Route::post('social-accounts/{social_account}/disconnect', [SocialAccountController::class, 'disconnect']);

    // Rotas para PostController
    Route::apiResource('posts', PostController::class);
    Route::post('posts/{post}/publish-immediately', [PostController::class, 'publishImmediately']);
    Route::post('posts/{post}/schedule', [PostController::class, 'schedule']);
    Route::post('posts/generate-content', [PostController::class, 'generateContent']);

    // Rotas para ScheduleController
    Route::apiResource('schedules', ScheduleController::class);
    Route::post('schedules/{schedule}/retry', [ScheduleController::class, 'retry']);
    Route::post('schedules/{schedule}/cancel', [ScheduleController::class, 'cancel']);

    // Rotas para HashtagController
    Route::apiResource('hashtags', HashtagController::class);
    Route::get('hashtags/suggest', [HashtagController::class, 'suggest']);

    // Rotas para LinkShortenerController
    Route::apiResource('shortened-links', LinkShortenerController::class);
    Route::post('shorten-link', [LinkShortenerController::class, 'shorten']);

    // Rotas para MediaController
    Route::apiResource('media', MediaController::class);
    Route::post('media/upload', [MediaController::class, 'upload']);

    // Rotas para EngagementController
    Route::get('engagement/overview', [EngagementController::class, 'overview']);
    Route::get('engagement/post/{post}', [EngagementController::class, 'postEngagement']);
});
