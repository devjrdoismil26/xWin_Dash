<?php

namespace Tests\Feature\Products;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Domains\Products\Infrastructure\Persistence\Eloquent\LandingPageModel;
use App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel;
use App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel;

class LandingPageViewControllerTest extends TestCase
{
    use RefreshDatabase;

    protected UserModel $user;
    protected ProjectModel $project;
    protected LandingPageModel $landingPage;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = UserModel::factory()->create();
        $this->project = ProjectModel::factory()->create(['user_id' => $this->user->id]);
        $this->landingPage = LandingPageModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id,
            'status' => 'published',
            'slug' => 'test-landing-page'
        ]);
    }

    /** @test */
    public function it_can_display_published_landing_page()
    {
        $response = $this->get("/landing/{$this->landingPage->slug}");

        $response->assertOk()
                ->assertViewIs('landing-pages.show')
                ->assertViewHas('page', $this->landingPage);
    }

    /** @test */
    public function it_returns_404_for_non_existent_landing_page()
    {
        $response = $this->get('/landing/non-existent-slug');

        $response->assertNotFound();
    }

    /** @test */
    public function it_returns_404_for_draft_landing_page()
    {
        $draftPage = LandingPageModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id,
            'status' => 'draft',
            'slug' => 'draft-page'
        ]);

        $response = $this->get("/landing/{$draftPage->slug}");

        $response->assertNotFound();
    }

    /** @test */
    public function it_returns_404_for_inactive_landing_page()
    {
        $inactivePage = LandingPageModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id,
            'status' => 'inactive',
            'slug' => 'inactive-page'
        ]);

        $response = $this->get("/landing/{$inactivePage->slug}");

        $response->assertNotFound();
    }

    /** @test */
    public function it_displays_landing_page_with_correct_content()
    {
        $landingPage = LandingPageModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id,
            'status' => 'published',
            'slug' => 'content-test-page',
            'title' => 'Test Landing Page',
            'content' => [
                'hero' => [
                    'title' => 'Welcome to Our Product',
                    'subtitle' => 'The best solution for your needs',
                    'cta_text' => 'Get Started Now'
                ],
                'features' => [
                    ['title' => 'Feature 1', 'description' => 'Description 1'],
                    ['title' => 'Feature 2', 'description' => 'Description 2']
                ]
            ]
        ]);

        $response = $this->get("/landing/{$landingPage->slug}");

        $response->assertOk()
                ->assertViewHas('page', function ($page) use ($landingPage) {
                    return $page->id === $landingPage->id &&
                           $page->title === 'Test Landing Page' &&
                           $page->content['hero']['title'] === 'Welcome to Our Product';
                });
    }

    /** @test */
    public function it_handles_landing_page_with_analytics_tracking()
    {
        $landingPage = LandingPageModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id,
            'status' => 'published',
            'slug' => 'analytics-test-page',
            'analytics' => [
                'google_analytics_id' => 'GA-123456789',
                'facebook_pixel_id' => 'FB-987654321',
                'track_conversions' => true
            ]
        ]);

        $response = $this->get("/landing/{$landingPage->slug}");

        $response->assertOk()
                ->assertViewHas('page', function ($page) use ($landingPage) {
                    return $page->analytics['google_analytics_id'] === 'GA-123456789' &&
                           $page->analytics['facebook_pixel_id'] === 'FB-987654321' &&
                           $page->analytics['track_conversions'] === true;
                });
    }

    /** @test */
    public function it_handles_landing_page_with_custom_domain()
    {
        $landingPage = LandingPageModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id,
            'status' => 'published',
            'slug' => 'custom-domain-page',
            'custom_domain' => 'example.com',
            'seo_settings' => [
                'meta_title' => 'Custom Meta Title',
                'meta_description' => 'Custom Meta Description',
                'og_image' => 'https://example.com/og-image.jpg'
            ]
        ]);

        $response = $this->get("/landing/{$landingPage->slug}");

        $response->assertOk()
                ->assertViewHas('page', function ($page) use ($landingPage) {
                    return $page->custom_domain === 'example.com' &&
                           $page->seo_settings['meta_title'] === 'Custom Meta Title';
                });
    }

    /** @test */
    public function it_tracks_page_view_when_landing_page_is_accessed()
    {
        $landingPage = LandingPageModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id,
            'status' => 'published',
            'slug' => 'tracking-test-page'
        ]);

        $response = $this->get("/landing/{$landingPage->slug}");

        $response->assertOk();

        // Verificar se o view foi registrado (assumindo que há um sistema de tracking)
        $this->assertDatabaseHas('landing_page_views', [
            'landing_page_id' => $landingPage->id,
            'ip_address' => '127.0.0.1'
        ]);
    }

    /** @test */
    public function it_handles_landing_page_with_ab_testing()
    {
        $landingPage = LandingPageModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id,
            'status' => 'published',
            'slug' => 'ab-test-page',
            'ab_testing' => [
                'enabled' => true,
                'variants' => [
                    'A' => ['title' => 'Variant A Title'],
                    'B' => ['title' => 'Variant B Title']
                ],
                'traffic_split' => 50
            ]
        ]);

        $response = $this->get("/landing/{$landingPage->slug}");

        $response->assertOk()
                ->assertViewHas('page', function ($page) use ($landingPage) {
                    return $page->ab_testing['enabled'] === true &&
                           count($page->ab_testing['variants']) === 2;
                });
    }

    /** @test */
    public function it_handles_landing_page_with_lead_capture_form()
    {
        $landingPage = LandingPageModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id,
            'status' => 'published',
            'slug' => 'lead-capture-page',
            'lead_capture' => [
                'enabled' => true,
                'form_fields' => [
                    ['name' => 'email', 'type' => 'email', 'required' => true],
                    ['name' => 'name', 'type' => 'text', 'required' => true],
                    ['name' => 'phone', 'type' => 'tel', 'required' => false]
                ],
                'cta_text' => 'Download Now',
                'thank_you_message' => 'Thank you for your interest!'
            ]
        ]);

        $response = $this->get("/landing/{$landingPage->slug}");

        $response->assertOk()
                ->assertViewHas('page', function ($page) use ($landingPage) {
                    return $page->lead_capture['enabled'] === true &&
                           count($page->lead_capture['form_fields']) === 3;
                });
    }

    /** @test */
    public function it_handles_landing_page_with_social_sharing()
    {
        $landingPage = LandingPageModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id,
            'status' => 'published',
            'slug' => 'social-sharing-page',
            'social_sharing' => [
                'enabled' => true,
                'platforms' => ['facebook', 'twitter', 'linkedin'],
                'custom_message' => 'Check out this amazing product!',
                'image' => 'https://example.com/share-image.jpg'
            ]
        ]);

        $response = $this->get("/landing/{$landingPage->slug}");

        $response->assertOk()
                ->assertViewHas('page', function ($page) use ($landingPage) {
                    return $page->social_sharing['enabled'] === true &&
                           in_array('facebook', $page->social_sharing['platforms']);
                });
    }

    /** @test */
    public function it_handles_landing_page_with_countdown_timer()
    {
        $landingPage = LandingPageModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id,
            'status' => 'published',
            'slug' => 'countdown-page',
            'countdown_timer' => [
                'enabled' => true,
                'end_date' => now()->addDays(7)->toISOString(),
                'message' => 'Limited time offer!',
                'timezone' => 'UTC'
            ]
        ]);

        $response = $this->get("/landing/{$landingPage->slug}");

        $response->assertOk()
                ->assertViewHas('page', function ($page) use ($landingPage) {
                    return $page->countdown_timer['enabled'] === true &&
                           $page->countdown_timer['message'] === 'Limited time offer!';
                });
    }

    /** @test */
    public function it_handles_landing_page_with_video_background()
    {
        $landingPage = LandingPageModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id,
            'status' => 'published',
            'slug' => 'video-background-page',
            'background' => [
                'type' => 'video',
                'video_url' => 'https://example.com/background-video.mp4',
                'poster_image' => 'https://example.com/poster.jpg',
                'autoplay' => true,
                'muted' => true,
                'loop' => true
            ]
        ]);

        $response = $this->get("/landing/{$landingPage->slug}");

        $response->assertOk()
                ->assertViewHas('page', function ($page) use ($landingPage) {
                    return $page->background['type'] === 'video' &&
                           $page->background['autoplay'] === true;
                });
    }

    /** @test */
    public function it_handles_landing_page_with_mobile_optimization()
    {
        $landingPage = LandingPageModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id,
            'status' => 'published',
            'slug' => 'mobile-optimized-page',
            'mobile_optimization' => [
                'enabled' => true,
                'mobile_layout' => 'stacked',
                'touch_friendly' => true,
                'fast_loading' => true
            ]
        ]);

        $response = $this->get("/landing/{$landingPage->slug}");

        $response->assertOk()
                ->assertViewHas('page', function ($page) use ($landingPage) {
                    return $page->mobile_optimization['enabled'] === true &&
                           $page->mobile_optimization['touch_friendly'] === true;
                });
    }
}