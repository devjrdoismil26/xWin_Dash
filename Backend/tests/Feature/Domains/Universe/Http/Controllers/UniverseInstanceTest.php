<?php

namespace Tests\Feature\Domains\Universe\Http\Controllers;

use App\Models\User;
use App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel;
use App\Domains\Universe\Infrastructure\Persistence\Eloquent\UniverseTemplateModel;
use App\Domains\Universe\Infrastructure\Persistence\Eloquent\UniverseInstanceModel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class UniverseInstanceTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected User $user;
    protected ProjectModel $project;
    protected UniverseTemplateModel $template;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        $this->project = ProjectModel::factory()->create([
            'owner_id' => $this->user->id
        ]);
        $this->template = UniverseTemplateModel::factory()->create([
            'user_id' => $this->user->id
        ]);
    }

    /** @test */
    public function it_can_list_universe_instances()
    {
        UniverseInstanceModel::factory()->count(3)->create([
            'user_id' => $this->user->id,
            'project_id' => $this->project->id
        ]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/universe/instances');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'description',
                        'user_id',
                        'project_id',
                        'template_id',
                        'is_active',
                        'created_at',
                        'updated_at'
                    ]
                ],
                'pagination' => [
                    'current_page',
                    'last_page',
                    'per_page',
                    'total'
                ]
            ]);
    }

    /** @test */
    public function it_can_create_universe_instance()
    {
        $data = [
            'name' => 'Test Instance',
            'description' => 'Test Description',
            'project_id' => $this->project->id,
            'template_id' => $this->template->id,
            'modules_config' => ['test' => true],
            'is_active' => true
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/api/universe/instances', $data);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Instância criada com sucesso'
            ]);

        $this->assertDatabaseHas('universe_instances', [
            'name' => 'Test Instance',
            'user_id' => $this->user->id,
            'project_id' => $this->project->id
        ]);
    }

    /** @test */
    public function it_can_show_universe_instance()
    {
        $instance = UniverseInstanceModel::factory()->create([
            'user_id' => $this->user->id,
            'project_id' => $this->project->id
        ]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/universe/instances/{$instance->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $instance->id,
                    'name' => $instance->name
                ]
            ]);
    }

    /** @test */
    public function it_can_update_universe_instance()
    {
        $instance = UniverseInstanceModel::factory()->create([
            'user_id' => $this->user->id,
            'project_id' => $this->project->id
        ]);

        $data = [
            'name' => 'Updated Instance',
            'description' => 'Updated Description'
        ];

        $response = $this->actingAs($this->user)
            ->putJson("/api/universe/instances/{$instance->id}", $data);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Instância atualizada com sucesso'
            ]);

        $this->assertDatabaseHas('universe_instances', [
            'id' => $instance->id,
            'name' => 'Updated Instance'
        ]);
    }

    /** @test */
    public function it_can_delete_universe_instance()
    {
        $instance = UniverseInstanceModel::factory()->create([
            'user_id' => $this->user->id,
            'project_id' => $this->project->id
        ]);

        $response = $this->actingAs($this->user)
            ->deleteJson("/api/universe/instances/{$instance->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Instância excluída com sucesso'
            ]);

        $this->assertSoftDeleted('universe_instances', [
            'id' => $instance->id
        ]);
    }

    /** @test */
    public function it_can_duplicate_universe_instance()
    {
        $instance = UniverseInstanceModel::factory()->create([
            'user_id' => $this->user->id,
            'project_id' => $this->project->id
        ]);

        $response = $this->actingAs($this->user)
            ->postJson("/api/universe/instances/{$instance->id}/duplicate");

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Instância duplicada com sucesso'
            ]);

        $this->assertDatabaseHas('universe_instances', [
            'name' => $instance->name . ' (Cópia)',
            'user_id' => $this->user->id
        ]);
    }

    /** @test */
    public function it_can_get_instances_by_project()
    {
        UniverseInstanceModel::factory()->count(2)->create([
            'user_id' => $this->user->id,
            'project_id' => $this->project->id
        ]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/universe/instances/project/{$this->project->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true
            ])
            ->assertJsonCount(2, 'data');
    }

    /** @test */
    public function it_can_get_universe_stats()
    {
        UniverseInstanceModel::factory()->count(3)->create([
            'user_id' => $this->user->id,
            'project_id' => $this->project->id
        ]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/universe/instances/stats');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true
            ])
            ->assertJsonStructure([
                'success',
                'data' => [
                    'total',
                    'active',
                    'by_status'
                ]
            ]);
    }

    /** @test */
    public function it_requires_authentication()
    {
        $response = $this->getJson('/api/universe/instances');

        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.'
            ]);
    }

    /** @test */
    public function it_validates_required_fields()
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/universe/instances', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    /** @test */
    public function it_validates_uuid_fields()
    {
        $data = [
            'name' => 'Test Instance',
            'project_id' => 'invalid-uuid',
            'template_id' => 'invalid-uuid'
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/api/universe/instances', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['project_id', 'template_id']);
    }

    /** @test */
    public function it_can_filter_instances_by_status()
    {
        UniverseInstanceModel::factory()->create([
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
            'is_active' => true
        ]);

        UniverseInstanceModel::factory()->create([
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
            'is_active' => false
        ]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/universe/instances?is_active=true');

        $response->assertStatus(200);
        
        $data = $response->json('data');
        $this->assertCount(1, $data);
        $this->assertTrue($data[0]['is_active']);
    }

    /** @test */
    public function it_can_search_instances()
    {
        UniverseInstanceModel::factory()->create([
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
            'name' => 'Marketing Campaign'
        ]);

        UniverseInstanceModel::factory()->create([
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
            'name' => 'Sales Dashboard'
        ]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/universe/instances?search=Marketing');

        $response->assertStatus(200);
        
        $data = $response->json('data');
        $this->assertCount(1, $data);
        $this->assertEquals('Marketing Campaign', $data[0]['name']);
    }
}