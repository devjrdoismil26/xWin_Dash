<?php

namespace Tests\Feature\Domains\Universe\Http\Controllers;

use App\Models\User;
use App\Domains\Universe\Models\ARVRSession;
use App\Domains\Universe\Models\ARVRObject;
use App\Domains\Universe\Models\ARVREvent;
use Database\Factories\ARVRSessionFactory;
use Database\Factories\ARVRObjectFactory;
use Database\Factories\ARVREventFactory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ARVRTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        Sanctum::actingAs($this->user);
    }

    /** @test */
    public function it_can_list_arvr_sessions()
    {
        ARVRSession::factory()->count(3)->create(['user_id' => $this->user->id]);

        $response = $this->getJson('/api/universe/arvr');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'data' => [
                            '*' => [
                                'id',
                                'session_name',
                                'session_type',
                                'status',
                                'started_at',
                                'ended_at',
                                'duration_seconds'
                            ]
                        ]
                    ],
                    'message'
                ]);
    }

    /** @test */
    public function it_can_create_an_arvr_session()
    {
        $sessionData = [
            'session_name' => 'Test AR Session',
            'session_type' => 'ar',
            'configuration' => [
                'environment' => 'office',
                'lighting' => 'natural'
            ],
            'spatial_data' => [
                'room_size' => '5x5x3',
                'scale' => '1:1'
            ]
        ];

        $response = $this->postJson('/api/universe/arvr', $sessionData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'id',
                        'session_name',
                        'session_type',
                        'status',
                        'configuration',
                        'spatial_data'
                    ],
                    'message'
                ]);

        $this->assertDatabaseHas('arvr_sessions', [
            'session_name' => 'Test AR Session',
            'session_type' => 'ar',
            'user_id' => $this->user->id
        ]);
    }

    /** @test */
    public function it_can_show_an_arvr_session()
    {
        $session = ARVRSession::factory()->create(['user_id' => $this->user->id]);

        $response = $this->getJson("/api/universe/arvr/{$session->id}");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'id',
                        'session_name',
                        'session_type',
                        'status',
                        'configuration',
                        'spatial_data',
                        'objects',
                        'events'
                    ],
                    'message'
                ]);
    }

    /** @test */
    public function it_can_update_an_arvr_session()
    {
        $session = ARVRSession::factory()->create(['user_id' => $this->user->id]);

        $updateData = [
            'session_name' => 'Updated Session Name',
            'configuration' => [
                'environment' => 'updated_environment'
            ]
        ];

        $response = $this->putJson("/api/universe/arvr/{$session->id}", $updateData);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data',
                    'message'
                ]);

        $this->assertDatabaseHas('arvr_sessions', [
            'id' => $session->id,
            'session_name' => 'Updated Session Name'
        ]);
    }

    /** @test */
    public function it_can_delete_an_arvr_session()
    {
        $session = ARVRSession::factory()->create(['user_id' => $this->user->id]);

        $response = $this->deleteJson("/api/universe/arvr/{$session->id}");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'message'
                ]);

        $this->assertSoftDeleted('arvr_sessions', [
            'id' => $session->id
        ]);
    }

    /** @test */
    public function it_can_start_an_arvr_session()
    {
        $session = ARVRSession::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'created'
        ]);

        $response = $this->postJson("/api/universe/arvr/{$session->id}/start");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'id',
                        'status',
                        'started_at'
                    ],
                    'message'
                ]);

        $this->assertDatabaseHas('arvr_sessions', [
            'id' => $session->id,
            'status' => 'active'
        ]);
    }

    /** @test */
    public function it_can_end_an_arvr_session()
    {
        $session = ARVRSession::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'active',
            'started_at' => now()->subHour()
        ]);

        $response = $this->postJson("/api/universe/arvr/{$session->id}/end");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'id',
                        'status',
                        'ended_at',
                        'duration_seconds'
                    ],
                    'message'
                ]);

        $this->assertDatabaseHas('arvr_sessions', [
            'id' => $session->id,
            'status' => 'completed'
        ]);
    }

    /** @test */
    public function it_can_get_session_objects()
    {
        $session = ARVRSession::factory()->create(['user_id' => $this->user->id]);
        ARVRObject::factory()->count(3)->create(['session_id' => $session->id]);

        $response = $this->getJson("/api/universe/arvr/{$session->id}/objects");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'data' => [
                            '*' => [
                                'id',
                                'object_name',
                                'object_type',
                                'position',
                                'rotation',
                                'scale',
                                'status'
                            ]
                        ]
                    ],
                    'message'
                ]);
    }

    /** @test */
    public function it_can_create_an_object_in_session()
    {
        $session = ARVRSession::factory()->create(['user_id' => $this->user->id]);

        $objectData = [
            'object_name' => 'Test Object',
            'object_type' => '3d_model',
            'position' => ['x' => 0, 'y' => 0, 'z' => 0],
            'rotation' => ['x' => 0, 'y' => 0, 'z' => 0, 'w' => 1],
            'scale' => ['x' => 1, 'y' => 1, 'z' => 1],
            'properties' => [
                'model_url' => '/models/test.glb',
                'material' => 'wood'
            ]
        ];

        $response = $this->postJson("/api/universe/arvr/{$session->id}/objects", $objectData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'id',
                        'object_name',
                        'object_type',
                        'position',
                        'rotation',
                        'scale',
                        'properties'
                    ],
                    'message'
                ]);

        $this->assertDatabaseHas('arvr_objects', [
            'object_name' => 'Test Object',
            'object_type' => '3d_model',
            'session_id' => $session->id
        ]);
    }

    /** @test */
    public function it_can_update_an_object()
    {
        $session = ARVRSession::factory()->create(['user_id' => $this->user->id]);
        $object = ARVRObject::factory()->create(['session_id' => $session->id]);

        $updateData = [
            'object_name' => 'Updated Object Name',
            'position' => ['x' => 1, 'y' => 1, 'z' => 1]
        ];

        $response = $this->putJson("/api/universe/arvr/objects/{$object->id}", $updateData);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data',
                    'message'
                ]);

        $this->assertDatabaseHas('arvr_objects', [
            'id' => $object->id,
            'object_name' => 'Updated Object Name'
        ]);
    }

    /** @test */
    public function it_can_delete_an_object()
    {
        $session = ARVRSession::factory()->create(['user_id' => $this->user->id]);
        $object = ARVRObject::factory()->create(['session_id' => $session->id]);

        $response = $this->deleteJson("/api/universe/arvr/objects/{$object->id}");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'message'
                ]);

        $this->assertSoftDeleted('arvr_objects', [
            'id' => $object->id
        ]);
    }

    /** @test */
    public function it_can_get_session_events()
    {
        $session = ARVRSession::factory()->create(['user_id' => $this->user->id]);
        ARVREvent::factory()->count(3)->create(['session_id' => $session->id]);

        $response = $this->getJson("/api/universe/arvr/{$session->id}/events");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'data' => [
                            '*' => [
                                'id',
                                'event_type',
                                'event_name',
                                'event_data',
                                'spatial_context'
                            ]
                        ]
                    ],
                    'message'
                ]);
    }

    /** @test */
    public function it_can_get_session_statistics()
    {
        $session = ARVRSession::factory()->create(['user_id' => $this->user->id]);
        ARVRObject::factory()->count(2)->create(['session_id' => $session->id]);
        ARVREvent::factory()->count(5)->create(['session_id' => $session->id]);

        $response = $this->getJson("/api/universe/arvr/{$session->id}/stats");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'session_id',
                        'session_name',
                        'session_type',
                        'status',
                        'duration_seconds',
                        'objects_count',
                        'events_count',
                        'active_objects_count'
                    ],
                    'message'
                ]);
    }

    /** @test */
    public function it_can_get_available_session_types()
    {
        $response = $this->getJson('/api/universe/arvr/session-types');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'ar',
                        'vr',
                        'mixed_reality'
                    ],
                    'message'
                ]);
    }

    /** @test */
    public function it_can_get_available_object_types()
    {
        $response = $this->getJson('/api/universe/arvr/object-types');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        '3d_model',
                        'text',
                        'image',
                        'video',
                        'audio',
                        'light'
                    ],
                    'message'
                ]);
    }

    /** @test */
    public function it_validates_required_fields_when_creating_session()
    {
        $response = $this->postJson('/api/universe/arvr', []);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['session_name', 'session_type']);
    }

    /** @test */
    public function it_validates_session_type_enum()
    {
        $sessionData = [
            'session_name' => 'Test Session',
            'session_type' => 'invalid_type'
        ];

        $response = $this->postJson('/api/universe/arvr', $sessionData);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['session_type']);
    }

    /** @test */
    public function it_validates_required_fields_when_creating_object()
    {
        $session = ARVRSession::factory()->create(['user_id' => $this->user->id]);

        $response = $this->postJson("/api/universe/arvr/{$session->id}/objects", []);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['object_name', 'object_type', 'position']);
    }

    /** @test */
    public function it_validates_object_type_enum()
    {
        $session = ARVRSession::factory()->create(['user_id' => $this->user->id]);

        $objectData = [
            'object_name' => 'Test Object',
            'object_type' => 'invalid_type',
            'position' => ['x' => 0, 'y' => 0, 'z' => 0]
        ];

        $response = $this->postJson("/api/universe/arvr/{$session->id}/objects", $objectData);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['object_type']);
    }

    /** @test */
    public function it_cannot_access_other_users_sessions()
    {
        $otherUser = User::factory()->create();
        $session = ARVRSession::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->getJson("/api/universe/arvr/{$session->id}");

        $response->assertStatus(404);
    }
}