<?php

namespace Tests\Feature\UsersAuth;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function user_can_register_with_valid_data()
    {
        $userData = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'phone' => '+5511999999999'
        ];

        $response = $this->postJson('/api/v1/users/register', $userData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'data' => [
                        'id',
                        'name',
                        'email'
                    ]
                ]);

        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
            'name' => 'Test User'
        ]);
    }

    /** @test */
    public function user_cannot_register_with_invalid_data()
    {
        $userData = [
            'name' => '',
            'email' => 'invalid-email',
            'password' => '123',
            'password_confirmation' => '456'
        ];

        $response = $this->postJson('/api/v1/users/register', $userData);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['name', 'email', 'password']);
    }

    /** @test */
    public function user_cannot_register_with_existing_email()
    {
        User::factory()->create(['email' => 'test@example.com']);

        $userData = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123'
        ];

        $response = $this->postJson('/api/v1/users/register', $userData);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['email']);
    }

    /** @test */
    public function authenticated_user_can_list_users()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        User::factory()->count(5)->create();

        $response = $this->getJson('/api/v1/users/users');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'data' => [
                        '*' => [
                            'id',
                            'name',
                            'email'
                        ]
                    ],
                    'pagination' => [
                        'current_page',
                        'last_page',
                        'per_page',
                        'total'
                    ]
                ]);
    }

    /** @test */
    public function authenticated_user_can_view_user()
    {
        $user = User::factory()->create();
        $targetUser = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson("/api/v1/users/users/{$targetUser->id}");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'data' => [
                        'id',
                        'name',
                        'email'
                    ]
                ]);
    }

    /** @test */
    public function authenticated_user_can_update_user()
    {
        $user = User::factory()->create();
        $targetUser = User::factory()->create();
        Sanctum::actingAs($user);

        $updateData = [
            'name' => 'Updated Name',
            'phone' => '+5511888888888'
        ];

        $response = $this->putJson("/api/v1/users/users/{$targetUser->id}", $updateData);

        $response->assertStatus(200);

        $this->assertDatabaseHas('users', [
            'id' => $targetUser->id,
            'name' => 'Updated Name'
        ]);
    }

    /** @test */
    public function authenticated_user_can_delete_user()
    {
        $user = User::factory()->create();
        $targetUser = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->deleteJson("/api/v1/users/users/{$targetUser->id}");

        $response->assertStatus(204);

        $this->assertSoftDeleted('users', [
            'id' => $targetUser->id
        ]);
    }

    /** @test */
    public function unauthenticated_user_cannot_access_protected_routes()
    {
        $response = $this->getJson('/api/v1/users/users');

        $response->assertStatus(401);
    }

    /** @test */
    public function user_can_get_preferences()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson("/api/v1/users/users/{$user->id}/preferences");

        $response->assertStatus(200);
    }

    /** @test */
    public function user_can_update_preferences()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $preferences = [
            'theme' => 'dark',
            'language' => 'en',
            'notifications' => true
        ];

        $response = $this->putJson("/api/v1/users/users/{$user->id}/preferences", [
            'preferences' => $preferences
        ]);

        $response->assertStatus(200);
    }

    /** @test */
    public function user_can_get_activity()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson("/api/v1/users/users/{$user->id}/activity");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'data' => [
                        'activities'
                    ]
                ]);
    }
}
