<?php

namespace Tests\Feature\Domains\Universe\Http\Controllers;

use Tests\TestCase;
use App\Domains\Universe\Services\AILaboratoryService;
use App\Domains\Universe\Services\PromptEnhancementService;
use App\Domains\Universe\Services\ChatLabIntegrationService;
use App\Domains\Universe\ValueObjects\AIGenerationRequest;
use App\Domains\Universe\ValueObjects\EnhancedPrompt;
use App\Domains\Media\Models\MediaFile;
use App\Models\User;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;

class AILaboratoryTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    private User $user;
    private Project $project;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->project = Project::factory()->create(['user_id' => $this->user->id]);

        // Mock do PyLab service
        Http::fake([
            'http://ai_service:8000/health' => Http::response([
                'status' => 'healthy',
                'models_loaded' => [
                    'image_generator' => true,
                    'video_generator' => true,
                ],
            ]),
            'http://ai_service:8000/api/generate-image' => Http::response([
                'task_id' => 'test-task-123',
                'status' => 'processing',
            ]),
            'http://ai_service:8000/api/status/*' => Http::response([
                'status' => 'completed',
                'result' => [
                    'filename' => 'generated_image.png',
                    'file_size' => 1024000,
                    'mime_type' => 'image/png',
                ],
            ]),
        ]);
    }

    /** @test */
    public function can_generate_image_via_api()
    {
        $this->actingAs($this->user);

        $response = $this->postJson('/api/ai-laboratory/generate-image', [
            'prompt' => 'A beautiful sunset over the ocean',
            'style' => 'realistic',
            'width' => 1024,
            'height' => 1024,
            'steps' => 50,
            'guidance_scale' => 7.5,
            'batch_size' => 1,
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'data' => [
                         'task_id',
                         'status',
                         'estimated_time',
                     ],
                 ]);
    }

    /** @test */
    public function can_generate_video_via_api()
    {
        $this->actingAs($this->user);

        $response = $this->postJson('/api/ai-laboratory/generate-video', [
            'prompt' => 'A cat walking in a garden',
            'duration' => 5,
            'fps' => 24,
            'quality' => 'hd',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'data' => [
                         'task_id',
                         'status',
                         'estimated_time',
                     ],
                 ]);
    }

    /** @test */
    public function can_enhance_image_prompt()
    {
        $this->actingAs($this->user);

        $response = $this->postJson('/api/chat-lab/enhance-image-prompt', [
            'prompt' => 'cat',
            'context' => [
                'chat_context' => [],
                'user_preferences' => [],
            ],
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'data' => [
                         'original_prompt',
                         'enhanced_prompt',
                         'improvements',
                         'quality_score',
                         'suggested_style',
                         'suggested_dimensions',
                     ],
                 ]);
    }

    /** @test */
    public function can_analyze_media_generation_intent()
    {
        $service = app(ChatLabIntegrationService::class);

        $result = $service->analyzeMediaGenerationIntent('gera uma imagem de gato');

        $this->assertEquals('image', $result['intent']);
        $this->assertGreaterThan(0.7, $result['confidence']);
        $this->assertContains('imagem', $result['keywords_found']);
    }

    /** @test */
    public function can_process_image_generation_from_chat()
    {
        $service = app(ChatLabIntegrationService::class);

        $result = $service->processImageGenerationFromChat(
            'gato fofo',
            $this->user->id,
            [],
            ['auto_generate' => false]
        );

        $this->assertArrayHasKey('enhanced_prompt', $result);
        $this->assertArrayHasKey('chat_response', $result);
        $this->assertArrayHasKey('preview', $result);
        $this->assertFalse($result['auto_generated']);
    }

    /** @test */
    public function ai_laboratory_service_can_handle_image_generation()
    {
        $service = app(AILaboratoryService::class);

        $request = new AIGenerationRequest(
            prompt: 'A beautiful landscape',
            style: 'realistic',
            width: 1024,
            height: 1024,
            steps: 50,
            guidanceScale: 7.5,
            batchSize: 1
        );

        $result = $service->generateImage($request, $this->user->id);

        $this->assertArrayHasKey('task_id', $result);
        $this->assertArrayHasKey('status', $result);
        $this->assertEquals('processing', $result['status']);
    }

    /** @test */
    public function prompt_enhancement_service_improves_simple_prompts()
    {
        $service = app(PromptEnhancementService::class);

        $enhanced = $service->enhanceImagePrompt('cat');

        $this->assertInstanceOf(EnhancedPrompt::class, $enhanced);
        $this->assertNotEquals('cat', $enhanced->getEnhancedPrompt());
        $this->assertGreaterThan(0, $enhanced->getQualityScore());
        $this->assertNotEmpty($enhanced->getImprovements());
    }

    /** @test */
    public function can_get_generation_status()
    {
        $this->actingAs($this->user);

        $response = $this->getJson('/api/ai-laboratory/status/test-task-123');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'data' => [
                         'status',
                         'progress',
                         'result',
                     ],
                 ]);
    }

    /** @test */
    public function can_get_system_status()
    {
        $this->actingAs($this->user);

        $response = $this->getJson('/api/ai-laboratory/system-status');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'data' => [
                         'pylab_status',
                         'models_loaded',
                         'active_tasks',
                         'system_info',
                     ],
                 ]);
    }

    /** @test */
    public function validates_image_generation_parameters()
    {
        $this->actingAs($this->user);

        $response = $this->postJson('/api/ai-laboratory/generate-image', [
            'prompt' => 'A', // Muito curto
            'style' => 'invalid_style',
            'width' => 100, // Muito pequeno
            'height' => 5000, // Muito grande
            'steps' => 5, // Muito baixo
            'guidance_scale' => 25, // Muito alto
            'batch_size' => 10, // Muito alto
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors([
                     'prompt',
                     'style',
                     'width',
                     'height',
                     'steps',
                     'guidance_scale',
                     'batch_size',
                 ]);
    }

    /** @test */
    public function can_cancel_generation()
    {
        $this->actingAs($this->user);

        $response = $this->deleteJson('/api/ai-laboratory/cancel/test-task-123');

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'message' => 'Geração cancelada com sucesso',
                 ]);
    }

    /** @test */
    public function media_file_is_created_after_successful_generation()
    {
        Storage::fake('public');

        $service = app(AILaboratoryService::class);

        // Simular geração bem-sucedida
        $mediaFile = MediaFile::createFromAI(
            'test_image.png',
            'Generated Image',
            'image/png',
            1024000,
            'ai_generated/test_image.png',
            'ai_generation',
            $this->user->id,
            [
                'ai_model' => 'stable-diffusion-xl',
                'prompt' => 'A beautiful sunset',
                'generation_time' => 30,
            ],
            ['ai-generated', 'sunset', 'landscape']
        );

        $this->assertDatabaseHas('media_files', [
            'id' => $mediaFile->id,
            'ai_generated' => true,
            'ai_model' => 'stable-diffusion-xl',
            'source' => 'ai_generation',
        ]);
    }

    /** @test */
    public function media_is_automatically_organized()
    {
        $service = app(ChatLabIntegrationService::class);

        $mediaFile = MediaFile::factory()->create([
            'ai_generated' => true,
            'ai_prompt' => 'A cute cat playing',
        ]);

        $enhancedPrompt = EnhancedPrompt::success(
            'cat',
            'A cute domestic cat playing with a ball of yarn',
            ['Added details', 'Improved clarity'],
            'image',
            85.5,
            'realistic'
        );

        // Testar organização automática
        $reflection = new \ReflectionClass($service);
        $method = $reflection->getMethod('organizeGeneratedMedia');
        $method->setAccessible(true);
        $method->invoke($service, $mediaFile, $enhancedPrompt, $this->user->id);

        // Verificar se pasta foi criada
        $this->assertDatabaseHas('media_folders', [
            'name' => 'Imagens - Animais',
        ]);
    }

    /** @test */
    public function can_get_user_preferences()
    {
        $this->actingAs($this->user);

        $response = $this->getJson('/api/chat-lab/settings');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'data' => [
                         'auto_enhance_prompts',
                         'default_image_style',
                         'default_video_quality',
                         'save_enhanced_prompts',
                     ],
                 ]);
    }

    /** @test */
    public function can_save_user_preferences()
    {
        $this->actingAs($this->user);

        $response = $this->postJson('/api/chat-lab/settings', [
            'auto_enhance_prompts' => true,
            'default_image_style' => 'artistic',
            'default_video_quality' => 'hd',
            'save_enhanced_prompts' => false,
        ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'message' => 'Preferências salvas com sucesso',
                 ]);
    }

    /** @test */
    public function can_get_dashboard_statistics()
    {
        $this->actingAs($this->user);

        $response = $this->getJson('/api/chat-lab/dashboard');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'data' => [
                         'total_generations',
                         'images_generated',
                         'videos_generated',
                         'avg_quality_score',
                         'popular_styles',
                         'recent_generations',
                     ],
                 ]);
    }

    /** @test */
    public function health_check_returns_service_status()
    {
        $response = $this->getJson('/api/ai-laboratory/health');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'data' => [
                         'pylab_status',
                         'models_available',
                         'response_time_ms',
                     ],
                 ]);
    }

    /** @test */
    public function can_cleanup_old_tasks()
    {
        $this->actingAs($this->user);

        $response = $this->postJson('/api/ai-laboratory/cleanup');

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                 ])
                 ->assertJsonStructure([
                     'data' => [
                         'cleaned_tasks',
                         'freed_storage_mb',
                     ],
                 ]);
    }
}
