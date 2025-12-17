<?php

namespace Tests\Feature\Domains\Categorization\Http\Controllers;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use App\Models\User;
use App\Domains\Projects\Models\Project;

class CategoryControllerTest extends TestCase
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
     * Test index endpoint returns categories.
     */
    public function test_can_list_categories(): void
    {
        $response = $this->get(route('categories.index'));

        $response->assertStatus(200);
    }

    /**
     * Test create category endpoint.
     */
    public function test_can_create_category(): void
    {
        $data = [
            'name' => $this->faker->words(2, true),
            'description' => $this->faker->paragraph(),
        ];

        $response = $this->post(route('categories.store'), $data);

        $response->assertStatus(200);
    }

    /**
     * Test show category endpoint.
     */
    public function test_can_view_category(): void
    {
        $response = $this->get(route('categories.show', 1));

        $response->assertStatus(200);
    }

    /**
     * Test update category endpoint.
     */
    public function test_can_update_category(): void
    {
        $data = [
            'name' => 'Updated Category Name'
        ];

        $response = $this->put(route('categories.update', 1), $data);

        $response->assertStatus(200);
    }

    /**
     * Test delete category endpoint.
     */
    public function test_can_delete_category(): void
    {
        $response = $this->delete(route('categories.destroy', 1));

        $response->assertStatus(200);
    }

    /**
     * Test authentication is required.
     */
    public function test_authentication_required(): void
    {
        $this->withoutMiddleware();

        $response = $this->get(route('categories.index'));

        $response->assertRedirect(route('login'));
    }
}
