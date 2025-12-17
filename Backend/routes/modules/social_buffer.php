<?php

/*
|--------------------------------------------------------------------------
| 📱 Social Buffer Web Routes
|--------------------------------------------------------------------------
|
| Rotas web para gerenciamento de redes sociais
| Inclui agendamento e publicação de posts
|
| SECURITY FIX (ROUTES-001): Todas as rotas protegidas com auth:sanctum
|
*/

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ========================================
// 📱 SOCIAL BUFFER ROUTES (Protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->group(function () {
    // CRUD básico de posts
    Route::resource('social-buffer', \App\Domains\SocialBuffer\Http\Controllers\SocialBufferController::class);

    // Calendar
    Route::get('/social-buffer/calendar', function () {
        return Inertia::render('SocialBuffer/Calendar');
    })->name('social-buffer.calendar');

    // Analytics
    Route::get('/social-buffer/analytics', function () {
        return Inertia::render('SocialBuffer/Analytics');
    })->name('social-buffer.analytics');

    // Accounts Page
    Route::get('/social-buffer/accounts', function () {
        return Inertia::render('SocialBuffer/Accounts');
    })->name('social-buffer.accounts');
});

// ========================================
// 📱 SOCIAL ACCOUNTS ROUTES (API - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('social-buffer/accounts')->name('social-buffer.accounts.')->group(function () {
    Route::get('/', [\App\Domains\SocialBuffer\Http\Controllers\SocialAccountController::class, 'index'])
        ->name('index');
    
    Route::post('/', [\App\Domains\SocialBuffer\Http\Controllers\SocialAccountController::class, 'store'])
        ->name('store');
    
    Route::get('/{id}', [\App\Domains\SocialBuffer\Http\Controllers\SocialAccountController::class, 'show'])
        ->name('show');
    
    Route::put('/{id}', [\App\Domains\SocialBuffer\Http\Controllers\SocialAccountController::class, 'update'])
        ->name('update');
    
    Route::delete('/{id}', [\App\Domains\SocialBuffer\Http\Controllers\SocialAccountController::class, 'destroy'])
        ->name('destroy');
});

// ========================================
// 📱 SOCIAL POSTS ROUTES (API - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('social-buffer/posts')->name('social-buffer.posts.')->group(function () {
    Route::get('/', [\App\Domains\SocialBuffer\Http\Controllers\Api\PostController::class, 'index'])
        ->name('index');
    
    Route::post('/', [\App\Domains\SocialBuffer\Http\Controllers\Api\PostController::class, 'store'])
        ->name('store');
    
    Route::get('/{id}', [\App\Domains\SocialBuffer\Http\Controllers\Api\PostController::class, 'show'])
        ->name('show');
    
    Route::put('/{id}', [\App\Domains\SocialBuffer\Http\Controllers\Api\PostController::class, 'update'])
        ->name('update');
    
    Route::delete('/{id}', [\App\Domains\SocialBuffer\Http\Controllers\Api\PostController::class, 'destroy'])
        ->name('destroy');
});

// ========================================
// 📅 SOCIAL SCHEDULE ROUTES (API - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('social-buffer/schedule')->name('social-buffer.schedule.')->group(function () {
    Route::get('/', [\App\Domains\SocialBuffer\Http\Controllers\ScheduleController::class, 'index'])
        ->name('index');
    
    Route::post('/', [\App\Domains\SocialBuffer\Http\Controllers\ScheduleController::class, 'store'])
        ->name('store');
    
    Route::get('/{id}', [\App\Domains\SocialBuffer\Http\Controllers\ScheduleController::class, 'show'])
        ->name('show');
    
    Route::put('/{id}', [\App\Domains\SocialBuffer\Http\Controllers\ScheduleController::class, 'update'])
        ->name('update');
    
    Route::delete('/{id}', [\App\Domains\SocialBuffer\Http\Controllers\ScheduleController::class, 'destroy'])
        ->name('destroy');
});

// ========================================
// 📱 SOCIAL MEDIA ROUTES (API - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('social-buffer/media')->name('social-buffer.media.')->group(function () {
    Route::get('/', [\App\Domains\SocialBuffer\Http\Controllers\MediaController::class, 'index'])
        ->name('index');
    
    Route::post('/', [\App\Domains\SocialBuffer\Http\Controllers\MediaController::class, 'store'])
        ->name('store');
    
    Route::get('/{id}', [\App\Domains\SocialBuffer\Http\Controllers\MediaController::class, 'show'])
        ->name('show');
    
    Route::put('/{id}', [\App\Domains\SocialBuffer\Http\Controllers\MediaController::class, 'update'])
        ->name('update');
    
    Route::delete('/{id}', [\App\Domains\SocialBuffer\Http\Controllers\MediaController::class, 'destroy'])
        ->name('destroy');
});

// ========================================
// #️⃣ SOCIAL HASHTAGS ROUTES (API - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('social-buffer/hashtags')->name('social-buffer.hashtags.')->group(function () {
    Route::get('/', [\App\Domains\SocialBuffer\Http\Controllers\HashtagController::class, 'index'])
        ->name('index');
    
    Route::post('/', [\App\Domains\SocialBuffer\Http\Controllers\HashtagController::class, 'store'])
        ->name('store');
    
    Route::get('/{id}', [\App\Domains\SocialBuffer\Http\Controllers\HashtagController::class, 'show'])
        ->name('show');
    
    Route::put('/{id}', [\App\Domains\SocialBuffer\Http\Controllers\HashtagController::class, 'update'])
        ->name('update');
    
    Route::delete('/{id}', [\App\Domains\SocialBuffer\Http\Controllers\HashtagController::class, 'destroy'])
        ->name('destroy');
});

// ========================================
// 🔗 SOCIAL LINK SHORTENER ROUTES (API - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('social-buffer/links')->name('social-buffer.links.')->group(function () {
    Route::get('/', [\App\Domains\SocialBuffer\Http\Controllers\LinkShortenerController::class, 'index'])
        ->name('index');
    
    Route::post('/', [\App\Domains\SocialBuffer\Http\Controllers\LinkShortenerController::class, 'store'])
        ->name('store');
    
    Route::get('/{id}', [\App\Domains\SocialBuffer\Http\Controllers\LinkShortenerController::class, 'show'])
        ->name('show');
    
    Route::put('/{id}', [\App\Domains\SocialBuffer\Http\Controllers\LinkShortenerController::class, 'update'])
        ->name('update');
    
    Route::delete('/{id}', [\App\Domains\SocialBuffer\Http\Controllers\LinkShortenerController::class, 'destroy'])
        ->name('destroy');
});

// ========================================
// 📊 SOCIAL ENGAGEMENT ROUTES (API - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('social-buffer/engagement')->name('social-buffer.engagement.')->group(function () {
    Route::get('/', [\App\Domains\SocialBuffer\Http\Controllers\EngagementController::class, 'index'])
        ->name('index');
    
    Route::get('/analytics', [\App\Domains\SocialBuffer\Http\Controllers\EngagementController::class, 'analytics'])
        ->name('analytics');
    
    Route::get('/reports', [\App\Domains\SocialBuffer\Http\Controllers\EngagementController::class, 'reports'])
        ->name('reports');
});

// ========================================
// 🔐 SOCIAL OAUTH ROUTES (Parcialmente públicas para callback)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('social-buffer/oauth')->name('social-buffer.oauth.')->group(function () {
    Route::get('/{provider}', [\App\Domains\SocialBuffer\Http\Controllers\OAuthController::class, 'redirect'])
        ->name('redirect');
});

// OAuth callback precisa estar acessível para o provider redirecionar
Route::get('/social-buffer/oauth/{provider}/callback', [\App\Domains\SocialBuffer\Http\Controllers\OAuthController::class, 'callback'])
    ->name('social-buffer.oauth.callback');
