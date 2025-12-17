<?php

namespace Tests\Feature\Leads;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel;
use App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel;
use App\Domains\Leads\Infrastructure\Persistence\Eloquent\LeadModel;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Mockery;

class LeadControllerTest extends TestCase
{
    use RefreshDatabase;

    protected UserModel $user;
    protected ProjectModel $project;
    protected LeadModel $lead;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = UserModel::factory()->create();
        $this->project = ProjectModel::factory()->create(['user_id' => $this->user->id]);
        $this->lead = LeadModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id
        ]);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    /** @test */
    public function it_requires_authentication_for_all_routes()
    {
        $routes = [
            'GET' => '/api/leads',
            'POST' => '/api/leads',
            'GET' => "/api/leads/{$this->lead->id}",
            'PUT' => "/api/leads/{$this->lead->id}",
            'DELETE' => "/api/leads/{$this->lead->id}",
            'PATCH' => "/api/leads/{$this->lead->id}/status",
            'PATCH' => "/api/leads/{$this->lead->id}/score",
            'PATCH' => "/api/leads/{$this->lead->id}/tags",
            'PATCH' => "/api/leads/{$this->lead->id}/assign",
            'GET' => "/api/leads/{$this->lead->id}/activities",
            'POST' => "/api/leads/{$this->lead->id}/activities",
            'GET' => '/api/leads/metrics',
            'GET' => '/api/leads/analytics',
            'PATCH' => '/api/leads/bulk-update',
            'DELETE' => '/api/leads/bulk-delete',
            'PATCH' => '/api/leads/bulk-update-tags',
            'PATCH' => '/api/leads/bulk-update-status',
            'POST' => '/api/leads/import',
            'GET' => '/api/leads/export'
        ];

        foreach ($routes as $method => $route) {
            $response = $this->{$method}($route);
            $response->assertStatus(401);
        }
    }

    /** @test */
    public function authenticated_user_can_view_leads_page()
    {
        $this->actingAs($this->user);

        $response = $this->get('/leads');

        $response->assertOk()
                ->assertInertia(fn ($page) => 
                    $page->component('Leads/index')
                         ->has('leads')
                         ->has('stats')
                         ->has('charts')
                         ->has('top_leads')
                         ->has('filters')
                         ->where('stats.total', 1)
                         ->where('stats.new', 1)
                         ->where('stats.qualified', 0)
                         ->where('stats.converted', 0)
                         ->where('stats.lost', 0)
                );
    }

    /** @test */
    public function authenticated_user_can_list_leads()
    {
        $this->actingAs($this->user);

        $response = $this->getJson('/api/leads');

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => [
                        '*' => [
                            'id',
                            'name',
                            'email',
                            'phone',
                            'company',
                            'source',
                            'status',
                            'score',
                            'tags',
                            'assigned_to',
                            'created_at',
                            'updated_at'
                        ]
                    ]
                ]);
    }

    /** @test */
    public function it_can_create_lead_with_valid_data()
    {
        $this->actingAs($this->user);

        $leadData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '+1234567890',
            'company' => 'Example Corp',
            'source' => 'form',
            'status' => 'new',
            'score' => 50,
            'tags' => ['hot', 'qualified'],
            'assigned_to' => $this->user->id
        ];

        $response = $this->postJson('/api/leads', $leadData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'id',
                    'name',
                    'email',
                    'phone',
                    'company',
                    'source',
                    'status',
                    'score',
                    'tags',
                    'assigned_to',
                    'created_at',
                    'updated_at'
                ]);

        $this->assertDatabaseHas('leads', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '+1234567890',
            'company' => 'Example Corp',
            'source' => 'form',
            'status' => 'new',
            'score' => 50
        ]);
    }

    /** @test */
    public function it_validates_required_fields_when_creating_lead()
    {
        $this->actingAs($this->user);

        $response = $this->postJson('/api/leads', []);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['name', 'email']);
    }

    /** @test */
    public function it_validates_email_format()
    {
        $this->actingAs($this->user);

        $leadData = [
            'name' => 'John Doe',
            'email' => 'invalid-email'
        ];

        $response = $this->postJson('/api/leads', $leadData);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['email']);
    }

    /** @test */
    public function it_validates_unique_email()
    {
        $this->actingAs($this->user);

        $existingLead = LeadModel::factory()->create([
            'project_id' => $this->project->id,
            'email' => 'existing@example.com'
        ]);

        $leadData = [
            'name' => 'John Doe',
            'email' => 'existing@example.com'
        ];

        $response = $this->postJson('/api/leads', $leadData);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['email']);
    }

    /** @test */
    public function it_can_show_specific_lead()
    {
        $this->actingAs($this->user);

        $response = $this->getJson("/api/leads/{$this->lead->id}");

        $response->assertOk()
                ->assertJsonStructure([
                    'id',
                    'name',
                    'email',
                    'phone',
                    'company',
                    'source',
                    'status',
                    'score',
                    'tags',
                    'assigned_to',
                    'created_at',
                    'updated_at'
                ]);
    }

    /** @test */
    public function it_returns_404_for_non_existent_lead()
    {
        $this->actingAs($this->user);

        $response = $this->getJson('/api/leads/99999');

        $response->assertStatus(404);
    }

    /** @test */
    public function it_can_update_lead()
    {
        $this->actingAs($this->user);

        $updateData = [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'phone' => '+9876543210',
            'company' => 'Updated Corp',
            'source' => 'api',
            'status' => 'qualified',
            'score' => 75,
            'tags' => ['updated', 'qualified']
        ];

        $response = $this->putJson("/api/leads/{$this->lead->id}", $updateData);

        $response->assertOk()
                ->assertJsonStructure([
                    'id',
                    'name',
                    'email',
                    'phone',
                    'company',
                    'source',
                    'status',
                    'score',
                    'tags',
                    'created_at',
                    'updated_at'
                ]);

        $this->assertDatabaseHas('leads', [
            'id' => $this->lead->id,
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'phone' => '+9876543210',
            'company' => 'Updated Corp',
            'source' => 'api',
            'status' => 'qualified',
            'score' => 75
        ]);
    }

    /** @test */
    public function it_can_update_lead_status()
    {
        $this->actingAs($this->user);

        $response = $this->patchJson("/api/leads/{$this->lead->id}/status", [
            'new_status' => 'qualified'
        ]);

        $response->assertOk()
                ->assertJsonStructure([
                    'id',
                    'name',
                    'email',
                    'status',
                    'created_at',
                    'updated_at'
                ]);

        $this->assertDatabaseHas('leads', [
            'id' => $this->lead->id,
            'status' => 'qualified'
        ]);
    }

    /** @test */
    public function it_validates_status_when_updating()
    {
        $this->actingAs($this->user);

        $response = $this->patchJson("/api/leads/{$this->lead->id}/status", []);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['new_status']);
    }

    /** @test */
    public function it_can_update_lead_score()
    {
        $this->actingAs($this->user);

        $response = $this->patchJson("/api/leads/{$this->lead->id}/score", [
            'score' => 85
        ]);

        $response->assertOk()
                ->assertJsonStructure([
                    'message'
                ]);

        $this->assertDatabaseHas('leads', [
            'id' => $this->lead->id,
            'score' => 85
        ]);
    }

    /** @test */
    public function it_validates_score_range()
    {
        $this->actingAs($this->user);

        $response = $this->patchJson("/api/leads/{$this->lead->id}/score", [
            'score' => 150
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['score']);
    }

    /** @test */
    public function it_can_update_lead_tags()
    {
        $this->actingAs($this->user);

        $response = $this->patchJson("/api/leads/{$this->lead->id}/tags", [
            'tags' => ['hot', 'qualified', 'priority']
        ]);

        $response->assertOk()
                ->assertJsonStructure([
                    'message'
                ]);

        $this->assertDatabaseHas('leads', [
            'id' => $this->lead->id,
            'tags' => json_encode(['hot', 'qualified', 'priority'])
        ]);
    }

    /** @test */
    public function it_validates_tags_array()
    {
        $this->actingAs($this->user);

        $response = $this->patchJson("/api/leads/{$this->lead->id}/tags", [
            'tags' => 'not-an-array'
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['tags']);
    }

    /** @test */
    public function it_can_assign_lead_to_user()
    {
        $this->actingAs($this->user);

        $otherUser = UserModel::factory()->create();

        $response = $this->patchJson("/api/leads/{$this->lead->id}/assign", [
            'user_id' => $otherUser->id
        ]);

        $response->assertOk()
                ->assertJsonStructure([
                    'message'
                ]);

        $this->assertDatabaseHas('leads', [
            'id' => $this->lead->id,
            'assigned_to' => $otherUser->id
        ]);
    }

    /** @test */
    public function it_validates_user_exists_when_assigning()
    {
        $this->actingAs($this->user);

        $response = $this->patchJson("/api/leads/{$this->lead->id}/assign", [
            'user_id' => 99999
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['user_id']);
    }

    /** @test */
    public function it_can_get_lead_activities()
    {
        $this->actingAs($this->user);

        $response = $this->getJson("/api/leads/{$this->lead->id}/activities");

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => []
                ]);
    }

    /** @test */
    public function it_can_record_lead_activity()
    {
        $this->actingAs($this->user);

        $activityData = [
            'type' => 'call',
            'description' => 'Called the lead to discuss their needs',
            'metadata' => [
                'duration' => 15,
                'outcome' => 'interested'
            ]
        ];

        $response = $this->postJson("/api/leads/{$this->lead->id}/activities", $activityData);

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => [
                        'id',
                        'type',
                        'description',
                        'metadata',
                        'user_id',
                        'created_at'
                    ]
                ]);
    }

    /** @test */
    public function it_validates_activity_required_fields()
    {
        $this->actingAs($this->user);

        $response = $this->postJson("/api/leads/{$this->lead->id}/activities", []);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['type', 'description']);
    }

    /** @test */
    public function it_can_get_lead_metrics()
    {
        $this->actingAs($this->user);

        $response = $this->getJson('/api/leads/metrics');

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => [
                        'total_leads',
                        'new_leads',
                        'qualified_leads',
                        'conversion_rate',
                        'average_score'
                    ]
                ]);
    }

    /** @test */
    public function it_can_get_lead_analytics()
    {
        $this->actingAs($this->user);

        $response = $this->getJson('/api/leads/analytics');

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => [
                        'conversion_funnel',
                        'source_performance',
                        'score_distribution',
                        'activity_trends',
                        'total_leads',
                        'conversion_rate',
                        'average_score'
                    ]
                ]);
    }

    /** @test */
    public function it_can_bulk_update_leads()
    {
        $this->actingAs($this->user);

        $lead2 = LeadModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id
        ]);

        $response = $this->patchJson('/api/leads/bulk-update', [
            'ids' => [$this->lead->id, $lead2->id],
            'updates' => [
                'status' => 'qualified',
                'score' => 75
            ]
        ]);

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => []
                ]);

        $this->assertDatabaseHas('leads', [
            'id' => $this->lead->id,
            'status' => 'qualified',
            'score' => 75
        ]);

        $this->assertDatabaseHas('leads', [
            'id' => $lead2->id,
            'status' => 'qualified',
            'score' => 75
        ]);
    }

    /** @test */
    public function it_can_bulk_delete_leads()
    {
        $this->actingAs($this->user);

        $lead2 = LeadModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id
        ]);

        $response = $this->deleteJson('/api/leads/bulk-delete', [
            'ids' => [$this->lead->id, $lead2->id]
        ]);

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => []
                ]);

        $this->assertDatabaseMissing('leads', [
            'id' => $this->lead->id
        ]);

        $this->assertDatabaseMissing('leads', [
            'id' => $lead2->id
        ]);
    }

    /** @test */
    public function it_can_bulk_update_lead_tags()
    {
        $this->actingAs($this->user);

        $lead2 = LeadModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id
        ]);

        $response = $this->patchJson('/api/leads/bulk-update-tags', [
            'ids' => [$this->lead->id, $lead2->id],
            'tags' => ['hot', 'qualified']
        ]);

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => []
                ]);

        $this->assertDatabaseHas('leads', [
            'id' => $this->lead->id,
            'tags' => json_encode(['hot', 'qualified'])
        ]);

        $this->assertDatabaseHas('leads', [
            'id' => $lead2->id,
            'tags' => json_encode(['hot', 'qualified'])
        ]);
    }

    /** @test */
    public function it_can_bulk_update_lead_status()
    {
        $this->actingAs($this->user);

        $lead2 = LeadModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id
        ]);

        $response = $this->patchJson('/api/leads/bulk-update-status', [
            'ids' => [$this->lead->id, $lead2->id],
            'status' => 'converted',
            'reason' => 'Successfully converted to customer'
        ]);

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => []
                ]);

        $this->assertDatabaseHas('leads', [
            'id' => $this->lead->id,
            'status' => 'converted',
            'status_reason' => 'Successfully converted to customer'
        ]);

        $this->assertDatabaseHas('leads', [
            'id' => $lead2->id,
            'status' => 'converted',
            'status_reason' => 'Successfully converted to customer'
        ]);
    }

    /** @test */
    public function it_can_import_leads_from_csv()
    {
        $this->actingAs($this->user);
        Storage::fake('public');

        $csvContent = "email,nome,telefone,empresa,fonte,status\njohn@example.com,John Doe,+1234567890,Example Corp,form,new\njane@example.com,Jane Smith,+0987654321,Test Corp,api,new";
        $file = UploadedFile::fake()->createWithContent('leads.csv', $csvContent);

        $response = $this->postJson('/api/leads/import', [
            'file' => $file
        ]);

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => [
                        'total_rows',
                        'imported',
                        'errors',
                        'error_details'
                    ]
                ]);

        $this->assertDatabaseHas('leads', [
            'email' => 'john@example.com',
            'name' => 'John Doe',
            'phone' => '+1234567890',
            'company' => 'Example Corp',
            'source' => 'form',
            'status' => 'new'
        ]);

        $this->assertDatabaseHas('leads', [
            'email' => 'jane@example.com',
            'name' => 'Jane Smith',
            'phone' => '+0987654321',
            'company' => 'Test Corp',
            'source' => 'api',
            'status' => 'new'
        ]);
    }

    /** @test */
    public function it_validates_file_format_for_import()
    {
        $this->actingAs($this->user);

        $file = UploadedFile::fake()->create('leads.txt', 100);

        $response = $this->postJson('/api/leads/import', [
            'file' => $file
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['file']);
    }

    /** @test */
    public function it_can_export_leads()
    {
        $this->actingAs($this->user);

        $response = $this->getJson('/api/leads/export');

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => [
                        '*' => [
                            'id',
                            'name',
                            'email',
                            'phone',
                            'company',
                            'source',
                            'status',
                            'score',
                            'tags',
                            'assigned_to',
                            'created_at',
                            'updated_at'
                        ]
                    ]
                ]);
    }

    /** @test */
    public function it_can_export_leads_with_filters()
    {
        $this->actingAs($this->user);

        $response = $this->getJson('/api/leads/export?status=new&source=form');

        $response->assertOk()
                ->assertJsonStructure([
                    'data' => []
                ]);
    }

    /** @test */
    public function it_can_delete_lead()
    {
        $this->actingAs($this->user);

        $response = $this->deleteJson("/api/leads/{$this->lead->id}");

        $response->assertOk()
                ->assertJsonStructure([
                    'message'
                ]);

        $this->assertDatabaseMissing('leads', [
            'id' => $this->lead->id
        ]);
    }

    /** @test */
    public function it_returns_404_when_deleting_non_existent_lead()
    {
        $this->actingAs($this->user);

        $response = $this->deleteJson('/api/leads/99999');

        $response->assertStatus(404);
    }

    /** @test */
    public function it_handles_creation_errors_gracefully()
    {
        $this->actingAs($this->user);

        // Mock the service to throw an exception
        $this->mock(\App\Domains\Leads\Contracts\LeadServiceInterface::class, function ($mock) {
            $mock->shouldReceive('createLead')
                 ->andThrow(new \Exception('Service error'));
        });

        $leadData = [
            'name' => 'John Doe',
            'email' => 'john@example.com'
        ];

        $response = $this->postJson('/api/leads', $leadData);

        $response->assertStatus(500);
    }

    /** @test */
    public function it_handles_update_errors_gracefully()
    {
        $this->actingAs($this->user);

        // Mock the service to throw an exception
        $this->mock(\App\Domains\Leads\Contracts\LeadServiceInterface::class, function ($mock) {
            $mock->shouldReceive('updateLead')
                 ->andThrow(new \Exception('Service error'));
        });

        $updateData = [
            'name' => 'Updated Name'
        ];

        $response = $this->putJson("/api/leads/{$this->lead->id}", $updateData);

        $response->assertStatus(500);
    }

    /** @test */
    public function it_handles_status_update_errors_gracefully()
    {
        $this->actingAs($this->user);

        // Mock the service to throw an exception
        $this->mock(\App\Domains\Leads\Contracts\LeadServiceInterface::class, function ($mock) {
            $mock->shouldReceive('updateLeadStatus')
                 ->andThrow(new \Exception('Status update failed'));
        });

        $response = $this->patchJson("/api/leads/{$this->lead->id}/status", [
            'new_status' => 'qualified'
        ]);

        $response->assertStatus(400)
                ->assertJsonStructure([
                    'message'
                ]);
    }

    /** @test */
    public function it_can_create_lead_with_minimal_data()
    {
        $this->actingAs($this->user);

        $leadData = [
            'name' => 'John Doe',
            'email' => 'john@example.com'
        ];

        $response = $this->postJson('/api/leads', $leadData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'id',
                    'name',
                    'email',
                    'created_at',
                    'updated_at'
                ]);
    }

    /** @test */
    public function it_can_create_lead_with_special_characters_in_name()
    {
        $this->actingAs($this->user);

        $leadData = [
            'name' => 'José da Silva-Santos',
            'email' => 'jose@example.com'
        ];

        $response = $this->postJson('/api/leads', $leadData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'id',
                    'name',
                    'email',
                    'created_at',
                    'updated_at'
                ]);
    }

    /** @test */
    public function it_can_create_lead_with_unicode_characters()
    {
        $this->actingAs($this->user);

        $leadData = [
            'name' => '张三',
            'email' => 'zhangsan@example.com'
        ];

        $response = $this->postJson('/api/leads', $leadData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'id',
                    'name',
                    'email',
                    'created_at',
                    'updated_at'
                ]);
    }

    /** @test */
    public function it_can_create_lead_with_long_name()
    {
        $this->actingAs($this->user);

        $leadData = [
            'name' => str_repeat('A', 255),
            'email' => 'longname@example.com'
        ];

        $response = $this->postJson('/api/leads', $leadData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'id',
                    'name',
                    'email',
                    'created_at',
                    'updated_at'
                ]);
    }

    /** @test */
    public function it_can_create_lead_with_long_email()
    {
        $this->actingAs($this->user);

        $leadData = [
            'name' => 'John Doe',
            'email' => str_repeat('a', 200) . '@example.com'
        ];

        $response = $this->postJson('/api/leads', $leadData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'id',
                    'name',
                    'email',
                    'created_at',
                    'updated_at'
                ]);
    }

    /** @test */
    public function it_can_create_lead_with_long_phone()
    {
        $this->actingAs($this->user);

        $leadData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '+12345678901234567890'
        ];

        $response = $this->postJson('/api/leads', $leadData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'id',
                    'name',
                    'email',
                    'phone',
                    'created_at',
                    'updated_at'
                ]);
    }

    /** @test */
    public function it_can_create_lead_with_long_company()
    {
        $this->actingAs($this->user);

        $leadData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'company' => str_repeat('A', 255)
        ];

        $response = $this->postJson('/api/leads', $leadData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'id',
                    'name',
                    'email',
                    'company',
                    'created_at',
                    'updated_at'
                ]);
    }

    /** @test */
    public function it_can_create_lead_with_many_tags()
    {
        $this->actingAs($this->user);

        $leadData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'tags' => ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6', 'tag7', 'tag8', 'tag9', 'tag10']
        ];

        $response = $this->postJson('/api/leads', $leadData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'id',
                    'name',
                    'email',
                    'tags',
                    'created_at',
                    'updated_at'
                ]);
    }

    /** @test */
    public function it_can_create_lead_with_high_score()
    {
        $this->actingAs($this->user);

        $leadData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'score' => 100
        ];

        $response = $this->postJson('/api/leads', $leadData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'id',
                    'name',
                    'email',
                    'score',
                    'created_at',
                    'updated_at'
                ]);
    }

    /** @test */
    public function it_can_create_lead_with_zero_score()
    {
        $this->actingAs($this->user);

        $leadData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'score' => 0
        ];

        $response = $this->postJson('/api/leads', $leadData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'id',
                    'name',
                    'email',
                    'score',
                    'created_at',
                    'updated_at'
                ]);
    }

    /** @test */
    public function it_can_create_lead_with_all_statuses()
    {
        $this->actingAs($this->user);

        $statuses = ['new', 'contacted', 'qualified', 'converted', 'lost'];

        foreach ($statuses as $status) {
            $leadData = [
                'name' => "John Doe {$status}",
                'email' => "john{$status}@example.com",
                'status' => $status
            ];

            $response = $this->postJson('/api/leads', $leadData);

            $response->assertStatus(201)
                    ->assertJsonStructure([
                        'id',
                        'name',
                        'email',
                        'status',
                        'created_at',
                        'updated_at'
                    ]);
        }
    }

    /** @test */
    public function it_can_create_lead_with_all_sources()
    {
        $this->actingAs($this->user);

        $sources = ['form', 'import', 'api', 'manual', 'referral'];

        foreach ($sources as $source) {
            $leadData = [
                'name' => "John Doe {$source}",
                'email' => "john{$source}@example.com",
                'source' => $source
            ];

            $response = $this->postJson('/api/leads', $leadData);

            $response->assertStatus(201)
                    ->assertJsonStructure([
                        'id',
                        'name',
                        'email',
                        'source',
                        'created_at',
                        'updated_at'
                    ]);
        }
    }
}