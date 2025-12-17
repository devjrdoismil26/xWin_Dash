<?php

namespace Tests\Feature\Domains\Integrations\Http\Controllers;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use App\Domains\Users\Models\User;
use App\Domains\Projects\Models\Project;

class IntegrationsMasterControllerTest extends TestCase
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
     * Test index endpoint.
     */
    public function test_can_view_index(): void
    {
        // Create some test integrations
        \App\Domains\Integrations\Models\Integration::create([
            'name' => 'Integration 1',
            'provider' => 'google',
            'config' => ['api_key' => 'test-key'],
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
            'status' => 'disconnected',
            'is_active' => false,
        ]);

        $response = $this->getJson(route('integrations.index'));

        $response->assertSuccessful()
            ->assertJsonStructure([
                'integrations',
                'total',
                'available_providers',
            ]);
    }

    /**
     * Test create endpoint.
     */
    public function test_can_create_resource(): void
    {
        $data = [
            'name' => 'New Integration',
            'provider' => 'google',
            'config' => ['api_key' => 'test-api-key'],
        ];

        $response = $this->postJson(route('integrations.store'), $data);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'id',
                'name',
                'provider',
                'status',
            ]);

        $this->assertDatabaseHas('integrations', [
            'name' => 'New Integration',
            'provider' => 'google',
            'user_id' => $this->user->id,
        ]);
    }

    /**
     * Test show endpoint.
     */
    public function test_can_view_resource(): void
    {
        // Create an integration
        $integration = \App\Domains\Integrations\Models\Integration::create([
            'name' => 'Test Integration',
            'provider' => 'google',
            'config' => ['api_key' => 'test-key'],
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
            'status' => 'disconnected',
            'is_active' => false,
        ]);

        $response = $this->getJson(route('integrations.show', $integration->id));

        $response->assertSuccessful()
            ->assertJsonStructure([
                'id',
                'name',
                'provider',
                'status',
            ]);
    }

    /**
     * Test update endpoint.
     */
    public function test_can_update_resource(): void
    {
        $integration = \App\Domains\Integrations\Models\Integration::create([
            'name' => 'Original Integration',
            'provider' => 'google',
            'config' => ['api_key' => 'test-key'],
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
            'status' => 'disconnected',
            'is_active' => false,
        ]);

        $updateData = [
            'name' => 'Updated Integration',
            'is_active' => true,
        ];

        $response = $this->putJson(route('integrations.update', $integration->id), $updateData);

        $response->assertSuccessful();

        $this->assertDatabaseHas('integrations', [
            'id' => $integration->id,
            'name' => 'Updated Integration',
            'is_active' => true,
        ]);
    }

    /**
     * Test delete endpoint.
     */
    public function test_can_delete_resource(): void
    {
        $integration = \App\Domains\Integrations\Models\Integration::create([
            'name' => 'Integration to Delete',
            'provider' => 'google',
            'config' => ['api_key' => 'test-key'],
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
            'status' => 'disconnected',
            'is_active' => false,
        ]);

        $response = $this->deleteJson(route('integrations.destroy', $integration->id));

        $response->assertSuccessful()
            ->assertJson([
                'message' => 'Integration deleted successfully',
            ]);

        $this->assertDatabaseMissing('integrations', [
            'id' => $integration->id,
        ]);
    }

    /**
     * Test authentication is required.
     */
    public function test_authentication_required(): void
    {
        $this->app['auth']->forgetGuards();

        $response = $this->get(route('integrations.index'));

        $response->assertRedirect(route('login'));
    }

    /**
     * Test user can only access their own project data.
     */
    public function test_user_can_only_access_own_project_data(): void
    {
        $otherUser = User::factory()->create();
        $otherProject = Project::factory()->create(['user_id' => $otherUser->id]);
        
        $otherIntegration = \App\Domains\Integrations\Models\Integration::create([
            'name' => 'Other User Integration',
            'provider' => 'google',
            'config' => ['api_key' => 'test-key'],
            'user_id' => $otherUser->id,
            'project_id' => $otherProject->id,
            'status' => 'disconnected',
            'is_active' => false,
        ]);

        // Current user should not be able to access other user's integration
        $response = $this->getJson(route('integrations.show', $otherIntegration->id));

        $response->assertStatus(404);
    }
}
