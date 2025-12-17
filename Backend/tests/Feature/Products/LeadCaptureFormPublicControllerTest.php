<?php

namespace Tests\Feature\Products;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Domains\Products\Infrastructure\Persistence\Eloquent\LeadCaptureFormModel;
use App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel;
use App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel;

class LeadCaptureFormPublicControllerTest extends TestCase
{
    use RefreshDatabase;

    protected UserModel $user;
    protected ProjectModel $project;
    protected LeadCaptureFormModel $leadCaptureForm;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = UserModel::factory()->create();
        $this->project = ProjectModel::factory()->create(['user_id' => $this->user->id]);
        $this->leadCaptureForm = LeadCaptureFormModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id,
            'status' => 'published',
            'slug' => 'test-lead-form'
        ]);
    }

    /** @test */
    public function it_can_display_published_lead_capture_form()
    {
        $response = $this->get("/forms/{$this->leadCaptureForm->slug}");

        $response->assertOk()
                ->assertInertia(fn ($page) => 
                    $page->component('Products/LeadCaptureForms/LeadCaptureFormShow')
                         ->has('form')
                         ->where('form.id', $this->leadCaptureForm->id)
                );
    }

    /** @test */
    public function it_returns_404_for_non_existent_lead_capture_form()
    {
        $response = $this->get('/forms/non-existent-slug');

        $response->assertNotFound();
    }

    /** @test */
    public function it_returns_404_for_draft_lead_capture_form()
    {
        $draftForm = LeadCaptureFormModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id,
            'status' => 'draft',
            'slug' => 'draft-form'
        ]);

        $response = $this->get("/forms/{$draftForm->slug}");

        $response->assertNotFound();
    }

    /** @test */
    public function it_returns_404_for_inactive_lead_capture_form()
    {
        $inactiveForm = LeadCaptureFormModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id,
            'status' => 'inactive',
            'slug' => 'inactive-form'
        ]);

        $response = $this->get("/forms/{$inactiveForm->slug}");

        $response->assertNotFound();
    }

    /** @test */
    public function it_displays_lead_capture_form_with_correct_content()
    {
        $leadForm = LeadCaptureFormModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id,
            'status' => 'published',
            'slug' => 'content-test-form',
            'title' => 'Get Your Free Guide',
            'description' => 'Download our comprehensive guide',
            'form_fields' => [
                ['name' => 'email', 'type' => 'email', 'required' => true, 'label' => 'Email Address'],
                ['name' => 'name', 'type' => 'text', 'required' => true, 'label' => 'Full Name'],
                ['name' => 'company', 'type' => 'text', 'required' => false, 'label' => 'Company']
            ],
            'cta_text' => 'Download Now',
            'thank_you_message' => 'Thank you! Check your email for the download link.'
        ]);

        $response = $this->get("/forms/{$leadForm->slug}");

        $response->assertOk()
                ->assertInertia(fn ($page) => 
                    $page->component('Products/LeadCaptureForms/LeadCaptureFormShow')
                         ->has('form')
                         ->where('form.title', 'Get Your Free Guide')
                         ->where('form.cta_text', 'Download Now')
                         ->where('form.form_fields', $leadForm->form_fields)
                );
    }

    /** @test */
    public function it_handles_lead_capture_form_with_conditional_fields()
    {
        $leadForm = LeadCaptureFormModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id,
            'status' => 'published',
            'slug' => 'conditional-fields-form',
            'form_fields' => [
                ['name' => 'email', 'type' => 'email', 'required' => true, 'label' => 'Email'],
                ['name' => 'newsletter', 'type' => 'checkbox', 'required' => false, 'label' => 'Subscribe to Newsletter'],
                ['name' => 'phone', 'type' => 'tel', 'required' => false, 'label' => 'Phone', 'conditional' => ['newsletter' => true]]
            ]
        ]);

        $response = $this->get("/forms/{$leadForm->slug}");

        $response->assertOk()
                ->assertInertia(fn ($page) => 
                    $page->component('Products/LeadCaptureForms/LeadCaptureFormShow')
                         ->has('form')
                         ->where('form.form_fields.2.conditional.newsletter', true)
                );
    }

    /** @test */
    public function it_handles_lead_capture_form_with_file_upload()
    {
        $leadForm = LeadCaptureFormModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id,
            'status' => 'published',
            'slug' => 'file-upload-form',
            'form_fields' => [
                ['name' => 'email', 'type' => 'email', 'required' => true, 'label' => 'Email'],
                ['name' => 'resume', 'type' => 'file', 'required' => true, 'label' => 'Upload Resume', 'accept' => '.pdf,.doc,.docx']
            ]
        ]);

        $response = $this->get("/forms/{$leadForm->slug}");

        $response->assertOk()
                ->assertInertia(fn ($page) => 
                    $page->component('Products/LeadCaptureForms/LeadCaptureFormShow')
                         ->has('form')
                         ->where('form.form_fields.1.type', 'file')
                         ->where('form.form_fields.1.accept', '.pdf,.doc,.docx')
                );
    }

    /** @test */
    public function it_handles_lead_capture_form_with_custom_styling()
    {
        $leadForm = LeadCaptureFormModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id,
            'status' => 'published',
            'slug' => 'styled-form',
            'styling' => [
                'primary_color' => '#007bff',
                'secondary_color' => '#6c757d',
                'font_family' => 'Arial, sans-serif',
                'border_radius' => '8px',
                'button_style' => 'rounded'
            ]
        ]);

        $response = $this->get("/forms/{$leadForm->slug}");

        $response->assertOk()
                ->assertInertia(fn ($page) => 
                    $page->component('Products/LeadCaptureForms/LeadCaptureFormShow')
                         ->has('form')
                         ->where('form.styling.primary_color', '#007bff')
                         ->where('form.styling.font_family', 'Arial, sans-serif')
                );
    }

    /** @test */
    public function it_handles_lead_capture_form_with_analytics_tracking()
    {
        $leadForm = LeadCaptureFormModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id,
            'status' => 'published',
            'slug' => 'analytics-form',
            'analytics' => [
                'google_analytics_id' => 'GA-123456789',
                'facebook_pixel_id' => 'FB-987654321',
                'track_conversions' => true,
                'conversion_value' => 10.00
            ]
        ]);

        $response = $this->get("/forms/{$leadForm->slug}");

        $response->assertOk()
                ->assertInertia(fn ($page) => 
                    $page->component('Products/LeadCaptureForms/LeadCaptureFormShow')
                         ->has('form')
                         ->where('form.analytics.track_conversions', true)
                         ->where('form.analytics.conversion_value', 10.00)
                );
    }

    /** @test */
    public function it_handles_lead_capture_form_with_redirect_settings()
    {
        $leadForm = LeadCaptureFormModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id,
            'status' => 'published',
            'slug' => 'redirect-form',
            'redirect_settings' => [
                'type' => 'url',
                'url' => 'https://example.com/thank-you',
                'delay' => 3,
                'message' => 'Redirecting to thank you page...'
            ]
        ]);

        $response = $this->get("/forms/{$leadForm->slug}");

        $response->assertOk()
                ->assertInertia(fn ($page) => 
                    $page->component('Products/LeadCaptureForms/LeadCaptureFormShow')
                         ->has('form')
                         ->where('form.redirect_settings.type', 'url')
                         ->where('form.redirect_settings.url', 'https://example.com/thank-you')
                );
    }

    /** @test */
    public function it_handles_lead_capture_form_with_email_notifications()
    {
        $leadForm = LeadCaptureFormModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id,
            'status' => 'published',
            'slug' => 'email-notifications-form',
            'email_notifications' => [
                'enabled' => true,
                'recipients' => ['admin@example.com', 'sales@example.com'],
                'subject' => 'New Lead Submission',
                'template' => 'lead-notification'
            ]
        ]);

        $response = $this->get("/forms/{$leadForm->slug}");

        $response->assertOk()
                ->assertInertia(fn ($page) => 
                    $page->component('Products/LeadCaptureForms/LeadCaptureFormShow')
                         ->has('form')
                         ->where('form.email_notifications.enabled', true)
                         ->where('form.email_notifications.recipients', ['admin@example.com', 'sales@example.com'])
                );
    }

    /** @test */
    public function it_handles_lead_capture_form_with_auto_responder()
    {
        $leadForm = LeadCaptureFormModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id,
            'status' => 'published',
            'slug' => 'auto-responder-form',
            'auto_responder' => [
                'enabled' => true,
                'subject' => 'Thank you for your interest!',
                'template' => 'welcome-email',
                'delay' => 0
            ]
        ]);

        $response = $this->get("/forms/{$leadForm->slug}");

        $response->assertOk()
                ->assertInertia(fn ($page) => 
                    $page->component('Products/LeadCaptureForms/LeadCaptureFormShow')
                         ->has('form')
                         ->where('form.auto_responder.enabled', true)
                         ->where('form.auto_responder.subject', 'Thank you for your interest!')
                );
    }

    /** @test */
    public function it_handles_lead_capture_form_with_validation_rules()
    {
        $leadForm = LeadCaptureFormModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id,
            'status' => 'published',
            'slug' => 'validation-form',
            'form_fields' => [
                ['name' => 'email', 'type' => 'email', 'required' => true, 'label' => 'Email', 'validation' => ['email', 'max:255']],
                ['name' => 'phone', 'type' => 'tel', 'required' => false, 'label' => 'Phone', 'validation' => ['regex:/^\+?[1-9]\d{1,14}$/']],
                ['name' => 'age', 'type' => 'number', 'required' => true, 'label' => 'Age', 'validation' => ['min:18', 'max:100']]
            ]
        ]);

        $response = $this->get("/forms/{$leadForm->slug}");

        $response->assertOk()
                ->assertInertia(fn ($page) => 
                    $page->component('Products/LeadCaptureForms/LeadCaptureFormShow')
                         ->has('form')
                         ->where('form.form_fields.0.validation', ['email', 'max:255'])
                         ->where('form.form_fields.2.validation', ['min:18', 'max:100'])
                );
    }

    /** @test */
    public function it_handles_lead_capture_form_with_captcha()
    {
        $leadForm = LeadCaptureFormModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id,
            'status' => 'published',
            'slug' => 'captcha-form',
            'captcha' => [
                'enabled' => true,
                'type' => 'recaptcha',
                'site_key' => '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
                'secret_key' => '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'
            ]
        ]);

        $response = $this->get("/forms/{$leadForm->slug}");

        $response->assertOk()
                ->assertInertia(fn ($page) => 
                    $page->component('Products/LeadCaptureForms/LeadCaptureFormShow')
                         ->has('form')
                         ->where('form.captcha.enabled', true)
                         ->where('form.captcha.type', 'recaptcha')
                );
    }

    /** @test */
    public function it_handles_lead_capture_form_with_multi_step()
    {
        $leadForm = LeadCaptureFormModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id,
            'status' => 'published',
            'slug' => 'multi-step-form',
            'multi_step' => [
                'enabled' => true,
                'steps' => [
                    ['title' => 'Personal Info', 'fields' => ['name', 'email']],
                    ['title' => 'Company Info', 'fields' => ['company', 'position']],
                    ['title' => 'Preferences', 'fields' => ['newsletter', 'interests']]
                ],
                'show_progress' => true
            ]
        ]);

        $response = $this->get("/forms/{$leadForm->slug}");

        $response->assertOk()
                ->assertInertia(fn ($page) => 
                    $page->component('Products/LeadCaptureForms/LeadCaptureFormShow')
                         ->has('form')
                         ->where('form.multi_step.enabled', true)
                         ->where('form.multi_step.show_progress', true)
                         ->where('form.multi_step.steps.0.title', 'Personal Info')
                );
    }

    /** @test */
    public function it_handles_lead_capture_form_with_ab_testing()
    {
        $leadForm = LeadCaptureFormModel::factory()->create([
            'project_id' => $this->project->id,
            'user_id' => $this->user->id,
            'status' => 'published',
            'slug' => 'ab-test-form',
            'ab_testing' => [
                'enabled' => true,
                'variants' => [
                    'A' => ['title' => 'Get Your Free Guide', 'cta_text' => 'Download Now'],
                    'B' => ['title' => 'Download Our Guide', 'cta_text' => 'Get It Free']
                ],
                'traffic_split' => 50
            ]
        ]);

        $response = $this->get("/forms/{$leadForm->slug}");

        $response->assertOk()
                ->assertInertia(fn ($page) => 
                    $page->component('Products/LeadCaptureForms/LeadCaptureFormShow')
                         ->has('form')
                         ->where('form.ab_testing.enabled', true)
                         ->where('form.ab_testing.traffic_split', 50)
                         ->has('form.ab_testing.variants.A')
                         ->has('form.ab_testing.variants.B')
                );
    }
}