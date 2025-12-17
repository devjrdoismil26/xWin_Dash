<?php

namespace App\Domains\Universe\Observers;

use App\Domains\Universe\Models\UniverseTemplate; // Supondo que o model exista
use Illuminate\Support\Facades\Log;

class UniverseTemplateObserver
{
    /**
     * Handle the UniverseTemplate "created" event.
     *
     * @param UniverseTemplate $universeTemplate
     */
    public function created(UniverseTemplate $universeTemplate): void
    {
        Log::info("UniverseTemplate criado: {$universeTemplate->name} (ID: {$universeTemplate->id}).");
        // Disparar evento ou realizar ações pós-criação
    }

    /**
     * Handle the UniverseTemplate "updated" event.
     *
     * @param UniverseTemplate $universeTemplate
     */
    public function updated(UniverseTemplate $universeTemplate): void
    {
        Log::info("UniverseTemplate atualizado: {$universeTemplate->name} (ID: {$universeTemplate->id}).");
        // Disparar evento ou realizar ações pós-atualização
    }

    /**
     * Handle the UniverseTemplate "deleted" event.
     *
     * @param UniverseTemplate $universeTemplate
     */
    public function deleted(UniverseTemplate $universeTemplate): void
    {
        Log::info("UniverseTemplate deletado: {$universeTemplate->name} (ID: {$universeTemplate->id}).");
        // Disparar evento ou realizar ações pós-exclusão
    }

    /**
     * Handle the UniverseTemplate "restored" event.
     *
     * @param UniverseTemplate $universeTemplate
     */
    public function restored(UniverseTemplate $universeTemplate): void
    {
        Log::info("UniverseTemplate restaurado: {$universeTemplate->name} (ID: {$universeTemplate->id}).");
    }

    /**
     * Handle the UniverseTemplate "forceDeleted" event.
     *
     * @param UniverseTemplate $universeTemplate
     */
    public function forceDeleted(UniverseTemplate $universeTemplate): void
    {
        Log::info("UniverseTemplate forçadamente deletado: {$universeTemplate->name} (ID: {$universeTemplate->id}).");
    }
}
