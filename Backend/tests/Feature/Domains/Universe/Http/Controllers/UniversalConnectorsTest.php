<?php

namespace Tests\Feature\Domains\Universe\Http\Controllers;

use App\Models\User;
use App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel;
use App\Domains\Universe\Models\UniversalConnector;
use Database\Factories\Projects\ProjectFactory;
use Database\Factories\UniversalConnectorFactory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class UniversalConnectorsTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        Sanctum::actingAs($this->user);
        
        // Create a project for the user to satisfy project.active middleware
        $project = ProjectFactory::new()->create([
            'owner_id' => $this->user->id,
            'slug' => 'test-project-' . uniqid()
        ]);
        
        // Set the project as active for the user
        $this->user->update(['current_project_id' => $project->id]);
    }

    /** @test */
    public function it_can_list_connectors()
    {
        UniversalConnector::factory()->count(3)->create(['user_id' => $this->user->id]);

        $response = $this->getJson('/api/universe/connectors');

        // Debug the response
        if ($response->status() !== 200) {
            dump('Response Status: ' . $response->status());
            dump('Response Content: ' . $response->getContent());
        }

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'data' => [
                            '*' => [
                                'id',
                                'name',
                                'type',
                                'status',
                                'is_connected',
                                'created_at',
                                'updated_at'
                            ]
                        ]
                    ],
                    'message'
                ]);
    }

    /** @test */
    public function it_can_create_a_connector()
    {
        $connectorData = [
            'name' => 'Test Connector',
            'type' => 'slack',
            'description' => 'Test connector description',
            'configuration' => [
                'webhook_url' => 'https://hooks.slack.com/test',
                'channel' => '#test'
            ]
        ];

        $response = $this->postJson('/api/universe/connectors', $connectorData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'id',
                        'name',
                        'type',
                        'status',
                        'configuration'
                    ],
                    'message'
                ]);

        $this->assertDatabaseHas('universe_connectors', [
            'name' => 'Test Connector',
            'type' => 'slack',
            'user_id' => $this->user->id
        ]);
    }

    /** @test */
    public function it_can_show_a_connector()
    {
        $connector = UniversalConnector::factory()->create(['user_id' => $this->user->id]);

        $response = $this->getJson("/api/universe/connectors/{$connector->id}");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'id',
                        'name',
                        'type',
                        'status',
                        'configuration',
                        'metadata'
                    ],
                    'message'
                ]);
    }

    /** @test */
    public function it_can_update_a_connector()
    {
        $connector = UniversalConnector::factory()->create(['user_id' => $this->user->id]);

        $updateData = [
            'name' => 'Updated Connector Name',
            'description' => 'Updated description'
        ];

        $response = $this->putJson("/api/universe/connectors/{$connector->id}", $updateData);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data',
                    'message'
                ]);

        $this->assertDatabaseHas('universe_connectors', [
            'id' => $connector->id,
            'name' => 'Updated Connector Name'
        ]);
    }

    /** @test */
    public function it_can_delete_a_connector()
    {
        $connector = UniversalConnector::factory()->create(['user_id' => $this->user->id]);

        $response = $this->deleteJson("/api/universe/connectors/{$connector->id}");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'message'
                ]);

        $this->assertSoftDeleted('universe_connectors', [
            'id' => $connector->id
        ]);
    }

    /** @test */
    public function it_can_test_connector_connection()
    {
        $connector = UniversalConnector::factory()->create(['user_id' => $this->user->id]);

        $response = $this->postJson("/api/universe/connectors/{$connector->id}/test");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data',
                    'message'
                ]);
    }

    /** @test */
    public function it_can_connect_disconnect_connector()
    {
        $connector = UniversalConnector::factory()->create(['user_id' => $this->user->id]);

        // Test connect
        $response = $this->postJson("/api/universe/connectors/{$connector->id}/connect", [
            'action' => 'connect'
        ]);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data',
                    'message'
                ]);

        // Test disconnect
        $response = $this->postJson("/api/universe/connectors/{$connector->id}/connect", [
            'action' => 'disconnect'
        ]);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data',
                    'message'
                ]);
    }

    /** @test */
    public function it_can_sync_connector_data()
    {
        $connector = UniversalConnector::factory()->create(['user_id' => $this->user->id]);

        $response = $this->postJson("/api/universe/connectors/{$connector->id}/sync");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data',
                    'message'
                ]);
    }

    /** @test */
    public function it_can_get_connector_metrics()
    {
        $connector = UniversalConnector::factory()->create(['user_id' => $this->user->id]);

        $response = $this->getJson("/api/universe/connectors/{$connector->id}/metrics");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data',
                    'message'
                ]);
    }

    /** @test */
    public function it_can_get_connector_logs()
    {
        $connector = UniversalConnector::factory()->create(['user_id' => $this->user->id]);

        $response = $this->getJson("/api/universe/connectors/{$connector->id}/logs");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data',
                    'message'
                ]);
    }

    /** @test */
    public function it_can_get_available_connector_types()
    {
        $response = $this->getJson('/api/universe/connectors/types');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data',
                    'message'
                ]);
    }

    /** @test */
    public function it_can_get_connector_templates()
    {
        $response = $this->getJson('/api/universe/connectors/templates');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data',
                    'message'
                ]);
    }

    /** @test */
    public function it_validates_required_fields_when_creating_connector()
    {
        $response = $this->postJson('/api/universe/connectors', []);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['name', 'type', 'configuration']);
    }

    /** @test */
    public function it_validates_connector_type_enum()
    {
        $connectorData = [
            'name' => 'Test Connector',
            'type' => 'invalid_type',
            'configuration' => []
        ];

        $response = $this->postJson('/api/universe/connectors', $connectorData);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['type']);
    }

    /** @test */
    public function it_cannot_access_other_users_connectors()
    {
        $otherUser = User::factory()->create();
        $connector = UniversalConnector::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->getJson("/api/universe/connectors/{$connector->id}");

        $response->assertStatus(404);
    }
}