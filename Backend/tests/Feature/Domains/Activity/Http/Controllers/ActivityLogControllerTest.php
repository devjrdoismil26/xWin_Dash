<?php

namespace Tests\Feature\Domains\Activity\Http\Controllers;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Domains\Activity\Infrastructure\Persistence\Eloquent\ActivityLogModel;
use App\Models\User;

class ActivityLogControllerTest extends TestCase
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
            'get' => '/api/activity-logs',
            'get' => '/api/activity-logs/1',
            'get' => '/api/activity-logs/stats',
            'get' => '/api/activity-logs/export',
            'get' => '/api/activity-logs/real-time',
            'post' => '/api/activity-logs/bulk-delete',
            'get' => '/api/activity-logs/filters',
        ];

        foreach ($routes as $method => $route) {
            $response = $this->{$method}($route);
            $response->assertStatus(401);
        }
    }

    /** @test */
    public function authenticated_user_can_get_activity_logs()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        // Criar alguns logs de atividade
        ActivityLogModel::factory()->count(5)->create();

        $response = $this->get('/api/activity-logs');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'log_name',
                    'description',
                    'subject_type',
                    'subject_id',
                    'causer_type',
                    'causer_id',
                    'properties',
                    'created_at',
                    'updated_at'
                ]
            ]
        ]);
    }

    /** @test */
    public function authenticated_user_can_get_specific_activity_log()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $activityLog = ActivityLogModel::factory()->create();

        $response = $this->get("/api/activity-logs/{$activityLog->id}");

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                'id',
                'log_name',
                'description',
                'subject_type',
                'subject_id',
                'causer_type',
                'causer_id',
                'properties',
                'created_at',
                'updated_at'
            ]
        ]);
    }

    /** @test */
    public function it_returns_404_for_non_existent_activity_log()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->get('/api/activity-logs/999999');

        $response->assertStatus(404);
    }

    /** @test */
    public function authenticated_user_can_get_activity_stats()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        // Criar alguns logs de atividade
        ActivityLogModel::factory()->count(10)->create();

        $response = $this->get('/api/activity-logs/stats');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data' => [
                'total_logs',
                'logs_today',
                'logs_this_week',
                'logs_this_month',
                'top_actions',
                'top_users',
                'top_modules'
            ]
        ]);
    }

    /** @test */
    public function authenticated_user_can_export_activity_logs()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        // Criar alguns logs de atividade
        ActivityLogModel::factory()->count(5)->create();

        $response = $this->get('/api/activity-logs/export?format=csv');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data'
        ]);
    }

    /** @test */
    public function authenticated_user_can_get_real_time_updates()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->get('/api/activity-logs/real-time');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data'
        ]);
    }

    /** @test */
    public function authenticated_user_can_bulk_delete_activity_logs()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        // Criar alguns logs de atividade
        $log1 = ActivityLogModel::factory()->create();
        $log2 = ActivityLogModel::factory()->create();
        $log3 = ActivityLogModel::factory()->create();

        $response = $this->post('/api/activity-logs/bulk-delete', [
            'ids' => [$log1->id, $log2->id]
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'message'
        ]);

        // Verificar se os logs foram deletados
        $this->assertDatabaseMissing('activity_log', ['id' => $log1->id]);
        $this->assertDatabaseMissing('activity_log', ['id' => $log2->id]);
        $this->assertDatabaseHas('activity_log', ['id' => $log3->id]);
    }

    /** @test */
    public function authenticated_user_can_get_available_filters()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->get('/api/activity-logs/filters');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data'
        ]);
    }

    /** @test */
    public function it_can_filter_activity_logs_by_type()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        // Criar logs com diferentes tipos
        ActivityLogModel::factory()->create(['log_name' => 'login']);
        ActivityLogModel::factory()->create(['log_name' => 'logout']);
        ActivityLogModel::factory()->create(['log_name' => 'create']);

        $response = $this->get('/api/activity-logs?type=login');

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
    }

    /** @test */
    public function it_can_filter_activity_logs_by_date_range()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        // Criar logs com diferentes datas
        ActivityLogModel::factory()->create(['created_at' => now()->subDays(5)]);
        ActivityLogModel::factory()->create(['created_at' => now()->subDays(2)]);
        ActivityLogModel::factory()->create(['created_at' => now()]);

        $response = $this->get('/api/activity-logs?start_date=' . now()->subDays(3)->format('Y-m-d') . '&end_date=' . now()->format('Y-m-d'));

        $response->assertStatus(200);
        $response->assertJsonCount(2, 'data');
    }

    /** @test */
    public function it_can_paginate_activity_logs()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        // Criar 15 logs de atividade
        ActivityLogModel::factory()->count(15)->create();

        $response = $this->get('/api/activity-logs?per_page=10');

        $response->assertStatus(200);
        $response->assertJsonCount(10, 'data');
    }

    /** @test */
    public function it_validates_bulk_delete_request()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->post('/api/activity-logs/bulk-delete', []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['ids']);
    }

    /** @test */
    public function it_handles_empty_activity_logs_gracefully()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->get('/api/activity-logs');

        $response->assertStatus(200);
        $response->assertJsonCount(0, 'data');
    }
}