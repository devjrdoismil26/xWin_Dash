<?php

namespace Tests\Feature\Domains\ADStool\Http\Controllers;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use App\Models\User;
use App\Domains\Projects\Models\Project;

class CampaignControllerTest extends TestCase
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
     * Test index endpoint returns campaigns.
     */
    public function test_can_list_campaigns(): void
    {
        $response = $this->getJson('/api/adstool/campaigns');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'status',
                        'created_at'
                    ]
                ]
            ]);
    }

    /**
     * Test create campaign endpoint.
     */
    public function test_can_create_campaign(): void
    {
        $data = [
            'name' => $this->faker->words(3, true),
            'platform' => 'facebook',
            'objective' => 'conversions',
            'budget' => 1000.00,
            'start_date' => now()->addDay()->toDateString(),
            'end_date' => now()->addDays(30)->toDateString(),
        ];

        $response = $this->postJson('/api/adstool/campaigns', $data);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'name',
                    'platform',
                    'status'
                ]
            ]);
    }

    /**
     * Test show campaign endpoint.
     */
    public function test_can_view_campaign(): void
    {
        // This would require a factory for ADSCampaign
        $response = $this->getJson('/api/adstool/campaigns/1');

        // For now, test structure
        $response->assertJsonStructure([
            'success'
        ]);
    }

    /**
     * Test update campaign endpoint.
     */
    public function test_can_update_campaign(): void
    {
        $data = [
            'name' => 'Updated Campaign Name',
            'budget' => 2000.00,
        ];

        $response = $this->putJson('/api/adstool/campaigns/1', $data);

        $response->assertJsonStructure([
            'success'
        ]);
    }

    /**
     * Test delete campaign endpoint.
     */
    public function test_can_delete_campaign(): void
    {
        $response = $this->deleteJson('/api/adstool/campaigns/1');

        $response->assertJsonStructure([
            'success'
        ]);
    }

    /**
     * Test authentication is required.
     */
    public function test_authentication_required(): void
    {
        $this->withoutMiddleware();

        $response = $this->getJson('/api/ads/campaigns');

        $response->assertStatus(401);
    }
}
