<?php

namespace Tests\Feature\Domains\Universe\Http\Controllers;

use App\Models\User;
use App\Domains\Universe\Models\UniversalConnector;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DebugUniverseTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_debug_universe_connectors()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        // Create a project for the user
        $project = \App\Domains\Projects\Models\Project::create([
            'name' => 'Test Project',
            'slug' => 'test-project',
            'description' => 'Test project for testing',
            'owner_id' => $user->id,
            'is_active' => true,
        ]);

        // Set the current project for the user
        $user->update(['current_project_id' => $project->id]);

        // Create a connector manually
        $connector = UniversalConnector::create([
            'name' => 'Test Connector',
            'description' => 'Test description',
            'type' => 'slack',
            'configuration' => ['url' => 'https://test.com'],
            'status' => 'active',
            'is_connected' => false,
            'user_id' => $user->id,
        ]);

        $this->assertDatabaseHas('universe_connectors', [
            'name' => 'Test Connector',
            'user_id' => $user->id
        ]);

        // Test the API endpoint
        $response = $this->getJson('/api/universe/connectors/types');
        
        // Debug the response
        if ($response->status() !== 200) {
            dump('Response Status: ' . $response->status());
            dump('Response Content: ' . $response->getContent());
        }

        $response->assertStatus(200);
    }
}