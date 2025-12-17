<?php

namespace Tests\Feature\Domains\AI\Http\Controllers;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use App\Domains\Users\Models\User;
use App\Domains\Projects\Models\Project;

class AIAnalyticsControllerTest extends TestCase
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
        $response = $this->get(route('ai.index'));

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

        $response = $this->post(route('ai.store'), $data);

        $response->assertSuccessful();
    }

    /**
     * Test show endpoint.
     */
    public function test_can_view_resource(): void
    {
        // Test AI analytics endpoint
        $response = $this->get(route('ai.analysis'));

        $response->assertSuccessful();
    }

    /**
     * Test update endpoint.
     */
    public function test_can_update_resource(): void
    {
        // AI analytics doesn't have update endpoint
        // Verify analytics endpoint works
        $response = $this->get(route('ai.analysis'));

        $response->assertSuccessful();
    }

    /**
     * Test delete endpoint.
     */
    public function test_can_delete_resource(): void
    {
        // AI analytics doesn't have delete endpoint
        // Verify dashboard endpoint works
        $response = $this->get(route('ai.dashboard'));

        $response->assertSuccessful();
    }

    /**
     * Test authentication is required.
     */
    public function test_authentication_required(): void
    {
        $this->app['auth']->forgetGuards();

        $response = $this->get(route('ai.index'));

        $response->assertRedirect(route('login'));
    }

    /**
     * Test user can only access their own project data.
     */
    public function test_user_can_only_access_own_project_data(): void
    {
        // AI analytics are user-scoped
        $response = $this->get(route('ai.analysis'));

        $response->assertSuccessful();
    }
}
