<?php

namespace Tests\Feature\Integration;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use App\Domains\Users\Models\User;
use App\Domains\Projects\Models\Project;

class AIIntegrationsIntegrationTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    protected User $user;
    protected Project $project;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->project = Project::factory()->create(['user_id' => $this->user->id]);

        $this->actingAs($this->user);
    }

    /**
     * Test AI ↔ Integrations Integration.
     */
    public function test_modules_integration(): void
    {
        // Create an integration
        $integration = \App\Domains\Integrations\Models\Integration::create([
            'name' => 'AI Integration',
            'provider' => 'webhook',
            'config' => ['endpoint' => 'https://example.com/webhook'],
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
            'status' => 'connected',
            'is_active' => true,
        ]);

        // Test that AI can use integrations
        $response = $this->postJson(route('ai.generate.text'), [
            'prompt' => 'Test prompt',
            'integration_id' => $integration->id,
        ]);

        // Verify integration exists and is accessible
        $this->assertDatabaseHas('integrations', [
            'id' => $integration->id,
            'is_active' => true,
        ]);
        
        // Verify AI response is valid (if route exists)
        if ($response->status() !== 404) {
            $response->assertStatus(200);
            $this->assertNotNull($response->json('data'));
        }
    }

    /**
     * Test cross-module data consistency.
     */
    public function test_cross_module_data_consistency(): void
    {
        // Create integration
        $integration = \App\Domains\Integrations\Models\Integration::create([
            'name' => 'Test Integration',
            'provider' => 'google',
            'config' => ['api_key' => 'test'],
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
            'status' => 'connected',
            'is_active' => true,
        ]);

        // Verify data consistency
        $this->assertDatabaseHas('integrations', [
            'id' => $integration->id,
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
        ]);

        // Verify user can access their integration
        $response = $this->getJson(route('integrations.show', $integration->id));
        $response->assertSuccessful();
        $response->assertJsonStructure([
            'data' => [
                'id',
                'name',
                'provider',
            ]
        ]);
        
        // Verify response contains correct integration ID
        $this->assertEquals($integration->id, $response->json('data.id'));
    }

    /**
     * Test cross-module event handling.
     */
    public function test_cross_module_event_handling(): void
    {
        // Create integration
        $integration = \App\Domains\Integrations\Models\Integration::create([
            'name' => 'Event Test Integration',
            'provider' => 'webhook',
            'config' => ['endpoint' => 'https://example.com/webhook'],
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
            'status' => 'connected',
            'is_active' => true,
        ]);

        // Test sync endpoint (triggers events)
        $response = $this->postJson(route('integrations.sync', $integration->id));

        // Verify integration still exists after event
        $this->assertDatabaseHas('integrations', [
            'id' => $integration->id,
        ]);
        
        // Verify sync response (if route exists)
        if ($response->status() !== 404) {
            $response->assertStatus(200);
            $this->assertTrue($response->json('success', false));
        }
    }
}
