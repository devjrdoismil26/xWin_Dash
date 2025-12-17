<?php

namespace Tests\Unit\Auth;

use Tests\TestCase;
use App\Domains\Auth\Listeners\UserCreatedListener;
use App\Domains\Auth\Listeners\UserUpdatedListener;
use App\Domains\Auth\Listeners\UserDeletedListener;
use App\Domains\Users\Events\UserCreated;
use App\Domains\Users\Events\UserUpdated;
use App\Domains\Users\Events\UserDeleted;
use App\Domains\Users\Domain\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Mockery;

class DomainEventsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Event::fake();
    }

    /** @test */
    public function user_created_event_is_dispatched()
    {
        $user = new User(
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        );

        Event::dispatch(new UserCreated($user));

        Event::assertDispatched(UserCreated::class, function ($event) use ($user) {
            return $event->user->email === $user->email;
        });
    }

    /** @test */
    public function user_updated_event_is_dispatched()
    {
        $user = new User(
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        );

        $changes = ['name' => 'Updated Name'];

        Event::dispatch(new UserUpdated($user, $changes));

        Event::assertDispatched(UserUpdated::class, function ($event) use ($user, $changes) {
            return $event->user->email === $user->email && 
                   $event->changes === $changes;
        });
    }

    /** @test */
    public function user_deleted_event_is_dispatched()
    {
        $user = new User(
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        );

        Event::dispatch(new UserDeleted($user));

        Event::assertDispatched(UserDeleted::class, function ($event) use ($user) {
            return $event->user->email === $user->email;
        });
    }

    /** @test */
    public function user_created_listener_handles_event()
    {
        $user = new User(
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        );

        $event = new UserCreated($user);
        
        // Mock the services to avoid actual email sending
        $emailService = Mockery::mock('App\Domains\Auth\Domain\Services\EmailVerificationService');
        $emailService->shouldReceive('sendVerificationEmail')->once()->andReturn(true);
        
        $permissionService = Mockery::mock('App\Domains\Auth\Domain\Services\PermissionService');
        $permissionService->shouldReceive('assignDefaultPermissions')->once()->andReturn(true);
        
        $listener = new UserCreatedListener($emailService, $permissionService);
        $listener->handle($event);

        // Verify mocks were called (Mockery automatically verifies expectations)
        $this->assertTrue(true); // Mocks verify expectations automatically via shouldReceive
    }

    /** @test */
    public function user_updated_listener_handles_event()
    {
        $user = new User(
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        );

        $changes = ['status' => 'inactive'];
        $event = new UserUpdated($user, $changes);
        
        // Mock the session service
        $sessionService = Mockery::mock('App\Domains\Auth\Domain\Services\SessionService');
        $sessionService->shouldReceive('invalidateUserSessions')->once()->andReturn(true);
        
        $listener = new UserUpdatedListener($sessionService);
        $listener->handle($event);

        // Verify mock was called (Mockery automatically verifies expectations)
        $this->assertTrue(true); // Mocks verify expectations automatically via shouldReceive
    }

    /** @test */
    public function user_deleted_listener_handles_event()
    {
        $user = new User(
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        );

        $event = new UserDeleted($user);
        
        // Mock the services
        $sessionService = Mockery::mock('App\Domains\Auth\Domain\Services\SessionService');
        $sessionService->shouldReceive('invalidateUserSessions')->once()->andReturn(true);
        
        $tokenService = Mockery::mock('App\Domains\Auth\Domain\Services\TokenService');
        $tokenService->shouldReceive('revokeAllTokens')->once()->andReturn(true);
        
        $listener = new UserDeletedListener($sessionService, $tokenService);
        $listener->handle($event);

        // Verify mocks were called (Mockery automatically verifies expectations)
        $this->assertTrue(true); // Mocks verify expectations automatically via shouldReceive
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }
}