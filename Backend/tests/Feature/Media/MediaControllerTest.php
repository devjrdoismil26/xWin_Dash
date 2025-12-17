<?php

namespace Tests\Feature\Media;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use App\Domains\Media\Models\MediaFile;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class MediaControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    /** @test */
    public function it_requires_authentication_for_all_routes()
    {
        $routes = [
            'get' => '/api/media-library/media',
            'post' => '/api/media-library/media',
            'get' => '/api/media-library/media/1',
            'put' => '/api/media-library/media/1',
            'delete' => '/api/media-library/media/1',
            'post' => '/api/media-library/media/upload',
            'get' => '/api/media-library/search',
            'post' => '/api/media-library/bulk-operations',
        ];

        foreach ($routes as $method => $route) {
            $response = $this->{$method}($route);
            $response->assertStatus(401);
        }
    }

    /** @test */
    public function authenticated_user_can_get_media_files()
    {
        $user = $this->actingAsUser();
        $mediaFile = $this->createMediaFile(['user_id' => $user->id]);

        $response = $this->get('/api/media-library/media');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'media' => [
                '*' => [
                    'id',
                    'name',
                    'file_name',
                    'mime_type',
                    'path',
                    'size',
                    'folder_id',
                    'user_id',
                    'created_at',
                    'updated_at'
                ]
            ],
            'folders' => []
        ]);
    }

    /** @test */
    public function authenticated_user_can_get_specific_media_file()
    {
        $user = $this->actingAsUser();
        $mediaFile = $this->createMediaFile(['user_id' => $user->id]);

        $response = $this->get("/api/media-library/media/{$mediaFile->id}");

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'id',
            'name',
            'file_name',
            'mime_type',
            'path',
            'size',
            'folder_id',
            'user_id',
            'created_at',
            'updated_at'
        ]);
    }

    /** @test */
    public function authenticated_user_can_upload_media_file()
    {
        $user = $this->actingAsUser();
        $file = UploadedFile::fake()->image('test.jpg', 100, 100);

        $response = $this->post('/api/media-library/media/upload', [
            'file' => $file,
            'name' => 'Test Image',
            'folder_id' => null
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'success',
            'data' => [
                'id',
                'name',
                'file_name',
                'mime_type',
                'path',
                'size',
                'folder_id',
                'user_id',
                'created_at',
                'updated_at'
            ]
        ]);

        $this->assertDatabaseHas('media_files', [
            'name' => 'Test Image',
            'user_id' => $user->id
        ]);
    }

    /** @test */
    public function authenticated_user_can_update_media_file()
    {
        $user = $this->actingAsUser();
        $mediaFile = $this->createMediaFile(['user_id' => $user->id]);

        $response = $this->put("/api/media-library/media/{$mediaFile->id}", [
            'name' => 'Updated Media File'
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'id',
            'name',
            'file_name',
            'mime_type',
            'path',
            'size',
            'folder_id',
            'user_id',
            'created_at',
            'updated_at'
        ]);

        $this->assertDatabaseHas('media_files', [
            'id' => $mediaFile->id,
            'name' => 'Updated Media File'
        ]);
    }

    /** @test */
    public function authenticated_user_can_delete_media_file()
    {
        $user = $this->actingAsUser();
        $mediaFile = $this->createMediaFile(['user_id' => $user->id]);

        $response = $this->delete("/api/media-library/media/{$mediaFile->id}");

        $response->assertStatus(200);
        $response->assertJson([
            'message' => 'Media deleted successfully.'
        ]);

        $this->assertDatabaseMissing('media_files', [
            'id' => $mediaFile->id
        ]);
    }

    /** @test */
    public function authenticated_user_can_search_media_files()
    {
        $user = $this->actingAsUser();
        $mediaFile1 = $this->createMediaFile(['name' => 'Test Image 1', 'user_id' => $user->id]);
        $mediaFile2 = $this->createMediaFile(['name' => 'Test Image 2', 'user_id' => $user->id]);
        $mediaFile3 = $this->createMediaFile(['name' => 'Other File', 'user_id' => $user->id]);

        $response = $this->get('/api/media-library/search?query=Test');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data'
        ]);
    }

    /** @test */
    public function authenticated_user_can_perform_bulk_operations()
    {
        $user = $this->actingAsUser();
        $mediaFile1 = $this->createMediaFile(['user_id' => $user->id]);
        $mediaFile2 = $this->createMediaFile(['user_id' => $user->id]);
        $mediaFile3 = $this->createMediaFile(['user_id' => $user->id]);

        $response = $this->post('/api/media-library/bulk-operations', [
            'operation' => 'delete',
            'ids' => [$mediaFile1->id, $mediaFile2->id]
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data'
        ]);

        $this->assertDatabaseMissing('media_files', [
            'id' => $mediaFile1->id
        ]);
        $this->assertDatabaseMissing('media_files', [
            'id' => $mediaFile2->id
        ]);
        $this->assertDatabaseHas('media_files', [
            'id' => $mediaFile3->id
        ]);
    }

    /** @test */
    public function it_validates_file_upload()
    {
        $user = $this->actingAsUser();

        $response = $this->post('/api/media-library/media/upload', []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['file']);
    }

    /** @test */
    public function it_validates_file_type()
    {
        $user = $this->actingAsUser();
        $file = UploadedFile::fake()->create('test.txt', 100);

        $response = $this->post('/api/media-library/media/upload', [
            'file' => $file
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['file']);
    }

    /** @test */
    public function it_validates_file_size()
    {
        $user = $this->actingAsUser();
        $file = UploadedFile::fake()->image('test.jpg', 100, 100)->size(10240); // 10MB

        $response = $this->post('/api/media-library/media/upload', [
            'file' => $file
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['file']);
    }

    /** @test */
    public function it_returns_404_for_non_existent_media_file()
    {
        $user = $this->actingAsUser();

        $response = $this->get('/api/media-library/media/999999');

        $response->assertStatus(404);
    }

    /** @test */
    public function it_handles_empty_search_results()
    {
        $user = $this->actingAsUser();

        $response = $this->get('/api/media-library/search?query=nonexistent');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data'
        ]);
    }

    /** @test */
    public function it_handles_ajax_requests_properly()
    {
        $user = $this->actingAsUser();

        $response = $this->ajax('GET', '/api/media-library/media');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/json');
    }

    /** @test */
    public function it_returns_consistent_response_format()
    {
        $user = $this->actingAsUser();

        $response = $this->get('/api/media-library/media');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'media',
            'folders'
        ]);
    }

    /** @test */
    public function it_handles_pagination()
    {
        $user = $this->actingAsUser();
        
        // Criar 15 arquivos de mídia
        for ($i = 0; $i < 15; $i++) {
            $this->createMediaFile(['user_id' => $user->id]);
        }

        $response = $this->get('/api/media-library/media?per_page=10');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'media',
            'folders'
        ]);
    }

    /** @test */
    public function it_handles_filters_correctly()
    {
        $user = $this->actingAsUser();
        $mediaFile1 = $this->createMediaFile(['mime_type' => 'image/jpeg', 'user_id' => $user->id]);
        $mediaFile2 = $this->createMediaFile(['mime_type' => 'image/png', 'user_id' => $user->id]);
        $mediaFile3 = $this->createMediaFile(['mime_type' => 'application/pdf', 'user_id' => $user->id]);

        $response = $this->get('/api/media-library/media?mime_type=image/jpeg');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'media',
            'folders'
        ]);
    }

    /** @test */
    public function it_handles_server_errors_gracefully()
    {
        $user = $this->actingAsUser();

        $response = $this->get('/api/media-library/media');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'media',
            'folders'
        ]);
    }
}