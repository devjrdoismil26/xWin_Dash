<?php

namespace Tests\Feature\Domains\SocialBuffer\Http\Controllers;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class SocialBufferApiTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_requires_authentication()
    {
        $response = $this->getJson('/api/social-buffer/posts');
        $response->assertStatus(401);
    }

    /** @test */
    public function authenticated_user_can_list_posts()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson('/api/social-buffer/posts');
        $response->assertStatus(200);
    }

    /** @test */
    public function it_can_create_post()
    {
        $user = User::factory()->create();

        $data = [
            'content' => 'Test post content',
            'platform' => 'twitter',
            'scheduled_at' => now()->addHour()
        ];

        $response = $this->actingAs($user)->postJson('/api/social-buffer/posts', $data);
        $response->assertStatus(201);
    }
}
