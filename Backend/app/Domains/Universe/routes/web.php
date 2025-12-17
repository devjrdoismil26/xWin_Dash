<?php

use App\Domains\Universe\Http\Controllers\UniverseController;
use App\Domains\Universe\Http\Controllers\UniverseSnapshotController;
use App\Domains\Universe\Http\Controllers\UniverseTemplateController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Universe Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for the Universe module.
| These routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group.
|
*/

Route::middleware(['auth', 'verified'])->group(function () {
    // Universe Dashboard
    Route::get('/universe/dashboard', [UniverseController::class, 'dashboard'])
        ->name('universe.dashboard');

    // Workspace Selector
    Route::get('/universe/workspace-selector', [UniverseController::class, 'workspaceSelector'])
        ->name('universe.workspace-selector');

    // Universe Instances
    Route::prefix('universe/instances')->name('universe.instances.')->group(function () {
        Route::get('/', [UniverseController::class, 'index'])->name('index');
        Route::get('/create', [UniverseController::class, 'create'])->name('create');
        Route::post('/', [UniverseController::class, 'store'])->name('store');
        Route::get('/{instance}', [UniverseController::class, 'show'])->name('show');
        Route::get('/{instance}/edit', [UniverseController::class, 'edit'])->name('edit');
        Route::put('/{instance}', [UniverseController::class, 'update'])->name('update');
        Route::delete('/{instance}', [UniverseController::class, 'destroy'])->name('destroy');
        Route::post('/{instance}/duplicate', [UniverseController::class, 'duplicate'])->name('duplicate');
        Route::post('/{instance}/set-default', [UniverseController::class, 'setDefault'])->name('set-default');
    });

    // Universe Templates
    Route::prefix('universe/templates')->name('universe.templates.')->group(function () {
        Route::get('/', [UniverseTemplateController::class, 'index'])->name('index');
        Route::get('/create', [UniverseTemplateController::class, 'create'])->name('create');
        Route::post('/', [UniverseTemplateController::class, 'store'])->name('store');
        Route::get('/{template}', [UniverseTemplateController::class, 'show'])->name('show');
        Route::get('/{template}/edit', [UniverseTemplateController::class, 'edit'])->name('edit');
        Route::put('/{template}', [UniverseTemplateController::class, 'update'])->name('update');
        Route::delete('/{template}', [UniverseTemplateController::class, 'destroy'])->name('destroy');
        Route::post('/{template}/use', [UniverseTemplateController::class, 'useTemplate'])->name('use');
        Route::post('/{template}/rate', [UniverseTemplateController::class, 'rate'])->name('rate');
    });

    // Universe Snapshots
    Route::prefix('universe/snapshots')->name('universe.snapshots.')->group(function () {
        Route::get('/', [UniverseSnapshotController::class, 'index'])->name('index');
        Route::post('/', [UniverseSnapshotController::class, 'store'])->name('store');
        Route::get('/{snapshot}', [UniverseSnapshotController::class, 'show'])->name('show');
        Route::delete('/{snapshot}', [UniverseSnapshotController::class, 'destroy'])->name('destroy');
        Route::post('/{snapshot}/restore', [UniverseSnapshotController::class, 'restore'])->name('restore');
        Route::get('/{snapshot}/download', [UniverseSnapshotController::class, 'download'])->name('download');
    });

    // Universe Configuration
    Route::prefix('universe/config')->name('universe.config.')->group(function () {
        Route::get('/', [UniverseController::class, 'config'])->name('index');
        Route::post('/save', [UniverseController::class, 'saveConfig'])->name('save');
        Route::post('/reset', [UniverseController::class, 'resetConfig'])->name('reset');
        Route::post('/export', [UniverseController::class, 'exportConfig'])->name('export');
        Route::post('/import', [UniverseController::class, 'importConfig'])->name('import');
    });
});
