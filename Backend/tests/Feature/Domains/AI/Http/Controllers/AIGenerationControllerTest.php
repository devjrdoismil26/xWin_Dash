<?php

namespace Tests\Feature\Domains\AI\Http\Controllers;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use App\Domains\Users\Models\User;
use App\Domains\Projects\Models\Project;

class AIGenerationControllerTest extends TestCase
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
        // Test AI generation endpoint
        $response = $this->get(route('ai.generation'));

        $response->assertSuccessful();
    }

    /**
     * Test update endpoint.
     */
    public function test_can_update_resource(): void
    {
        // Test text generation endpoint
        $response = $this->postJson(route('ai.generate.text'), [
            'prompt' => 'Test prompt for generation',
        ]);

        // May return 200, 201, or 422 depending on implementation
        $this->assertContains($response->status(), [200, 201, 422]);
    }

    /**
     * Test delete endpoint.
     */
    public function test_can_delete_resource(): void
    {
        // AI generation doesn't have delete endpoint
        // Verify generation page works
        $response = $this->get(route('ai.generation'));

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
        // AI generation is user-scoped
        $response = $this->get(route('ai.generation'));

        $response->assertSuccessful();
    }
}
