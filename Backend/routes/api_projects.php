<?php

use App\Domains\Projects\Http\Controllers\ProjectController;
use App\Domains\Projects\Http\Controllers\ProjectAdvancedController;
use App\Domains\Projects\Http\Controllers\GanttController;
use App\Domains\Projects\Http\Controllers\TemplateController;
use App\Domains\Projects\Http\Controllers\TimelineController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Projects API Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum'])->prefix('projects')->group(function () {
    
    // ===== CRUD OPERATIONS =====
    Route::get('/', [ProjectController::class, 'index']);
    Route::post('/', [ProjectController::class, 'store']);
    Route::get('/{id}', [ProjectController::class, 'show']);
    Route::put('/{id}', [ProjectController::class, 'update']);
    Route::delete('/{id}', [ProjectController::class, 'destroy']);

    // ===== PROJECT ACTIONS =====
    Route::post('/{id}/duplicate', [ProjectController::class, 'duplicate']);
    Route::put('/{id}/archive', [ProjectController::class, 'archive']);
    Route::put('/{id}/restore', [ProjectController::class, 'restore']);
    Route::put('/{id}/transfer-ownership', [ProjectController::class, 'transferOwnership']);

    // ===== MEMBER MANAGEMENT =====
    Route::get('/{id}/members', [ProjectController::class, 'getMembers']);
    Route::post('/{id}/members', [ProjectController::class, 'addMember']);
    Route::put('/{id}/members/{userId}', [ProjectController::class, 'updateMember']);
    Route::delete('/{id}/members/{userId}', [ProjectController::class, 'removeMember']);

    // ===== ACTIVITIES =====
    Route::get('/{id}/activities', [ProjectController::class, 'getActivities']);
    Route::post('/{id}/activities', [ProjectController::class, 'recordActivity']);

    // ===== STATISTICS =====
    Route::get('/stats', [ProjectController::class, 'getStats']);

    // ===== BULK OPERATIONS =====
    Route::post('/bulk-update', [ProjectController::class, 'bulkUpdate']);
    Route::post('/bulk-delete', [ProjectController::class, 'bulkDelete']);
    Route::post('/bulk-archive', [ProjectController::class, 'bulkArchive']);

    // ===== TEMPLATES =====
    Route::prefix('templates')->group(function () {
        Route::get('/', [TemplateController::class, 'index']);
        Route::post('/', [TemplateController::class, 'store']);
        Route::get('/{id}', [TemplateController::class, 'show']);
        Route::put('/{id}', [TemplateController::class, 'update']);
        Route::delete('/{id}', [TemplateController::class, 'destroy']);
    });
    Route::post('/from-template/{templateId}', [TemplateController::class, 'createFromTemplate']);

    // ===== TIMELINE =====
    Route::get('/{projectId}/timeline', [TimelineController::class, 'show']);

    // ===== GANTT =====
    Route::get('/{projectId}/gantt', [GanttController::class, 'show']);
    Route::post('/{projectId}/gantt/calculate', [GanttController::class, 'calculate']);
    Route::get('/{projectId}/critical-path', [GanttController::class, 'criticalPath']);

    // ===== MILESTONES =====
    Route::get('/{projectId}/milestones', [ProjectAdvancedController::class, 'getMilestones']);
    Route::post('/{projectId}/milestones', [ProjectAdvancedController::class, 'createMilestone']);
    Route::put('/{projectId}/milestones/{milestoneId}', [ProjectAdvancedController::class, 'updateMilestone']);
    Route::delete('/{projectId}/milestones/{milestoneId}', [ProjectAdvancedController::class, 'deleteMilestone']);

    // ===== RESOURCES =====
    Route::get('/{projectId}/resources', [ProjectAdvancedController::class, 'getResources']);
    Route::post('/{projectId}/resources', [ProjectAdvancedController::class, 'createResource']);

    // ===== BUDGET =====
    Route::get('/{projectId}/budget', [ProjectAdvancedController::class, 'getBudget']);
    Route::post('/{projectId}/budget', [ProjectAdvancedController::class, 'updateBudget']);

    // ===== RISKS =====
    Route::get('/{projectId}/risks', [ProjectAdvancedController::class, 'getRisks']);
    Route::post('/{projectId}/risks', [ProjectAdvancedController::class, 'createRisk']);

    // ===== ANALYTICS =====
    Route::get('/{projectId}/analytics', [ProjectAdvancedController::class, 'getAnalytics']);
});
