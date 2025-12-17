<?php

namespace Tests\Feature\Integration;

use Tests\TestCase;
use App\Models\User;
use App\Domains\Users\Events\UserCreated;
use App\Domains\Users\Events\UserUpdated;
use App\Domains\Users\Events\UserDeleted;
use App\Domains\Auth\Listeners\UserCreatedListener;
use App\Domains\Auth\Listeners\UserUpdatedListener;
use App\Domains\Auth\Listeners\UserDeletedListener;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;

class DomainIntegrationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function user_registration_triggers_auth_domain_events()
    {
        Event::fake();

        $userData = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'phone' => '+5511999999999'
        ];

        $response = $this->postJson('/api/v1/users/register', $userData);

        $response->assertStatus(201);

        Event::assertDispatched(UserCreated::class, function ($event) use ($userData) {
            return $event->user->email === $userData['email'] &&
                   $event->user->name === $userData['name'];
        });
    }

    /** @test */
    public function user_created_event_triggers_auth_listeners()
    {
        Event::fake([UserCreated::class]);

        $user = User::factory()->create();

        Event::dispatch(new UserCreated($user));

        Event::assertDispatched(UserCreated::class);
    }

    /** @test */
    public function user_update_triggers_auth_domain_events()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        Event::fake();

        $updateData = [
            'name' => 'Updated Name',
            'phone' => '+5511888888888'
        ];

        $response = $this->putJson("/api/v1/users/{$user->id}", $updateData);

        $response->assertStatus(200);

        Event::assertDispatched(UserUpdated::class, function ($event) use ($user) {
            return $event->user->id === $user->id;
        });
    }

    /** @test */
    public function user_deletion_triggers_auth_domain_events()
    {
        $user = User::factory()->create();
        $admin = User::factory()->create(['role' => 'admin']);
        Sanctum::actingAs($admin);

        Event::fake();

        $response = $this->deleteJson("/api/v1/users/{$user->id}");

        $response->assertStatus(200);

        Event::assertDispatched(UserDeleted::class, function ($event) use ($user) {
            return $event->user->id === $user->id;
        });
    }

    /** @test */
    public function auth_domain_handles_user_created_event()
    {
        $user = User::factory()->create();

        // Simulate the event being dispatched
        $event = new UserCreated($user);
        $listener = new UserCreatedListener();

        // This should not throw any exceptions
        $this->expectNotToPerformAssertions();
        $listener->handle($event);
    }

    /** @test */
    public function auth_domain_handles_user_updated_event()
    {
        $user = User::factory()->create();

        // Simulate the event being dispatched
        $event = new UserUpdated($user, ['name' => 'New Name']);
        $listener = new UserUpdatedListener();

        // This should not throw any exceptions
        $this->expectNotToPerformAssertions();
        $listener->handle($event);
    }

    /** @test */
    public function auth_domain_handles_user_deleted_event()
    {
        $user = User::factory()->create();

        // Simulate the event being dispatched
        $event = new UserDeleted($user);
        $listener = new UserDeletedListener();

        // This should not throw any exceptions
        $this->expectNotToPerformAssertions();
        $listener->handle($event);
    }

    /** @test */
    public function core_domain_settings_work_independently()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        // Test creating a setting
        $settingData = [
            'key' => 'test_setting',
            'value' => 'test_value',
            'category' => 'general',
            'type' => 'string'
        ];

        $response = $this->postJson('/api/v1/core/settings', $settingData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'id',
                        'key',
                        'value',
                        'category'
                    ]
                ]);

        // Test retrieving the setting
        $response = $this->getJson('/api/v1/core/settings/test_setting');

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'data' => [
                        'key' => 'test_setting',
                        'value' => 'test_value'
                    ]
                ]);
    }

    /** @test */
    public function complete_user_workflow_integration()
    {
        // 1. User registration
        $userData = [
            'name' => 'Integration Test User',
            'email' => 'integration@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'phone' => '+5511999999999'
        ];

        $response = $this->postJson('/api/v1/users/register', $userData);
        $response->assertStatus(201);

        $user = User::where('email', 'integration@example.com')->first();

        // 2. User login
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'integration@example.com',
            'password' => 'password123'
        ]);

        $response->assertStatus(200);
        $token = $response->json('data.token');

        // 3. Access protected routes with token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->getJson('/api/v1/auth/profile');

        $response->assertStatus(200);

        // 4. Access core settings
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->getJson('/api/v1/core/settings');

        $response->assertStatus(200);

        // 5. Update user preferences
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->putJson("/api/v1/users/{$user->id}/preferences", [
            'theme' => 'dark',
            'language' => 'pt-BR'
        ]);

        $response->assertStatus(200);

        // 6. Logout
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/v1/auth/logout');

        $response->assertStatus(200);
    }

    /** @test */
    public function cross_domain_error_handling()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        // Test invalid setting creation
        $response = $this->postJson('/api/v1/core/settings', [
            'key' => '', // Invalid empty key
            'value' => 'test'
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['key']);

        // Test invalid user update
        $response = $this->putJson("/api/v1/users/{$user->id}", [
            'email' => 'invalid-email' // Invalid email format
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['email']);
    }
}