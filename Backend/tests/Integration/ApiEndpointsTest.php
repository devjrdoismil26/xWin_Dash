<?php

namespace Tests\Integration;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;

/**
 * 🧪 Teste de Integração - Endpoints da API
 * 
 * Testa todos os 14 endpoints implementados para o frontend React
 */
class ApiEndpointsTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Criar usuário de teste
        $this->user = User::factory()->create();
    }

    /** @test */
    public function dashboard_data_endpoint_returns_valid_structure()
    {
        $response = $this->actingAs($this->user)
            ->getJson('/dashboard/api/data');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'metrics',
                    'recent_activities',
                    'top_leads',
                    'recent_projects',
                    'stats',
                ],
            ]);
    }

    /** @test */
    public function adstool_dashboard_endpoint_returns_valid_structure()
    {
        $response = $this->actingAs($this->user)
            ->getJson('/api/v1/adstool/dashboard');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'overview',
                    'campaigns',
                ],
            ]);
    }

    /** @test */
    public function analytics_dashboard_endpoint_returns_valid_structure()
    {
        $response = $this->actingAs($this->user)
            ->getJson('/analytics/api/dashboard');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'period',
                    'metrics',
                    'top_pages',
                    'traffic_sources',
                    'conversions',
                ],
            ]);
    }

    /** @test */
    public function analytics_manager_endpoint_returns_valid_structure()
    {
        $response = $this->actingAs($this->user)
            ->getJson('/analytics/api/manager');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'dashboard',
                    'reports',
                    'insights',
                ],
            ]);
    }

    /** @test */
    public function aura_dashboard_endpoint_returns_valid_structure()
    {
        $response = $this->actingAs($this->user)
            ->getJson('/aura/api/dashboard');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'metrics',
                    'stats',
                    'recent_chats',
                    'active_flows',
                    'connections',
                ],
            ]);
    }

    /** @test */
    public function email_marketing_dashboard_endpoint_returns_valid_structure()
    {
        $response = $this->actingAs($this->user)
            ->getJson('/email-marketing/api/dashboard');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'metrics',
                    'campaigns',
                    'templates',
                    'automations',
                    'performance_data',
                ],
            ]);
    }

    /** @test */
    public function media_library_endpoint_returns_valid_structure()
    {
        $response = $this->actingAs($this->user)
            ->getJson('/media/api/library');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'files',
                    'folders',
                    'stats',
                ],
            ]);
    }

    /** @test */
    public function products_catalog_endpoint_returns_valid_structure()
    {
        $response = $this->actingAs($this->user)
            ->getJson('/products/api/catalog');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'products',
                    'categories',
                    'stats',
                ],
            ]);
    }

    /** @test */
    public function workflows_dashboard_endpoint_returns_valid_structure()
    {
        $response = $this->actingAs($this->user)
            ->getJson('/workflows/api/dashboard');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'workflows',
                    'recent_executions',
                    'stats',
                ],
            ]);
    }

    /** @test */
    public function unauthenticated_requests_return_401()
    {
        $endpoints = [
            '/dashboard/api/data',
            '/api/v1/adstool/dashboard',
            '/analytics/api/dashboard',
            '/aura/api/dashboard',
            '/email-marketing/api/dashboard',
            '/media/api/library',
            '/products/api/catalog',
            '/workflows/api/dashboard',
        ];

        foreach ($endpoints as $endpoint) {
            $response = $this->getJson($endpoint);
            $response->assertStatus(401);
        }
    }
}
