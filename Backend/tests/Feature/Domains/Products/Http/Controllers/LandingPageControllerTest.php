<?php

namespace Tests\Feature\Domains\Products\Http\Controllers;

use App\Domains\Products\Models\LandingPage;
use App\Domains\Products\Models\Product;
use App\Domains\Products\Models\LeadCaptureForm;
use App\Domains\Core\Models\User;
use App\Domains\Core\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class LandingPageControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Project $project;
    protected Product $product;
    protected LeadCaptureForm $form;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->project = Project::factory()->create();
        $this->product = Product::factory()->create([
            'project_id' => $this->project->id,
            'created_by' => $this->user->id,
        ]);
        $this->form = LeadCaptureForm::factory()->create([
            'project_id' => $this->project->id,
            'created_by' => $this->user->id,
        ]);

        Sanctum::actingAs($this->user);
    }

    /** @test */
    public function it_can_list_landing_pages()
    {
        LandingPage::factory()->count(3)->create([
            'project_id' => $this->project->id,
            'created_by' => $this->user->id,
        ]);

        $response = $this->getJson('/api/v1/products/landing-pages');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'slug',
                        'title',
                        'status',
                        'is_active',
                        'views_count',
                        'conversions_count',
                        'conversion_rate',
                        'created_at',
                    ]
                ],
                'meta' => [
                    'current_page',
                    'last_page',
                    'per_page',
                    'total',
                ]
            ]);
    }

    /** @test */
    public function it_can_create_a_landing_page()
    {
        $landingPageData = [
            'name' => 'Landing Page Teste',
            'description' => 'Descrição da landing page',
            'title' => 'Título da Landing Page',
            'meta_description' => 'Meta descrição para SEO',
            'content' => '<h1>Conteúdo da página</h1>',
            'hero_section' => [
                'title' => 'Hero Title',
                'subtitle' => 'Hero Subtitle',
                'image' => 'hero-image.jpg',
                'cta' => [
                    'text' => 'Saiba Mais',
                    'url' => '#contact'
                ]
            ],
            'status' => 'draft',
            'project_id' => $this->project->id,
            'product_id' => $this->product->id,
            'lead_capture_form_id' => $this->form->id,
        ];

        $response = $this->postJson('/api/v1/products/landing-pages', $landingPageData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'id',
                    'name',
                    'slug',
                    'title',
                    'status',
                    'is_active',
                ]
            ]);

        $this->assertDatabaseHas('landing_pages', [
            'name' => 'Landing Page Teste',
            'title' => 'Título da Landing Page',
            'status' => 'draft',
        ]);
    }

    /** @test */
    public function it_can_show_a_landing_page()
    {
        $landingPage = LandingPage::factory()->create([
            'project_id' => $this->project->id,
            'created_by' => $this->user->id,
        ]);

        $response = $this->getJson("/api/v1/products/landing-pages/{$landingPage->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'name',
                    'slug',
                    'title',
                    'status',
                    'is_active',
                    'views_count',
                    'conversions_count',
                    'conversion_rate',
                ]
            ]);
    }

    /** @test */
    public function it_can_update_a_landing_page()
    {
        $landingPage = LandingPage::factory()->create([
            'project_id' => $this->project->id,
            'created_by' => $this->user->id,
        ]);

        $updateData = [
            'name' => 'Landing Page Atualizada',
            'title' => 'Título Atualizado',
            'status' => 'published',
        ];

        $response = $this->putJson("/api/v1/products/landing-pages/{$landingPage->id}", $updateData);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'id',
                    'name',
                    'title',
                    'status',
                ]
            ]);

        $this->assertDatabaseHas('landing_pages', [
            'id' => $landingPage->id,
            'name' => 'Landing Page Atualizada',
            'title' => 'Título Atualizado',
            'status' => 'published',
        ]);
    }

    /** @test */
    public function it_can_delete_a_landing_page()
    {
        $landingPage = LandingPage::factory()->create([
            'project_id' => $this->project->id,
            'created_by' => $this->user->id,
        ]);

        $response = $this->deleteJson("/api/v1/products/landing-pages/{$landingPage->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message'
            ]);

        $this->assertSoftDeleted('landing_pages', [
            'id' => $landingPage->id,
        ]);
    }

    /** @test */
    public function it_can_publish_a_landing_page()
    {
        $landingPage = LandingPage::factory()->create([
            'project_id' => $this->project->id,
            'created_by' => $this->user->id,
            'status' => 'draft',
        ]);

        $response = $this->postJson("/api/v1/products/landing-pages/{$landingPage->id}/publish");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'id',
                    'status',
                ]
            ]);

        $this->assertDatabaseHas('landing_pages', [
            'id' => $landingPage->id,
            'status' => 'published',
        ]);
    }

    /** @test */
    public function it_can_archive_a_landing_page()
    {
        $landingPage = LandingPage::factory()->create([
            'project_id' => $this->project->id,
            'created_by' => $this->user->id,
            'status' => 'published',
        ]);

        $response = $this->postJson("/api/v1/products/landing-pages/{$landingPage->id}/archive");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'id',
                    'status',
                ]
            ]);

        $this->assertDatabaseHas('landing_pages', [
            'id' => $landingPage->id,
            'status' => 'archived',
        ]);
    }

    /** @test */
    public function it_can_duplicate_a_landing_page()
    {
        $landingPage = LandingPage::factory()->create([
            'project_id' => $this->project->id,
            'created_by' => $this->user->id,
        ]);

        $duplicateData = [
            'name' => 'Landing Page Duplicada',
        ];

        $response = $this->postJson("/api/v1/products/landing-pages/{$landingPage->id}/duplicate", $duplicateData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'id',
                    'name',
                    'slug',
                ]
            ]);

        $this->assertDatabaseHas('landing_pages', [
            'name' => 'Landing Page Duplicada',
        ]);
    }

    /** @test */
    public function it_can_get_landing_page_statistics()
    {
        LandingPage::factory()->count(3)->create([
            'project_id' => $this->project->id,
            'created_by' => $this->user->id,
        ]);

        $response = $this->getJson("/api/v1/products/landing-pages/statistics?project_id={$this->project->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'total_pages',
                    'published_pages',
                    'draft_pages',
                    'archived_pages',
                    'total_views',
                    'total_conversions',
                    'average_conversion_rate',
                ]
            ]);
    }

    /** @test */
    public function it_can_get_landing_pages_by_product()
    {
        LandingPage::factory()->count(2)->create([
            'project_id' => $this->project->id,
            'created_by' => $this->user->id,
            'product_id' => $this->product->id,
        ]);

        $response = $this->getJson("/api/v1/products/products/{$this->product->id}/landing-pages");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'slug',
                        'title',
                        'status',
                    ]
                ]
            ]);
    }

    /** @test */
    public function it_can_show_landing_page_by_slug_publicly()
    {
        $landingPage = LandingPage::factory()->create([
            'project_id' => $this->project->id,
            'created_by' => $this->user->id,
            'status' => 'published',
            'is_active' => true,
            'slug' => 'test-landing-page',
        ]);

        $response = $this->getJson("/api/v1/public/landing-pages/{$landingPage->slug}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'name',
                    'slug',
                    'title',
                    'status',
                    'is_active',
                ]
            ]);
    }

    /** @test */
    public function it_can_track_page_view_publicly()
    {
        $landingPage = LandingPage::factory()->create([
            'project_id' => $this->project->id,
            'created_by' => $this->user->id,
            'status' => 'published',
            'is_active' => true,
            'views_count' => 0,
        ]);

        $response = $this->postJson("/api/v1/public/landing-pages/{$landingPage->id}/track-view");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message'
            ]);

        $this->assertDatabaseHas('landing_pages', [
            'id' => $landingPage->id,
            'views_count' => 1,
        ]);
    }

    /** @test */
    public function it_can_track_conversion_publicly()
    {
        $landingPage = LandingPage::factory()->create([
            'project_id' => $this->project->id,
            'created_by' => $this->user->id,
            'status' => 'published',
            'is_active' => true,
            'conversions_count' => 0,
        ]);

        $response = $this->postJson("/api/v1/public/landing-pages/{$landingPage->id}/track-conversion");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message'
            ]);

        $this->assertDatabaseHas('landing_pages', [
            'id' => $landingPage->id,
            'conversions_count' => 1,
        ]);
    }

    /** @test */
    public function it_validates_required_fields_when_creating_landing_page()
    {
        $response = $this->postJson('/api/v1/products/landing-pages', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'name',
                'title',
                'status',
                'project_id',
            ]);
    }

    /** @test */
    public function it_validates_unique_slug()
    {
        $existingLandingPage = LandingPage::factory()->create([
            'project_id' => $this->project->id,
            'created_by' => $this->user->id,
            'slug' => 'unique-slug',
        ]);

        $landingPageData = [
            'name' => 'Landing Page Teste',
            'title' => 'Título da Landing Page',
            'slug' => 'unique-slug', // Same slug
            'status' => 'draft',
            'project_id' => $this->project->id,
        ];

        $response = $this->postJson('/api/v1/products/landing-pages', $landingPageData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['slug']);
    }
}