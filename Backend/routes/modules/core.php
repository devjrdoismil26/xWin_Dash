<?php

/*
|--------------------------------------------------------------------------
| 🚀 Core Web Routes
|--------------------------------------------------------------------------
|
| Rotas essenciais que são sempre carregadas
| Inclui rotas de teste e funcionalidades básicas
|
*/

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ========================================
// 🧪 TEST ROUTES (Desenvolvimento)
// ========================================

if (app()->environment('local')) {
    Route::get('/test', function () {
        return Inertia::render('Test');
    })->name('test');
    
    Route::get('/test-page', function () {
        return Inertia::render('TestPage');
    })->name('test-page');
}