<?php

namespace App\Domains\Universe\Observers;

use App\Domains\Universe\Listeners\SendInstanceCreatedNotification; // Supondo que o model exista
use App\Domains\Universe\Models\UniverseInstance; // Supondo que este listener exista
use Illuminate\Support\Facades\Log;

class UniverseInstanceObserver
{
    /**
     * Handle the UniverseInstance "created" event.
     *
     * @param UniverseInstance $universeInstance
     */
    public function created(UniverseInstance $universeInstance): void
    {
        Log::info("UniverseInstance criada: {$universeInstance->name} (ID: {$universeInstance->id}).");
        // Disparar evento de notificação
        event(new \App\Domains\Universe\Events\UniverseInstanceCreated($universeInstance));
    }

    /**
     * Handle the UniverseInstance "updated" event.
     *
     * @param UniverseInstance $universeInstance
     */
    public function updated(UniverseInstance $universeInstance): void
    {
        Log::info("UniverseInstance atualizada: {$universeInstance->name} (ID: {$universeInstance->id}).");
        // Disparar evento ou realizar ações pós-atualização
    }

    /**
     * Handle the UniverseInstance "deleted" event.
     *
     * @param UniverseInstance $universeInstance
     */
    public function deleted(UniverseInstance $universeInstance): void
    {
        Log::info("UniverseInstance deletada: {$universeInstance->name} (ID: {$universeInstance->id}).");
        // Disparar evento ou realizar ações pós-exclusão
    }

    /**
     * Handle the UniverseInstance "restored" event.
     *
     * @param UniverseInstance $universeInstance
     */
    public function restored(UniverseInstance $universeInstance): void
    {
        Log::info("UniverseInstance restaurada: {$universeInstance->name} (ID: {$universeInstance->id}).");
    }

    /**
     * Handle the UniverseInstance "forceDeleted" event.
     *
     * @param UniverseInstance $universeInstance
     */
    public function forceDeleted(UniverseInstance $universeInstance): void
    {
        Log::info("UniverseInstance forçadamente deletada: {$universeInstance->name} (ID: {$universeInstance->id}).");
    }
}
