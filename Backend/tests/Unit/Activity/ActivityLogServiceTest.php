<?php

namespace Tests\Unit\Activity\Services;

use Tests\TestCase;
use App\Domains\Activity\Application\Services\ActivityLogService;
use App\Domains\Activity\Infrastructure\Persistence\Eloquent\ActivityLogModel;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;

class ActivityLogServiceTest extends TestCase
{
    use RefreshDatabase;

    protected ActivityLogService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(ActivityLogService::class);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    /** @test */
    public function it_can_be_instantiated()
    {
        $this->assertInstanceOf(ActivityLogService::class, $this->service);
    }

    /** @test */
    public function it_can_create_activity_log()
    {
        $user = User::factory()->create();
        $data = [
            'log_name' => 'test_action',
            'description' => 'Test activity log',
            'subject_type' => 'App\\Models\\User',
            'subject_id' => $user->id,
            'causer_type' => 'App\\Models\\User',
            'causer_id' => $user->id,
            'properties' => ['key' => 'value']
        ];

        $result = $this->service->create($data);

        $this->assertInstanceOf(ActivityLogModel::class, $result);
        $this->assertDatabaseHas('activity_log', [
            'log_name' => 'test_action',
            'description' => 'Test activity log',
            'subject_type' => 'App\\Models\\User',
            'subject_id' => $user->id,
            'causer_type' => 'App\\Models\\User',
            'causer_id' => $user->id,
        ]);
    }

    /** @test */
    public function it_can_find_activity_log_by_id()
    {
        $activityLog = ActivityLogModel::factory()->create();

        $result = $this->service->find($activityLog->id);

        $this->assertInstanceOf(ActivityLogModel::class, $result);
        $this->assertEquals($activityLog->id, $result->id);
    }

    /** @test */
    public function it_returns_null_when_finding_non_existent_activity_log()
    {
        $result = $this->service->find(999999);

        $this->assertNull($result);
    }

    /** @test */
    public function it_can_get_all_activity_logs()
    {
        ActivityLogModel::factory()->count(5)->create();

        $result = $this->service->all();

        $this->assertCount(5, $result);
    }

    /** @test */
    public function it_can_get_paginated_activity_logs()
    {
        ActivityLogModel::factory()->count(15)->create();

        $result = $this->service->paginate(10);

        $this->assertCount(10, $result->items());
        $this->assertEquals(15, $result->total());
    }

    /** @test */
    public function it_can_get_activity_logs_by_filters()
    {
        $user = User::factory()->create();
        
        ActivityLogModel::factory()->create(['log_name' => 'login', 'causer_id' => $user->id]);
        ActivityLogModel::factory()->create(['log_name' => 'logout', 'causer_id' => $user->id]);
        ActivityLogModel::factory()->create(['log_name' => 'create']);

        $filters = ['log_name' => 'login'];
        $result = $this->service->getByFilters($filters);

        $this->assertCount(1, $result);
        $this->assertEquals('login', $result->first()->log_name);
    }

    /** @test */
    public function it_can_get_activity_stats()
    {
        $user = User::factory()->create();
        
        // Criar logs com diferentes tipos e datas
        ActivityLogModel::factory()->create(['log_name' => 'login', 'created_at' => now()]);
        ActivityLogModel::factory()->create(['log_name' => 'logout', 'created_at' => now()]);
        ActivityLogModel::factory()->create(['log_name' => 'create', 'created_at' => now()->subDays(5)]);

        $stats = $this->service->getStats();

        $this->assertIsArray($stats);
        $this->assertArrayHasKey('total_logs', $stats);
        $this->assertArrayHasKey('logs_today', $stats);
        $this->assertArrayHasKey('logs_this_week', $stats);
        $this->assertArrayHasKey('logs_this_month', $stats);
        $this->assertArrayHasKey('top_actions', $stats);
        $this->assertArrayHasKey('top_users', $stats);
        $this->assertArrayHasKey('top_modules', $stats);
    }

    /** @test */
    public function it_can_export_activity_logs()
    {
        ActivityLogModel::factory()->count(5)->create();

        $result = $this->service->export('csv', []);

        $this->assertIsArray($result);
        $this->assertArrayHasKey('format', $result);
        $this->assertArrayHasKey('data', $result);
        $this->assertEquals('csv', $result['format']);
    }

    /** @test */
    public function it_can_get_recent_updates()
    {
        ActivityLogModel::factory()->create(['created_at' => now()]);
        ActivityLogModel::factory()->create(['created_at' => now()->subMinutes(5)]);
        ActivityLogModel::factory()->create(['created_at' => now()->subHours(2)]);

        $result = $this->service->getRecentUpdates();

        $this->assertIsArray($result);
        $this->assertCount(3, $result);
    }

    /** @test */
    public function it_can_bulk_delete_activity_logs()
    {
        $log1 = ActivityLogModel::factory()->create();
        $log2 = ActivityLogModel::factory()->create();
        $log3 = ActivityLogModel::factory()->create();

        $result = $this->service->bulkDelete([$log1->id, $log2->id]);

        $this->assertEquals(2, $result);
        $this->assertDatabaseMissing('activity_log', ['id' => $log1->id]);
        $this->assertDatabaseMissing('activity_log', ['id' => $log2->id]);
        $this->assertDatabaseHas('activity_log', ['id' => $log3->id]);
    }

    /** @test */
    public function it_can_get_available_filters()
    {
        $filters = $this->service->getAvailableFilters();

        $this->assertIsArray($filters);
        $this->assertArrayHasKey('log_names', $filters);
        $this->assertArrayHasKey('subject_types', $filters);
        $this->assertArrayHasKey('causer_types', $filters);
    }

    /** @test */
    public function it_can_clean_old_logs()
    {
        // Criar logs antigos e recentes
        ActivityLogModel::factory()->create(['created_at' => now()->subDays(35)]);
        ActivityLogModel::factory()->create(['created_at' => now()->subDays(25)]);
        ActivityLogModel::factory()->create(['created_at' => now()->subDays(15)]);
        ActivityLogModel::factory()->create(['created_at' => now()]);

        $result = $this->service->cleanOldLogs(30);

        $this->assertEquals(1, $result);
        $this->assertDatabaseCount('activity_log', 3);
    }

    /** @test */
    public function it_can_get_activity_logs_by_user()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        
        ActivityLogModel::factory()->create(['causer_id' => $user1->id]);
        ActivityLogModel::factory()->create(['causer_id' => $user1->id]);
        ActivityLogModel::factory()->create(['causer_id' => $user2->id]);

        $result = $this->service->getByUser($user1->id);

        $this->assertCount(2, $result);
    }

    /** @test */
    public function it_can_get_activity_logs_by_module()
    {
        ActivityLogModel::factory()->create(['subject_type' => 'App\\Models\\User']);
        ActivityLogModel::factory()->create(['subject_type' => 'App\\Models\\User']);
        ActivityLogModel::factory()->create(['subject_type' => 'App\\Models\\Project']);

        $result = $this->service->getByModule('App\\Models\\User');

        $this->assertCount(2, $result);
    }

    /** @test */
    public function it_can_get_activity_logs_by_date_range()
    {
        ActivityLogModel::factory()->create(['created_at' => now()->subDays(5)]);
        ActivityLogModel::factory()->create(['created_at' => now()->subDays(2)]);
        ActivityLogModel::factory()->create(['created_at' => now()]);

        $result = $this->service->getByDateRange(
            now()->subDays(3)->format('Y-m-d'),
            now()->format('Y-m-d')
        );

        $this->assertCount(2, $result);
    }
}