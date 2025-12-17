<?php

/*
|--------------------------------------------------------------------------
| 👥 Users Web Routes
|--------------------------------------------------------------------------
|
| Rotas web para gerenciamento de usuários e perfis
| Inclui rotas de perfil pessoal e administração de usuários
|
| SECURITY FIX (ROUTES-001): Todas as rotas protegidas com auth:sanctum
|
*/

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ========================================
// 👤 USER PROFILE ROUTES (Protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->group(function () {
    // Perfil do usuário autenticado
    Route::get('/profile', function () {
        return Inertia::render('Users/Profile/Show');
    })->name('profile.show');

    Route::get('/profile/edit', function () {
        return Inertia::render('Users/Profile/Edit');
    })->name('profile.edit');

    Route::get('/profile/preferences', function () {
        return Inertia::render('Users/Profile/Preferences');
    })->name('profile.preferences');

    Route::get('/profile/settings', function () {
        return Inertia::render('Users/Profile/Settings');
    })->name('profile.settings');

    Route::get('/profile/activity', function () {
        return Inertia::render('Users/Profile/Activity');
    })->name('profile.activity');
});

// ========================================
// 👥 USER MANAGEMENT ROUTES (Admin - Protegidas)
// ========================================

// Gerenciamento de usuários (requer autenticação E permissão)
Route::middleware(['auth:sanctum', 'can:manage-users'])->group(function () {
    Route::get('/users', function () {
        return Inertia::render('Users/Index');
    })->name('users.index');
    
    Route::get('/users/create', function () {
        return Inertia::render('Users/Create');
    })->name('users.create');
    
    Route::get('/users/{user}/edit', function ($user) {
        return Inertia::render('Users/Edit', ['user' => $user]);
    })->name('users.edit');
    
    Route::get('/users/{user}', function ($user) {
        return Inertia::render('Users/Show', ['user' => $user]);
    })->name('users.show');
    
    Route::get('/users/roles', function () {
        return Inertia::render('Users/Roles');
    })->name('users.roles');
    
    Route::get('/users/permissions', function () {
        return Inertia::render('Users/Permissions');
    })->name('users.permissions');
});

// ========================================
// ⚙️ SETTINGS ROUTES (Protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/settings', function () {
        return Inertia::render('Settings/Index');
    })->name('settings.index');
});
