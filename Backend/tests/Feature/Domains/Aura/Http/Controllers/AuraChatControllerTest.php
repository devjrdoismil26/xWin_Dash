<?php

namespace Tests\Feature\Domains\Aura\Http\Controllers;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use App\Models\User;
use App\Domains\Projects\Models\Project;

class AuraChatControllerTest extends TestCase
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
     * Test index endpoint returns chats.
     */
    public function test_can_list_chats(): void
    {
        $response = $this->getJson('/api/aura/chats');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'data' => [
                        '*' => [
                            'id',
                            'phone_number',
                            'status',
                            'created_at'
                        ]
                    ]
                ]
            ]);
    }

    /**
     * Test show chat endpoint.
     */
    public function test_can_view_chat(): void
    {
        $response = $this->getJson('/api/aura/chats/1');

        $response->assertJsonStructure([
            'success'
        ]);
    }

    /**
     * Test send message endpoint.
     */
    public function test_can_send_message(): void
    {
        $data = [
            'message' => $this->faker->sentence(),
        ];

        $response = $this->postJson('/api/aura/chats/1/send-message', $data);

        $response->assertJsonStructure([
            'success'
        ]);
    }

    /**
     * Test get chat history endpoint.
     */
    public function test_can_get_chat_history(): void
    {
        $response = $this->getJson('/api/aura/chats/1/messages');

        $response->assertJsonStructure([
            'success',
            'data' => [
                '*' => [
                    'id',
                    'message',
                    'created_at'
                ]
            ]
        ]);
    }

    /**
     * Test authentication is required.
     */
    public function test_authentication_required(): void
    {
        $this->withoutMiddleware();

        $response = $this->getJson('/api/aura/chats');

        $response->assertStatus(401);
    }
}
