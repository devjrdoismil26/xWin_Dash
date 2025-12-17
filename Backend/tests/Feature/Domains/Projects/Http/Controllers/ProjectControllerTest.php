<?php

namespace Tests\Feature\Domains\Projects\Http\Controllers;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use App\Models\User;
use App\Domains\Projects\Models\Project;

class ProjectControllerTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    protected User $user;
    protected Project $project;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = $this->actingAsUser();
        $this->project = $this->user->currentProject ?? Project::factory()->create(['owner_id' => $this->user->id]);
    }

    /**
     * Test index endpoint returns projects.
     */
    public function test_can_list_projects(): void
    {
        $response = $this->getJson('/api/projects');

        $response->assertStatus(200)
            ->assertJsonStructure([
                '*' => [
                    'id',
                    'name',
                    'status',
                    'created_at'
                ]
            ]);
    }

    /**
     * Test create project endpoint.
     */
    public function test_can_create_project(): void
    {
        $data = [
            'name' => $this->faker->words(3, true),
            'description' => $this->faker->paragraph(),
            'status' => 'active',
            'mode' => 'normal'
        ];

        $response = $this->postJson('/api/projects', $data);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'id',
                'name',
                'status',
                'owner_id'
            ]);
    }

    /**
     * Test show project endpoint.
     */
    public function test_can_view_project(): void
    {
        $response = $this->getJson("/api/projects/{$this->project->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'id',
                'name',
                'status',
                'description'
            ]);
    }

    /**
     * Test update project endpoint.
     */
    public function test_can_update_project(): void
    {
        $data = [
            'name' => 'Updated Project Name',
            'description' => 'Updated description'
        ];

        $response = $this->putJson("/api/projects/{$this->project->id}", $data);

        $response->assertStatus(200)
            ->assertJson([
                'name' => 'Updated Project Name'
            ]);
    }

    /**
     * Test delete project endpoint.
     */
    public function test_can_delete_project(): void
    {
        $response = $this->deleteJson("/api/projects/{$this->project->id}");

        $response->assertStatus(200);

        $this->assertDatabaseMissing('projects', [
            'id' => $this->project->id
        ]);
    }

    /**
     * Test user can only access own projects.
     */
    public function test_user_can_only_access_own_projects(): void
    {
        $otherUser = User::factory()->create();
        $otherProject = Project::factory()->create(['owner_id' => $otherUser->id]);

        $response = $this->getJson("/api/projects/{$otherProject->id}");

        $response->assertStatus(403);
    }

    /**
     * Test authentication is required.
     */
    public function test_authentication_required(): void
    {
        $this->withoutMiddleware();

        $response = $this->getJson('/api/projects');

        $response->assertStatus(401);
    }
}
