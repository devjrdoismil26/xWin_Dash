<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

class Aura extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'aura'; // O nome do binding no container de serviços
    }
}
