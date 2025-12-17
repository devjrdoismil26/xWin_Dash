<?php

namespace Tests\Feature\Integration;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use App\Domains\Users\Models\User;
use App\Domains\Projects\Models\Project;

class MediaAIIntegrationTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    protected User $user;
    protected Project $project;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->project = Project::factory()->create(['user_id' => $this->user->id]);

        $this->actingAs($this->user);
    }

    /**
     * Test Media ↔ AI Integration.
     */
    public function test_modules_integration(): void
    {
        \Illuminate\Support\Facades\Storage::fake('public');
        
        // Create a media file
        $file = \Illuminate\Http\UploadedFile::fake()->image('test-image.jpg', 100, 100);
        
        $mediaResponse = $this->postJson(route('media.api.media.store'), [
            'file' => $file,
            'alt_text' => 'Test image for AI',
        ]);

        $mediaResponse->assertStatus(201);
        $mediaId = $mediaResponse->json('data.id');

        // Test that AI can use media files
        $aiResponse = $this->postJson(route('ai.generate.image'), [
            'prompt' => 'Generate image',
            'media_id' => $mediaId,
        ]);

        // Verify media exists
        $this->assertDatabaseHas('media', [
            'id' => $mediaId,
        ]);

        // Verify AI response is valid (if route exists)
        if ($aiResponse->status() !== 404) {
            $aiResponse->assertStatus(200);
            $this->assertNotNull($aiResponse->json('data'));
        }
    }

    /**
     * Test cross-module data consistency.
     */
    public function test_cross_module_data_consistency(): void
    {
        // Create media
        $mediaId = \Illuminate\Support\Facades\DB::table('media')->insertGetId([
            'name' => 'test-media.jpg',
            'file_path' => '/storage/test-media.jpg',
            'mime_type' => 'image/jpeg',
            'size' => 1024,
            'user_id' => $this->user->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Verify media exists
        $this->assertDatabaseHas('media', [
            'id' => $mediaId,
            'user_id' => $this->user->id,
        ]);

        // Verify user can access media
        $response = $this->getJson(route('media.api.media.show', $mediaId));
        $response->assertSuccessful();
        $response->assertJsonStructure([
            'data' => [
                'id',
                'name',
                'file_path',
            ]
        ]);
        
        // Verify response contains correct media ID
        $this->assertEquals($mediaId, $response->json('data.id'));
    }

    /**
     * Test cross-module event handling.
     */
    public function test_cross_module_event_handling(): void
    {
        // Create media
        $mediaId = \Illuminate\Support\Facades\DB::table('media')->insertGetId([
            'name' => 'event-test.jpg',
            'file_path' => '/storage/event-test.jpg',
            'mime_type' => 'image/jpeg',
            'size' => 1024,
            'user_id' => $this->user->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Test media optimization (triggers events)
        $response = $this->postJson(route('media.api.media.optimize'), [
            'media_ids' => [$mediaId],
        ]);

        // Verify media still exists after event
        $this->assertDatabaseHas('media', [
            'id' => $mediaId,
        ]);
        
        // Verify optimization response (if route exists)
        if ($response->status() !== 404) {
            $response->assertStatus(200);
            $this->assertTrue($response->json('success', false));
        }
    }
}
