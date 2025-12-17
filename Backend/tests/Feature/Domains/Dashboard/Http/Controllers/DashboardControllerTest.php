<?php

namespace Tests\Feature\Domains\Dashboard\Http\Controllers;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use App\Models\User;
use App\Domains\Projects\Models\Project;

class DashboardControllerTest extends TestCase
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
     * Test dashboard render endpoint.
     */
    public function test_can_render_dashboard(): void
    {
        $response = $this->get('/dashboard');

        $response->assertStatus(200);
    }

    /**
     * Test get dashboard data endpoint.
     */
    public function test_can_get_dashboard_data(): void
    {
        $response = $this->getJson('/dashboard/api/data');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'metrics',
                    'recent_activities',
                    'widgets'
                ]
            ]);
    }

    /**
     * Test get widget endpoint.
     */
    public function test_can_get_widget(): void
    {
        $response = $this->getJson('/dashboard/api/widgets/1');

        $response->assertJsonStructure([
            'success',
            'data' => [
                'id',
                'type',
                'configuration'
            ]
        ]);
    }

    /**
     * Test create widget endpoint.
     */
    public function test_can_create_widget(): void
    {
        $data = [
            'name' => $this->faker->words(2, true),
            'type' => 'metric_card',
            'configuration' => [
                'metric' => 'leads',
                'title' => 'Total Leads'
            ]
        ];

        $response = $this->postJson('/dashboard/api/widgets', $data);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'name',
                    'type'
                ]
            ]);
    }

    /**
     * Test export dashboard endpoint.
     */
    public function test_can_export_dashboard(): void
    {
        $data = [
            'format' => 'csv',
            'widgets' => [1, 2, 3]
        ];

        $response = $this->postJson('/dashboard/api/export', $data);

        $response->assertJsonStructure([
            'success'
        ]);
    }

    /**
     * Test share dashboard endpoint.
     */
    public function test_can_share_dashboard(): void
    {
        $data = [
            'permissions' => ['view'],
            'expires_at' => now()->addDays(7)->toISOString()
        ];

        $response = $this->postJson('/dashboard/api/share/1', $data);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'share_token',
                    'share_url'
                ]
            ]);
    }

    /**
     * Test authentication is required.
     */
    public function test_authentication_required(): void
    {
        $this->withoutMiddleware();

        $response = $this->getJson('/dashboard/api/data');

        $response->assertStatus(401);
    }
}
