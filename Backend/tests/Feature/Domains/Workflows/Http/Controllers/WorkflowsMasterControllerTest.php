<?php

namespace Tests\Feature\Domains\Workflows\Http\Controllers;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use App\Models\User;
use App\Domains\Projects\Models\Project;

class WorkflowsMasterControllerTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    protected User $user;
    protected Project $project;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->project = Project::factory()->create(['owner_id' => $this->user->id]);

        $this->actingAs($this->user);
    }

    /**
     * Test index endpoint.
     */
    public function test_can_view_index(): void
    {
        $response = $this->get(route('workflows.v1.workflows.index'));

        $response->assertSuccessful();
    }

    /**
     * Test create endpoint.
     */
    public function test_can_create_resource(): void
    {
        $data = [
            'name' => $this->faker->words(2, true),
            'project_id' => $this->project->id,
            // Add more fields based on the resource
        ];

        $response = $this->post(route('workflows.v1.workflows.store'), $data);

        $response->assertSuccessful();
        // Add assertions for created resource
    }

    /**
     * Test show endpoint.
     */
    public function test_can_view_resource(): void
    {
        // Create a workflow using factory
        $workflow = \App\Domains\Workflows\Models\Workflow::factory()->create([
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
        ]);

        $response = $this->getJson(route('workflows.v1.workflows.show', $workflow->id));

        $response->assertSuccessful()
            ->assertJsonStructure([
                'id',
                'name',
                'description',
                'status',
            ]);
    }

    /**
     * Test update endpoint.
     */
    public function test_can_update_resource(): void
    {
        $workflow = \App\Domains\Workflows\Models\Workflow::factory()->create([
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
        ]);

        $updateData = [
            'name' => 'Updated Workflow Name',
            'description' => 'Updated description',
            'status' => 'active',
        ];

        $response = $this->putJson(route('workflows.v1.workflows.update', $workflow->id), $updateData);

        $response->assertSuccessful();

        $this->assertDatabaseHas('workflows', [
            'id' => $workflow->id,
            'name' => 'Updated Workflow Name',
        ]);
    }

    /**
     * Test delete endpoint.
     */
    public function test_can_delete_resource(): void
    {
        $workflow = \App\Domains\Workflows\Models\Workflow::factory()->create([
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
        ]);

        $response = $this->deleteJson(route('workflows.v1.workflows.destroy', $workflow->id));

        $response->assertSuccessful();

        $this->assertDatabaseMissing('workflows', [
            'id' => $workflow->id,
        ]);
    }

    /**
     * Test authentication is required.
     */
    public function test_authentication_required(): void
    {
        $this->app['auth']->forgetGuards();

        $response = $this->get(route('workflows.v1.workflows.index'));

        $response->assertRedirect(route('login'));
    }

    /**
     * Test user can only access their own project data.
     */
    public function test_user_can_only_access_own_project_data(): void
    {
        $otherUser = User::factory()->create();
        $otherProject = Project::factory()->create(['owner_id' => $otherUser->id]);
        
        $otherWorkflow = \App\Domains\Workflows\Models\Workflow::factory()->create([
            'user_id' => $otherUser->id,
            'project_id' => $otherProject->id,
        ]);

        // Current user should not be able to access other user's workflow
        $response = $this->getJson(route('workflows.v1.workflows.show', $otherWorkflow->id));

        // Should return 404 or 403 depending on authorization implementation
        $response->assertStatus(404);
    }
}
