<?php

namespace Tests\Feature\Domains\Workflows\Http\Controllers;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use App\Domains\Users\Models\User;
use App\Domains\Projects\Models\Project;
use App\Domains\Workflows\Models\Workflow;

class NodeBuilderControllerTest extends TestCase
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
        $response = $this->get(route('workflows.index'));

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
        ];

        $response = $this->post(route('workflows.store'), $data);

        $response->assertSuccessful();
    }

    /**
     * Test show endpoint.
     */
    public function test_can_view_resource(): void
    {
        // Test workflow builder endpoint
        $response = $this->get(route('workflows.builder'));

        $response->assertSuccessful();
    }

    /**
     * Test update endpoint.
     */
    public function test_can_update_resource(): void
    {
        $workflow = Workflow::factory()->create([
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
        ]);

        $updateData = [
            'name' => 'Updated Workflow',
            'definition' => ['nodes' => []],
        ];

        $response = $this->putJson(route('workflows.v1.workflows.update', $workflow->id), $updateData);

        $response->assertSuccessful();

        $this->assertDatabaseHas('workflows', [
            'id' => $workflow->id,
            'name' => 'Updated Workflow',
        ]);
    }

    /**
     * Test delete endpoint.
     */
    public function test_can_delete_resource(): void
    {
        $workflow = Workflow::factory()->create([
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

        $response = $this->get(route('workflows.index'));

        $response->assertRedirect(route('login'));
    }

    /**
     * Test user can only access their own project data.
     */
    public function test_user_can_only_access_own_project_data(): void
    {
        $otherUser = User::factory()->create();
        $otherProject = Project::factory()->create(['user_id' => $otherUser->id]);
        
        $otherWorkflow = Workflow::factory()->create([
            'user_id' => $otherUser->id,
            'project_id' => $otherProject->id,
        ]);

        $response = $this->getJson(route('workflows.v1.workflows.show', $otherWorkflow->id));

        $response->assertStatus(404);
    }
}
