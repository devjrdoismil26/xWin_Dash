<?php

namespace App\Domains\Core\Modules;

use App\Domains\Core\Contracts\Module;
use Illuminate\Support\Collection;

class ModuleManager
{
    protected Collection $modules;

    public function __construct()
    {
        $this->modules = new Collection();
    }

    public function register(Module $module): void
    {
        $this->modules->put($module->getName(), $module);
    }

    public function all(): Collection
    {
        return $this->modules;
    }
}
