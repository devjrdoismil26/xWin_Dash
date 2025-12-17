<?php

namespace Tests\Feature\Domains\Universe\Http\Controllers;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UniverseApiTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_requires_authentication()
    {
        $response = $this->getJson('/api/universe');
        $response->assertStatus(401);
    }

    /** @test */
    public function authenticated_user_can_access_universe()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson('/api/universe');
        $response->assertStatus(200);
    }

    /** @test */
    public function it_can_list_templates()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson('/api/universe/templates');
        $response->assertStatus(200);
    }
}
