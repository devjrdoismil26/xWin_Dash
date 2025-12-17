<?php

namespace App\Domains\Core\Services;

use App\Domains\Core\Contracts\Module; // Supondo uma interface Module
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class ModuleManager
{
    protected Collection $modules;

    public function __construct()
    {
        $this->modules = new Collection();
    }

    /**
     * Registra um novo módulo.
     *
     * @param Module $module
     */
    public function registerModule(Module $module): void
    {
        $this->modules->put($module->getName(), $module);
        Log::info("Módulo '{$module->getName()}' registrado.");
    }

    /**
     * Obtém um módulo pelo seu nome.
     *
     * @param string $name
     *
     * @return Module|null
     */
    public function getModule(string $name): ?Module
    {
        return $this->modules->get($name);
    }

    /**
     * Retorna todos os módulos registrados.
     *
     * @return Collection<Module>
     */
    public function getAllModules(): Collection
    {
        return $this->modules;
    }

    /**
     * Habilita um módulo.
     *
     * @param string $name
     *
     * @return bool
     */
    public function enableModule(string $name): bool
    {
        $module = $this->getModule($name);
        if ($module) {
            // Lógica para habilitar o módulo (ex: atualizar status no DB, carregar ServiceProviders)
            Log::info("Módulo '{$name}' habilitado.");
            return true;
        }
        return false;
    }

    /**
     * Desabilita um módulo.
     *
     * @param string $name
     *
     * @return bool
     */
    public function disableModule(string $name): bool
    {
        $module = $this->getModule($name);
        if ($module) {
            // Lógica para desabilitar o módulo (ex: atualizar status no DB, descarregar ServiceProviders)
            Log::info("Módulo '{$name}' desabilitado.");
            return true;
        }
        return false;
    }

    /**
     * Registra um m?dulo (alias para registerModule para compatibilidade).
     *
     * @param Module $module
     */
    public function register(Module $module): void
    {
        $this->registerModule($module);
    }

    /**
     * Inicializa todos os m?dulos registrados.
     */
    public function boot(): void
    {
        foreach ($this->modules as $module) {
            if (method_exists($module, 'boot')) {
                $module->boot();
            }
        }
    }
}
