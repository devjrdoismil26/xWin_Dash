<?php

namespace Tests\Feature\Domains\Leads\Http\Controllers;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class LeadControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_requires_authentication()
    {
        $response = $this->get(route($this->getRouteName(LeadController) . '.index'));

        $response->assertRedirect(route('login'));
    }

    /** @test */
    public function authenticated_user_can_access_index()
    {
        $user = $this->actingAsUser();

        $response = $this->get(route($this->getRouteName(LeadController) . '.index'));

        $response->assertOk();
    }

    /** @test */
    public function it_can_show_create_form()
    {
        $user = $this->actingAsUser();

        $response = $this->get(route($this->getRouteName(LeadController) . '.create'));

        $response->assertOk();
    }

    /** @test */
    public function it_can_store_new_record()
    {
        $user = $this->actingAsUser();
        $data = [
            'name' => 'Test Name',
            // TODO: Adicionar campos específicos
        ];

        $response = $this->post(route($this->getRouteName(LeadController) . '.store'), $data);

        $response->assertRedirect();
        // TODO: Adicionar assertions específicas
    }

    private function getRouteName(string $controller): string
    {
        return strtolower(str_replace('Controller', '', $controller));
    }
}
