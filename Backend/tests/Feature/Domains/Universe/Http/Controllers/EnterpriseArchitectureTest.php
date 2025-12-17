<?php

namespace Tests\Feature\Domains\Universe\Http\Controllers;

use App\Models\User;
use App\Domains\Universe\Models\EnterpriseTenant;
use App\Domains\Universe\Models\EnterpriseUser;
use App\Domains\Universe\Models\EnterpriseProject;
use Database\Factories\EnterpriseTenantFactory;
use Database\Factories\EnterpriseUserFactory;
use Database\Factories\EnterpriseProjectFactory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class EnterpriseArchitectureTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        Sanctum::actingAs($this->user);
    }

    /** @test */
    public function it_can_list_tenants()
    {
        EnterpriseTenant::factory()->count(3)->create(['owner_id' => $this->user->id]);

        $response = $this->getJson('/api/universe/enterprise');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'data' => [
                            '*' => [
                                'id',
                                'name',
                                'domain',
                                'subdomain',
                                'plan_type',
                                'status',
                                'max_users',
                                'max_storage_gb'
                            ]
                        ]
                    ],
                    'message'
                ]);
    }

    /** @test */
    public function it_can_create_a_tenant()
    {
        $tenantData = [
            'name' => 'Test Company',
            'description' => 'Test company description',
            'domain' => 'testcompany.com',
            'subdomain' => 'testcompany',
            'plan_type' => 'professional',
            'max_users' => 50,
            'max_storage_gb' => 100
        ];

        $response = $this->postJson('/api/universe/enterprise', $tenantData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'id',
                        'name',
                        'domain',
                        'subdomain',
                        'plan_type',
                        'status'
                    ],
                    'message'
                ]);

        $this->assertDatabaseHas('enterprise_tenants', [
            'name' => 'Test Company',
            'domain' => 'testcompany.com',
            'subdomain' => 'testcompany',
            'owner_id' => $this->user->id
        ]);
    }

    /** @test */
    public function it_can_show_a_tenant()
    {
        $tenant = EnterpriseTenant::factory()->create(['owner_id' => $this->user->id]);

        $response = $this->getJson("/api/universe/enterprise/{$tenant->id}");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'id',
                        'name',
                        'domain',
                        'subdomain',
                        'plan_type',
                        'status',
                        'users',
                        'projects'
                    ],
                    'message'
                ]);
    }

    /** @test */
    public function it_can_update_a_tenant()
    {
        $tenant = EnterpriseTenant::factory()->create(['owner_id' => $this->user->id]);

        $updateData = [
            'name' => 'Updated Company Name',
            'description' => 'Updated description'
        ];

        $response = $this->putJson("/api/universe/enterprise/{$tenant->id}", $updateData);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data',
                    'message'
                ]);

        $this->assertDatabaseHas('enterprise_tenants', [
            'id' => $tenant->id,
            'name' => 'Updated Company Name'
        ]);
    }

    /** @test */
    public function it_can_delete_a_tenant()
    {
        $tenant = EnterpriseTenant::factory()->create(['owner_id' => $this->user->id]);

        $response = $this->deleteJson("/api/universe/enterprise/{$tenant->id}");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'message'
                ]);

        $this->assertSoftDeleted('enterprise_tenants', [
            'id' => $tenant->id
        ]);
    }

    /** @test */
    public function it_can_get_tenant_users()
    {
        $tenant = EnterpriseTenant::factory()->create(['owner_id' => $this->user->id]);
        EnterpriseUser::factory()->count(3)->create(['tenant_id' => $tenant->id]);

        $response = $this->getJson("/api/universe/enterprise/{$tenant->id}/users");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'data' => [
                            '*' => [
                                'id',
                                'role',
                                'status',
                                'user'
                            ]
                        ]
                    ],
                    'message'
                ]);
    }

    /** @test */
    public function it_can_add_user_to_tenant()
    {
        $tenant = EnterpriseTenant::factory()->create(['owner_id' => $this->user->id]);
        $newUser = User::factory()->create();

        $userData = [
            'user_id' => $newUser->id,
            'role' => 'member',
            'permissions' => ['read', 'write']
        ];

        $response = $this->postJson("/api/universe/enterprise/{$tenant->id}/users", $userData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'id',
                        'role',
                        'status',
                        'user_id'
                    ],
                    'message'
                ]);

        $this->assertDatabaseHas('enterprise_users', [
            'tenant_id' => $tenant->id,
            'user_id' => $newUser->id,
            'role' => 'member'
        ]);
    }

    /** @test */
    public function it_can_remove_user_from_tenant()
    {
        $tenant = EnterpriseTenant::factory()->create(['owner_id' => $this->user->id]);
        $enterpriseUser = EnterpriseUser::factory()->create(['tenant_id' => $tenant->id]);

        $response = $this->deleteJson("/api/universe/enterprise/{$tenant->id}/users/{$enterpriseUser->id}");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'message'
                ]);

        $this->assertSoftDeleted('enterprise_users', [
            'id' => $enterpriseUser->id
        ]);
    }

    /** @test */
    public function it_can_get_tenant_projects()
    {
        $tenant = EnterpriseTenant::factory()->create(['owner_id' => $this->user->id]);
        EnterpriseProject::factory()->count(3)->create(['tenant_id' => $tenant->id]);

        $response = $this->getJson("/api/universe/enterprise/{$tenant->id}/projects");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'data' => [
                            '*' => [
                                'id',
                                'name',
                                'description',
                                'status'
                            ]
                        ]
                    ],
                    'message'
                ]);
    }

    /** @test */
    public function it_can_create_project_in_tenant()
    {
        $tenant = EnterpriseTenant::factory()->create(['owner_id' => $this->user->id]);

        $projectData = [
            'name' => 'Test Project',
            'description' => 'Test project description'
        ];

        $response = $this->postJson("/api/universe/enterprise/{$tenant->id}/projects", $projectData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'id',
                        'name',
                        'description',
                        'status',
                        'tenant_id'
                    ],
                    'message'
                ]);

        $this->assertDatabaseHas('enterprise_projects', [
            'name' => 'Test Project',
            'tenant_id' => $tenant->id
        ]);
    }

    /** @test */
    public function it_can_get_tenant_audit_logs()
    {
        $tenant = EnterpriseTenant::factory()->create(['owner_id' => $this->user->id]);

        $response = $this->getJson("/api/universe/enterprise/{$tenant->id}/audit-logs");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data',
                    'message'
                ]);
    }

    /** @test */
    public function it_can_get_tenant_statistics()
    {
        $tenant = EnterpriseTenant::factory()->create(['owner_id' => $this->user->id]);

        $response = $this->getJson("/api/universe/enterprise/{$tenant->id}/stats");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'users_count',
                        'projects_count',
                        'active_users_count',
                        'active_projects_count',
                        'audit_logs_count',
                        'storage_usage'
                    ],
                    'message'
                ]);
    }

    /** @test */
    public function it_can_get_available_plan_types()
    {
        $response = $this->getJson('/api/universe/enterprise/plan-types');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'starter',
                        'professional',
                        'enterprise'
                    ],
                    'message'
                ]);
    }

    /** @test */
    public function it_validates_required_fields_when_creating_tenant()
    {
        $response = $this->postJson('/api/universe/enterprise', []);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['name', 'domain', 'subdomain', 'plan_type', 'max_users', 'max_storage_gb']);
    }

    /** @test */
    public function it_validates_plan_type_enum()
    {
        $tenantData = [
            'name' => 'Test Company',
            'domain' => 'test.com',
            'subdomain' => 'test',
            'plan_type' => 'invalid_plan',
            'max_users' => 10,
            'max_storage_gb' => 10
        ];

        $response = $this->postJson('/api/universe/enterprise', $tenantData);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['plan_type']);
    }

    /** @test */
    public function it_validates_unique_domain_and_subdomain()
    {
        EnterpriseTenant::factory()->create([
            'domain' => 'existing.com',
            'subdomain' => 'existing'
        ]);

        $tenantData = [
            'name' => 'Test Company',
            'domain' => 'existing.com',
            'subdomain' => 'existing',
            'plan_type' => 'starter',
            'max_users' => 10,
            'max_storage_gb' => 10
        ];

        $response = $this->postJson('/api/universe/enterprise', $tenantData);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['domain', 'subdomain']);
    }

    /** @test */
    public function it_cannot_access_other_users_tenants()
    {
        $otherUser = User::factory()->create();
        $tenant = EnterpriseTenant::factory()->create(['owner_id' => $otherUser->id]);

        $response = $this->getJson("/api/universe/enterprise/{$tenant->id}");

        $response->assertStatus(404);
    }
}