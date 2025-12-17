<?php

/*
|--------------------------------------------------------------------------
| 📁 Projects Web Routes
|--------------------------------------------------------------------------
|
| Rotas web para gerenciamento de projetos
| Inclui rotas para Universe, seleção de projetos e CRUD básico
|
| SECURITY FIX (ROUTES-001): Todas as rotas protegidas com auth:sanctum
|
*/

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ========================================
// 📁 PROJECTS WEB ROUTES - CRUD COMPLETO (Protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->group(function () {
    // CRUD básico de projetos
    Route::resource('projects', \App\Domains\Projects\Http\Controllers\ProjectController::class);

    // ========================================
    // 🔄 PROJECTS ACTIONS ROUTES
    // ========================================

    // Seleção e troca de projetos
    Route::get('/projects/select', [\App\Domains\Projects\Http\Controllers\ProjectController::class, 'selectProject'])
        ->name('projects.select');

    Route::post('/projects/switch', [\App\Domains\Projects\Http\Controllers\ProjectController::class, 'switchProject'])
        ->name('projects.switch');

    // Ações específicas de projetos
    Route::post('/projects/{project}/duplicate', [\App\Domains\Projects\Http\Controllers\ProjectController::class, 'duplicate'])
        ->name('projects.duplicate');

    Route::put('/projects/{project}/archive', [\App\Domains\Projects\Http\Controllers\ProjectController::class, 'archive'])
        ->name('projects.archive');

    Route::put('/projects/{project}/restore', [\App\Domains\Projects\Http\Controllers\ProjectController::class, 'restore'])
        ->name('projects.restore');

    Route::put('/projects/{project}/transfer-ownership', [\App\Domains\Projects\Http\Controllers\ProjectController::class, 'transferOwnership'])
        ->name('projects.transfer-ownership');

    // ========================================
    // 👥 PROJECT MEMBERS ROUTES
    // ========================================

    Route::get('/projects/{project}/members', [\App\Domains\Projects\Http\Controllers\ProjectController::class, 'getMembers'])
        ->name('projects.members');

    Route::post('/projects/{project}/members', [\App\Domains\Projects\Http\Controllers\ProjectController::class, 'addMember'])
        ->name('projects.add-member');

    Route::put('/projects/{project}/members/{userId}', [\App\Domains\Projects\Http\Controllers\ProjectController::class, 'updateMember'])
        ->name('projects.update-member');

    Route::delete('/projects/{project}/members/{userId}', [\App\Domains\Projects\Http\Controllers\ProjectController::class, 'removeMember'])
        ->name('projects.remove-member');

    // ========================================
    // 📊 PROJECT ACTIVITIES ROUTES
    // ========================================

    Route::get('/projects/{project}/activities', [\App\Domains\Projects\Http\Controllers\ProjectController::class, 'getActivities'])
        ->name('projects.activities');

    Route::post('/projects/{project}/activities', [\App\Domains\Projects\Http\Controllers\ProjectController::class, 'recordActivity'])
        ->name('projects.record-activity');

    // ========================================
    // 📈 PROJECT STATS ROUTES
    // ========================================

    Route::get('/projects/stats', [\App\Domains\Projects\Http\Controllers\ProjectController::class, 'getStats'])
        ->name('projects.stats');

    // ========================================
    // 🔄 PROJECT BULK OPERATIONS ROUTES
    // ========================================

    Route::post('/projects/bulk-update', [\App\Domains\Projects\Http\Controllers\ProjectController::class, 'bulkUpdate'])
        ->name('projects.bulk-update');

    Route::post('/projects/bulk-delete', [\App\Domains\Projects\Http\Controllers\ProjectController::class, 'bulkDelete'])
        ->name('projects.bulk-delete');

    Route::post('/projects/bulk-archive', [\App\Domains\Projects\Http\Controllers\ProjectController::class, 'bulkArchive'])
        ->name('projects.bulk-archive');

    // ========================================
    // 🌌 UNIVERSE PROJECT ROUTES
    // ========================================

    // Universe Interface Principal
    Route::get('/projects/universe/interface', function () {
        return Inertia::render('Projects/Universe/index');
    })->name('projects.universe.interface');

    // Universe Index (Página Principal)
    Route::get('/projects/universe', function () {
        return Inertia::render('Projects/Universe/pages/UniverseIndex');
    })->name('projects.universe.index');

    // Universe Dashboard
    Route::get('/projects/universe/dashboard', function () {
        return Inertia::render('Projects/Universe/pages/Dashboard');
    })->name('projects.universe.dashboard');

    // Universe Create Project
    Route::get('/projects/universe/create', [\App\Domains\Projects\Http\Controllers\ProjectController::class, 'createUniverse'])
        ->name('projects.universe.create');

    // Universe Workspace
    Route::get('/projects/universe/workspace', [\App\Domains\Projects\Http\Controllers\ProjectController::class, 'universeWorkspace'])
        ->name('projects.universe.workspace');

    // Universe Canvas
    Route::get('/projects/universe/canvas', function () {
        return Inertia::render('Projects/Universe/components/Canvas/UniverseCanvas');
    })->name('projects.universe.canvas');

    // Universe Kanban
    Route::get('/projects/universe/kanban', function () {
        return Inertia::render('Projects/Universe/components/KanbanBoard');
    })->name('projects.universe.kanban');

    // Universe DGD Panel
    Route::get('/projects/universe/dgd', function () {
        return Inertia::render('Projects/Universe/components/DGDPanel');
    })->name('projects.universe.dgd');

    // Universe Marketplace
    Route::get('/projects/universe/marketplace', function () {
        return Inertia::render('Projects/Universe/components/Marketplace/BlockMarketplace');
    })->name('projects.universe.marketplace');

    // Universe Workspace Selector
    Route::get('/projects/universe/workspace-selector', function () {
        return Inertia::render('Projects/Universe/pages/WorkspaceSelector');
    })->name('projects.universe.workspace-selector');

    // ========================================
    // 🔧 UNIVERSE INTEGRATION ROUTES
    // ========================================

    // Rotas específicas do controller para Universe
    Route::get('/projects/{project}/universe', [\App\Domains\Projects\Http\Controllers\ProjectController::class, 'showUniverse'])
        ->name('projects.universe.show');

    Route::post('/projects/{project}/universe/toggle', [\App\Domains\Projects\Http\Controllers\ProjectController::class, 'toggleUniverse'])
        ->name('projects.universe.toggle');

    Route::get('/projects/{project}/universe/stats', [\App\Domains\Projects\Http\Controllers\ProjectController::class, 'getUniverseStats'])
        ->name('projects.universe.stats');

    Route::post('/projects/{project}/universe/sync', [\App\Domains\Projects\Http\Controllers\ProjectController::class, 'syncWithUniverse'])
        ->name('projects.universe.sync');
});
