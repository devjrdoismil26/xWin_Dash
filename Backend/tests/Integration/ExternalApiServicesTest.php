<?php

namespace Tests\Integration;

use Tests\TestCase;
use App\Domains\ADStool\Services\ExternalApi\GoogleAdsService;
use App\Domains\ADStool\Services\ExternalApi\FacebookAdsService;
use App\Domains\ADStool\Services\ExternalApi\InstagramAdsService;
use App\Services\RateLimiterService;
use App\Services\CircuitBreakerService;
use App\Services\RetryService;

/**
 * 🧪 Teste de Integração - Serviços de APIs Externas
 * 
 * Testa a estrutura e métodos abstratos dos serviços de API externa
 */
class ExternalApiServicesTest extends TestCase
{
    /** @test */
    public function google_ads_service_implements_required_abstract_methods()
    {
        $rateLimiter = $this->createMock(RateLimiterService::class);
        $circuitBreaker = $this->createMock(CircuitBreakerService::class);
        $retryService = $this->createMock(RetryService::class);
        
        // Criar serviço especializado mockado
        $campaignService = $this->createMock(\App\Domains\ADStool\Services\ExternalApi\GoogleAdsCampaignService::class);

        $service = new GoogleAdsService(
            $rateLimiter,
            $circuitBreaker,
            $retryService,
            $campaignService
        );

        // Verificar que os métodos protegidos existem através de reflexão
        $reflection = new \ReflectionClass($service);
        
        $this->assertTrue($reflection->hasMethod('getPlatformName'));
        $this->assertTrue($reflection->hasMethod('getBaseUrl'));
        $this->assertTrue($reflection->hasMethod('getDefaultHeaders'));
        $this->assertTrue($reflection->hasMethod('getHealthCheckEndpoint'));
    }

    /** @test */
    public function facebook_ads_service_implements_required_abstract_methods()
    {
        $rateLimiter = $this->createMock(RateLimiterService::class);
        $circuitBreaker = $this->createMock(CircuitBreakerService::class);
        $retryService = $this->createMock(RetryService::class);
        
        // Criar serviços especializados mockados
        $campaignService = $this->createMock(\App\Domains\ADStool\Services\ExternalApi\FacebookAdsCampaignService::class);
        $adSetService = $this->createMock(\App\Domains\ADStool\Services\ExternalApi\FacebookAdsAdSetService::class);
        $adService = $this->createMock(\App\Domains\ADStool\Services\ExternalApi\FacebookAdsAdService::class);
        $audienceService = $this->createMock(\App\Domains\ADStool\Services\ExternalApi\FacebookAdsAudienceService::class);
        $accountService = $this->createMock(\App\Domains\ADStool\Services\ExternalApi\FacebookAdsAccountService::class);

        $service = new FacebookAdsService(
            $rateLimiter,
            $circuitBreaker,
            $retryService,
            $campaignService,
            $adSetService,
            $adService,
            $audienceService,
            $accountService
        );

        // Verificar métodos através de reflexão
        $reflection = new \ReflectionClass($service);
        
        $this->assertTrue($reflection->hasMethod('getPlatformName'));
        $this->assertTrue($reflection->hasMethod('getBaseUrl'));
        $this->assertTrue($reflection->hasMethod('getDefaultHeaders'));
        $this->assertTrue($reflection->hasMethod('getHealthCheckEndpoint'));
    }

    /** @test */
    public function instagram_ads_service_implements_required_abstract_methods()
    {
        $rateLimiter = $this->createMock(RateLimiterService::class);
        $circuitBreaker = $this->createMock(CircuitBreakerService::class);
        $retryService = $this->createMock(RetryService::class);
        
        // Criar serviços especializados mockados
        $campaignService = $this->createMock(\App\Domains\ADStool\Services\ExternalApi\InstagramAdsCampaignService::class);
        $mediaService = $this->createMock(\App\Domains\ADStool\Services\ExternalApi\InstagramAdsMediaService::class);

        $service = new InstagramAdsService(
            $rateLimiter,
            $circuitBreaker,
            $retryService,
            $campaignService,
            $mediaService
        );

        // Verificar métodos através de reflexão
        $reflection = new \ReflectionClass($service);
        
        $this->assertTrue($reflection->hasMethod('getPlatformName'));
        $this->assertTrue($reflection->hasMethod('getBaseUrl'));
        $this->assertTrue($reflection->hasMethod('getDefaultHeaders'));
        $this->assertTrue($reflection->hasMethod('getHealthCheckEndpoint'));
    }

    /** @test */
    public function lead_service_implements_get_all_leads_method()
    {
        $leadService = app(\App\Domains\Leads\Services\LeadService::class);
        
        $reflection = new \ReflectionClass($leadService);
        
        $this->assertTrue($reflection->hasMethod('getAllLeads'));
        
        $method = $reflection->getMethod('getAllLeads');
        $this->assertTrue($method->isPublic());
    }

    /** @test */
    public function activity_log_repository_implements_create_method()
    {
        $repository = app(\App\Domains\Activity\Infrastructure\Persistence\Eloquent\ActivityLogRepository::class);
        
        $reflection = new \ReflectionClass($repository);
        
        $this->assertTrue($reflection->hasMethod('create'));
        
        $method = $reflection->getMethod('create');
        $this->assertTrue($method->isPublic());
    }

    /** @test */
    public function continue_workflow_execution_job_exists()
    {
        $this->assertTrue(class_exists(\App\Jobs\ContinueWorkflowExecutionJob::class));
        
        $reflection = new \ReflectionClass(\App\Jobs\ContinueWorkflowExecutionJob::class);
        
        // Verificar que implementa ShouldQueue
        $this->assertTrue($reflection->implementsInterface(\Illuminate\Contracts\Queue\ShouldQueue::class));
        
        // Verificar que tem o método handle
        $this->assertTrue($reflection->hasMethod('handle'));
    }
}
