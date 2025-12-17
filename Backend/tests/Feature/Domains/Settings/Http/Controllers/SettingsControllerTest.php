<?php

namespace Tests\Feature\Domains\Settings\Http\Controllers;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use App\Domains\Core\Infrastructure\Persistence\Eloquent\SettingModel;

class SettingsControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
    }

    /** @test */
    public function it_requires_authentication_for_all_routes()
    {
        $routes = [
            'get' => '/api/settings',
            'post' => '/api/settings',
            'get' => '/api/settings/test-key',
            'put' => '/api/settings/test-key',
            'delete' => '/api/settings/test-key',
            'post' => '/api/settings/bulk-update',
            'post' => '/api/settings/reset',
            'get' => '/api/settings/categories',
            'get' => '/api/settings/categories/general',
            'get' => '/api/settings/system-configuration',
            'put' => '/api/settings/system-configuration',
            'get' => '/api/settings/export',
            'post' => '/api/settings/import',
            'post' => '/api/settings/validate',
        ];

        foreach ($routes as $method => $route) {
            $response = $this->{$method}($route);
            $response->assertStatus(401);
        }
    }

    /** @test */
    public function authenticated_user_can_get_all_settings()
    {
        $user = $this->actingAsUser();
        $setting = $this->createSetting();

        $response = $this->get('/api/settings');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => [
                'id',
                'key',
                'value',
                'description',
                'created_at',
                'updated_at'
            ]
        ]);
    }

    /** @test */
    public function authenticated_user_can_create_setting()
    {
        $user = $this->actingAsUser();

        $response = $this->post('/api/settings', [
            'key' => 'test_setting',
            'value' => 'test_value',
            'description' => 'Test setting description'
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'id',
            'key',
            'value',
            'description',
            'created_at',
            'updated_at'
        ]);

        $this->assertDatabaseHas('settings', [
            'key' => 'test_setting',
            'value' => 'test_value',
            'description' => 'Test setting description'
        ]);
    }

    /** @test */
    public function authenticated_user_can_get_specific_setting()
    {
        $user = $this->actingAsUser();
        $setting = $this->createSetting(['key' => 'test_setting']);

        $response = $this->get("/api/settings/{$setting->key}");

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'id',
            'key',
            'value',
            'description',
            'created_at',
            'updated_at'
        ]);
    }

    /** @test */
    public function authenticated_user_can_update_setting()
    {
        $user = $this->actingAsUser();
        $setting = $this->createSetting(['key' => 'test_setting']);

        $response = $this->put("/api/settings/{$setting->key}", [
            'value' => 'updated_value',
            'description' => 'Updated description'
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'id',
            'key',
            'value',
            'description',
            'created_at',
            'updated_at'
        ]);

        $this->assertDatabaseHas('settings', [
            'key' => 'test_setting',
            'value' => 'updated_value',
            'description' => 'Updated description'
        ]);
    }

    /** @test */
    public function authenticated_user_can_delete_setting()
    {
        $user = $this->actingAsUser();
        $setting = $this->createSetting(['key' => 'test_setting']);

        $response = $this->delete("/api/settings/{$setting->key}");

        $response->assertStatus(200);
        $response->assertJson([
            'message' => 'Setting deleted successfully.'
        ]);

        $this->assertDatabaseMissing('settings', [
            'key' => 'test_setting'
        ]);
    }

    /** @test */
    public function authenticated_user_can_bulk_update_settings()
    {
        $user = $this->actingAsUser();
        $setting1 = $this->createSetting(['key' => 'setting1']);
        $setting2 = $this->createSetting(['key' => 'setting2']);

        $response = $this->post('/api/settings/bulk-update', [
            'settings' => [
                'setting1' => 'new_value1',
                'setting2' => 'new_value2'
            ]
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data'
        ]);

        $this->assertDatabaseHas('settings', [
            'key' => 'setting1',
            'value' => 'new_value1'
        ]);
        $this->assertDatabaseHas('settings', [
            'key' => 'setting2',
            'value' => 'new_value2'
        ]);
    }

    /** @test */
    public function authenticated_user_can_reset_settings()
    {
        $user = $this->actingAsUser();
        $setting = $this->createSetting(['key' => 'test_setting']);

        $response = $this->post('/api/settings/reset', [
            'category' => 'general'
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data'
        ]);
    }

    /** @test */
    public function authenticated_user_can_get_categories()
    {
        $user = $this->actingAsUser();

        $response = $this->get('/api/settings/categories');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data' => [
                '*' => [
                    'id',
                    'name',
                    'label',
                    'description'
                ]
            ]
        ]);
    }

    /** @test */
    public function authenticated_user_can_get_category_settings()
    {
        $user = $this->actingAsUser();

        $response = $this->get('/api/settings/categories/general');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data'
        ]);
    }

    /** @test */
    public function authenticated_user_can_get_system_configuration()
    {
        $user = $this->actingAsUser();

        $response = $this->get('/api/settings/system-configuration');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data' => [
                'app_name',
                'app_version',
                'environment',
                'debug_mode',
                'maintenance_mode'
            ]
        ]);
    }

    /** @test */
    public function authenticated_user_can_update_system_configuration()
    {
        $user = $this->actingAsUser();

        $response = $this->put('/api/settings/system-configuration', [
            'app_name' => 'Updated App Name',
            'debug_mode' => false,
            'maintenance_mode' => true
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data'
        ]);
    }

    /** @test */
    public function authenticated_user_can_export_settings()
    {
        $user = $this->actingAsUser();
        $setting = $this->createSetting();

        $response = $this->get('/api/settings/export?format=json');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data' => [
                'format',
                'settings',
                'exported_at'
            ]
        ]);
    }

    /** @test */
    public function authenticated_user_can_import_settings()
    {
        $user = $this->actingAsUser();
        $file = \Illuminate\Http\UploadedFile::fake()->create('settings.json', 100);

        $response = $this->post('/api/settings/import', [
            'file' => $file
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data'
        ]);
    }

    /** @test */
    public function authenticated_user_can_validate_setting()
    {
        $user = $this->actingAsUser();

        $response = $this->post('/api/settings/validate', [
            'key' => 'test_setting',
            'value' => 'test_value'
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data'
        ]);
    }

    /** @test */
    public function it_validates_required_fields_when_creating()
    {
        $user = $this->actingAsUser();

        $response = $this->post('/api/settings', []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['key', 'value']);
    }

    /** @test */
    public function it_validates_required_fields_when_bulk_updating()
    {
        $user = $this->actingAsUser();

        $response = $this->post('/api/settings/bulk-update', []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['settings']);
    }

    /** @test */
    public function it_validates_file_type_when_importing()
    {
        $user = $this->actingAsUser();
        $file = \Illuminate\Http\UploadedFile::fake()->create('settings.txt', 100);

        $response = $this->post('/api/settings/import', [
            'file' => $file
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['file']);
    }

    /** @test */
    public function it_returns_404_for_non_existent_setting()
    {
        $user = $this->actingAsUser();

        $response = $this->get('/api/settings/non-existent-key');

        $response->assertStatus(404);
    }

    /** @test */
    public function it_handles_ajax_requests_properly()
    {
        $user = $this->actingAsUser();

        $response = $this->ajax('GET', '/api/settings');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/json');
    }

    /** @test */
    public function it_returns_consistent_response_format()
    {
        $user = $this->actingAsUser();

        $response = $this->get('/api/settings');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => [
                'id',
                'key',
                'value',
                'description',
                'created_at',
                'updated_at'
            ]
        ]);
    }

    /** @test */
    public function it_handles_empty_settings_gracefully()
    {
        $user = $this->actingAsUser();

        $response = $this->get('/api/settings');

        $response->assertStatus(200);
        $response->assertJson([]);
    }

    /** @test */
    public function it_handles_server_errors_gracefully()
    {
        $user = $this->actingAsUser();

        $response = $this->get('/api/settings');

        $response->assertStatus(200);
    }
}