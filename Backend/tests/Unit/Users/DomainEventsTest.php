<?php

namespace Tests\Unit\Users;

use Tests\TestCase;
use App\Domains\Users\Events\UserCreated;
use App\Domains\Users\Events\UserUpdated;
use App\Domains\Users\Events\UserDeleted;
use App\Domains\Users\Domain\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;

class DomainEventsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Event::fake();
    }

    /** @test */
    public function user_created_event_has_correct_structure()
    {
        $user = new User(
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        );

        $event = new UserCreated($user, 'admin-123');

        $this->assertEquals($user, $event->user);
        $this->assertEquals('admin-123', $event->actorId);
    }

    /** @test */
    public function user_updated_event_has_correct_structure()
    {
        $user = new User(
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        );

        $changes = ['name' => 'Updated Name', 'status' => 'inactive'];
        $event = new UserUpdated($user, $changes, 'admin-123');

        $this->assertEquals($user, $event->user);
        $this->assertEquals($changes, $event->changes);
        $this->assertEquals('admin-123', $event->actorId);
    }

    /** @test */
    public function user_deleted_event_has_correct_structure()
    {
        $user = new User(
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        );

        $event = new UserDeleted($user, 'admin-123');

        $this->assertEquals($user, $event->user);
        $this->assertEquals('admin-123', $event->actorId);
    }

    /** @test */
    public function user_created_event_can_be_dispatched()
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
    public function user_updated_event_can_be_dispatched()
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
    public function user_deleted_event_can_be_dispatched()
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
    public function user_created_event_serializes_correctly()
    {
        $user = new User(
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        );

        $event = new UserCreated($user, 'admin-123');
        $serialized = serialize($event);
        $unserialized = unserialize($serialized);

        $this->assertEquals($event->user->email, $unserialized->user->email);
        $this->assertEquals($event->actorId, $unserialized->actorId);
    }

    /** @test */
    public function user_updated_event_serializes_correctly()
    {
        $user = new User(
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        );

        $changes = ['name' => 'Updated Name'];
        $event = new UserUpdated($user, $changes, 'admin-123');
        $serialized = serialize($event);
        $unserialized = unserialize($serialized);

        $this->assertEquals($event->user->email, $unserialized->user->email);
        $this->assertEquals($event->changes, $unserialized->changes);
        $this->assertEquals($event->actorId, $unserialized->actorId);
    }

    /** @test */
    public function user_deleted_event_serializes_correctly()
    {
        $user = new User(
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        );

        $event = new UserDeleted($user, 'admin-123');
        $serialized = serialize($event);
        $unserialized = unserialize($serialized);

        $this->assertEquals($event->user->email, $unserialized->user->email);
        $this->assertEquals($event->actorId, $unserialized->actorId);
    }
}