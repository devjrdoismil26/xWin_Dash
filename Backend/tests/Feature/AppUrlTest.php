<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Route;

class AppUrlTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Testa se o APP_URL está sendo carregado corretamente e se a rota raiz funciona.
     *
     * @return void
     */
    public function test_app_url_is_correctly_loaded_and_root_route_works()
    {
        // Dump do valor de APP_URL para depuração
        dump('APP_URL from config:', Config::get('app.url'));

        // Verifica se o APP_URL está definido e é o esperado
        $this->assertNotNull(Config::get('app.url'), 'APP_URL não deve ser nulo.');
        $this->assertEquals('http://127.0.0.1:8000', Config::get('app.url'), 'APP_URL não corresponde ao esperado.');

        // Tenta acessar a rota raiz
        $response = $this->get('/');

        // Dump do status da resposta para depuração
        dump('Response Status:', $response->status());

        // Verifica se a rota raiz retorna 200 OK
        $response->assertStatus(200);

        // Opcional: Verificar se a resposta contém o texto esperado do Inertia
        // $response->assertSee('<div id="app" data-page=');
    }

    /**
     * Testa se o DashboardController pode ser renderizado diretamente.
     *
     * @return void
     */
    public function test_dashboard_controller_can_be_rendered_directly()
    {
        $controller = new \App\Domains\Dashboard\Http\Controllers\DashboardController();
        $response = $controller->renderDashboard();

        // Dump do tipo de resposta para depuração
        dump('Direct Controller Response Type:', get_class($response));

        // Verifica se a resposta é uma instância de Inertia\Response
        $this->assertInstanceOf(\Inertia\Response::class, $response, 'A resposta do controller não é uma instância de Inertia\Response.');
    }

    /**
     * Testa a rota raiz sem nenhum middleware para isolar o problema.
     *
     * @return void
     */
    public function test_root_route_without_middleware()
    {
        // Define uma rota temporária para a raiz sem middleware
        \Illuminate\Support\Facades\Route::get('/test-root-no-middleware', function () {
            return \Inertia\Inertia::render('Dashboard/index');
        });

        $response = $this->get('/test-root-no-middleware');

        dump('Response Status (no middleware):', $response->status());

        $response->assertStatus(200);
    }
}