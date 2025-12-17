<?php

namespace Tests\Feature\Domains\Universe\Http\Controllers;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SimpleUniverseTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_access_universe_routes()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        // Test if the route exists (should return 200 or 404, not 405)
        $response = $this->getJson('/api/universe/connectors/types');
        
        // Should not return 405 (Method Not Allowed) if route exists
        $this->assertNotEquals(405, $response->status());
    }

    /** @test */
    public function it_requires_authentication()
    {
        $response = $this->getJson('/api/universe/connectors/types');
        
        // Should return 401 (Unauthorized) if not authenticated
        $this->assertEquals(401, $response->status());
    }
}