<?php

namespace Tests\Feature\Core;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class RouteTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function core_routes_are_loaded()
    {
        $routes = \Route::getRoutes();
        
        // Debug: mostrar todas as rotas
        $allRoutes = collect($routes)->map(function ($route) {
            return $route->uri() . ' (' . $route->getName() . ')';
        })->toArray();
        
        $this->assertTrue(true, 'All routes: ' . implode(', ', $allRoutes));
        
        $coreRoutes = collect($routes)->filter(function ($route) {
            return str_contains($route->uri(), 'core');
        });
        
        $this->assertGreaterThan(0, $coreRoutes->count(), 'Core routes should be loaded. Found: ' . $coreRoutes->count() . ' routes');
        
        // Verificar se a rota específica existe
        $cacheRoute = $routes->getByName('core.cache.index');
        $this->assertNotNull($cacheRoute, 'core.cache.index route should exist');
    }
}