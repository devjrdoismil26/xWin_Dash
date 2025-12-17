<?php

/*
|--------------------------------------------------------------------------
| 👥 Leads Web Routes
|--------------------------------------------------------------------------
|
| Rotas web para gerenciamento de leads
| Inclui CRUD, filtros e estatísticas
|
| SECURITY FIX (ROUTES-001): Todas as rotas protegidas com auth:sanctum
|
*/

use Illuminate\Support\Facades\Route;
use App\Domains\Leads\Http\Controllers\LeadController;

// ========================================
// 👥 LEADS ROUTES (Protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('projects/{projectId}')->group(function () {
    // CRUD
    Route::get('/leads', [LeadController::class, 'index'])->name('leads.index');
    Route::post('/leads', [LeadController::class, 'store'])->name('leads.store');
    Route::get('/leads/{leadId}', [LeadController::class, 'show'])->name('leads.show');
    Route::put('/leads/{leadId}', [LeadController::class, 'update'])->name('leads.update');
    Route::delete('/leads/{leadId}', [LeadController::class, 'destroy'])->name('leads.destroy');
    
    // Search & Filters
    Route::get('/leads/search', [LeadController::class, 'search'])->name('leads.search');
    Route::get('/leads/by-status/{status}', [LeadController::class, 'getByStatus'])->name('leads.by-status');
    Route::get('/leads/by-source/{source}', [LeadController::class, 'getBySource'])->name('leads.by-source');
    Route::get('/leads/by-segment/{segmentId}', [LeadController::class, 'getBySegment'])->name('leads.by-segment');
    Route::get('/leads/by-score', [LeadController::class, 'getByScore'])->name('leads.by-score');
    Route::get('/leads/recent', [LeadController::class, 'getRecent'])->name('leads.recent');
    
    // Stats
    Route::get('/leads/stats', [LeadController::class, 'getStats'])->name('leads.stats');
    Route::get('/leads/counts', [LeadController::class, 'getCounts'])->name('leads.counts');
    Route::get('/leads/status-stats', [LeadController::class, 'getStatusStats'])->name('leads.status-stats');
    Route::get('/leads/conversion-rate', [LeadController::class, 'getConversionRate'])->name('leads.conversion-rate');
    
    // Status Updates
    Route::put('/leads/{leadId}/status', [LeadController::class, 'updateStatus'])->name('leads.update-status');
    Route::post('/leads/{leadId}/qualify', [LeadController::class, 'qualify'])->name('leads.qualify');
    Route::post('/leads/{leadId}/disqualify', [LeadController::class, 'disqualify'])->name('leads.disqualify');
    Route::post('/leads/{leadId}/convert', [LeadController::class, 'convert'])->name('leads.convert');
    Route::post('/leads/{leadId}/lose', [LeadController::class, 'lose'])->name('leads.lose');
    Route::post('/leads/{leadId}/contact', [LeadController::class, 'contact'])->name('leads.contact');
    Route::post('/leads/{leadId}/negotiate', [LeadController::class, 'negotiate'])->name('leads.negotiate');
    Route::post('/leads/{leadId}/follow-up', [LeadController::class, 'followUp'])->name('leads.follow-up');
    
    // History
    Route::get('/leads/{leadId}/status-history', [LeadController::class, 'getStatusHistory'])->name('leads.status-history');
    
    // Special Queries
    Route::get('/leads/needing-follow-up', [LeadController::class, 'getLeadsNeedingFollowUp'])->name('leads.needing-follow-up');
    Route::get('/leads/in-negotiation', [LeadController::class, 'getLeadsInNegotiation'])->name('leads.in-negotiation');
    Route::get('/leads/qualified', [LeadController::class, 'getQualifiedLeads'])->name('leads.qualified');
    Route::get('/leads/converted', [LeadController::class, 'getConvertedLeads'])->name('leads.converted');
});
