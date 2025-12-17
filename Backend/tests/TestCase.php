<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;
    use RefreshDatabase;
    use WithFaker;

    // ADICIONADO: Desabilita o middleware DevAutoAuth para todos os testes
    // Isso evita redirecionamentos inesperados ou problemas de autenticação
    // que podem interferir na execução dos testes de rota.
    protected $withoutMiddleware = [\App\Http\Middleware\DevAutoAuth::class];

    protected function setUp(): void
    {
        parent::setUp();

        // Configurações globais para testes
        $this->withoutVite();
        $this->withoutMix();
    }

    /**
     * Create a user for testing.
     */
    protected function createUser(array $attributes = []): \App\Models\User
    {
        return \App\Models\User::factory()->create($attributes);
    }

    /**
     * Create an admin user for testing.
     */
    protected function createAdmin(array $attributes = []): \App\Models\User
    {
        $user = $this->createUser($attributes);
        $user->assignRole('admin');

        return $user;
    }

    /**
     * Create a project for testing.
     */
    protected function createProject(array $attributes = []): \App\Models\Project
    {
        return \App\Models\Project::factory()->create($attributes);
    }

    /**
     * Assert that the response contains validation errors.
     */
    protected function assertValidationErrors($response, array $errors): void
    {
        $response->assertSessionHasErrors($errors);
    }

    /**
     * Create and authenticate user.
     */
    protected function actingAsUser(array $attributes = []): \App\Models\User
    {
        $user = $this->createUser($attributes);
        
        // Create a project for the user
        $project = \Database\Factories\Projects\ProjectFactory::new()->create([
            'owner_id' => $user->id,
            'is_active' => true
        ]);
        
        // Set the project as current for the user
        $user->update(['current_project_id' => $project->id]);
        
        $this->actingAs($user, 'sanctum');
        
        // Set the project in the request headers
        $this->withHeaders([
            'X-Project-ID' => $project->id
        ]);

        return $user;
    }

    /**
     * Create and authenticate admin.
     */
    protected function actingAsAdmin(array $attributes = []): \App\Models\User
    {
        $admin = $this->createAdmin($attributes);
        $this->actingAs($admin);

        return $admin;
    }

    /**
     * Make an AJAX request.
     */
    protected function ajax(string $method, string $uri, array $data = [], array $headers = []): \Illuminate\Testing\TestResponse
    {
        $headers['X-Requested-With'] = 'XMLHttpRequest';
        $headers['Accept'] = 'application/json';
        
        return $this->json($method, $uri, $data, $headers);
    }

    /**
     * Assert that the response is a successful JSON response.
     */
    protected function assertJsonSuccess(\Illuminate\Testing\TestResponse $response, array $structure = []): void
    {
        $response->assertStatus(200);
        $response->assertJsonStructure(array_merge(['success'], $structure));
        $response->assertJson(['success' => true]);
    }

    /**
     * Assert that the response is an error JSON response.
     */
    protected function assertJsonError(\Illuminate\Testing\TestResponse $response, int $status = 400): void
    {
        $response->assertStatus($status);
        $response->assertJsonStructure(['success', 'error']);
        $response->assertJson(['success' => false]);
    }



    /**
     * Create a lead and return it.
     */
    protected function createLead(array $attributes = []): \App\Domains\Leads\Infrastructure\Persistence\Eloquent\LeadModel
    {
        return \App\Domains\Leads\Infrastructure\Persistence\Eloquent\LeadModel::factory()->create($attributes);
    }

    /**
     * Create an activity log and return it.
     */
    protected function createActivityLog(array $attributes = []): \App\Domains\Activity\Infrastructure\Persistence\Eloquent\ActivityLogModel
    {
        return \App\Domains\Activity\Infrastructure\Persistence\Eloquent\ActivityLogModel::factory()->create($attributes);
    }

    /**
     * Create a media file and return it.
     */
    protected function createMediaFile(array $attributes = []): \App\Domains\Media\Models\MediaFile
    {
        return \App\Domains\Media\Models\MediaFile::factory()->create($attributes);
    }

    /**
     * Create a setting and return it.
     */
    protected function createSetting(array $attributes = []): \App\Domains\Core\Infrastructure\Persistence\Eloquent\SettingModel
    {
        return \App\Domains\Core\Infrastructure\Persistence\Eloquent\SettingModel::factory()->create($attributes);
    }

    /**
     * Create an analytics report and return it.
     */
    protected function createAnalyticsReport(array $attributes = []): \App\Domains\Analytics\Domain\AnalyticReport
    {
        return \App\Domains\Analytics\Domain\AnalyticReport::factory()->create($attributes);
    }

    /**
     * Assert that the response contains pagination data.
     */
    protected function assertPagination(\Illuminate\Testing\TestResponse $response, int $expectedCount = null): void
    {
        $response->assertJsonStructure([
            'data' => [],
            'meta' => [
                'current_page',
                'from',
                'last_page',
                'per_page',
                'to',
                'total'
            ]
        ]);

        if ($expectedCount !== null) {
            $response->assertJsonCount($expectedCount, 'data');
        }
    }



    /**
     * Assert that the response contains a specific error message.
     */
    protected function assertErrorMessage(\Illuminate\Testing\TestResponse $response, string $message): void
    {
        $response->assertJson(['error' => $message]);
    }

    /**
     * Assert that the response contains a specific success message.
     */
    protected function assertSuccessMessage(\Illuminate\Testing\TestResponse $response, string $message): void
    {
        $response->assertJson(['message' => $message]);
    }
}
