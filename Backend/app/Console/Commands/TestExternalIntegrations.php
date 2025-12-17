<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\RateLimiterService;
use App\Services\CircuitBreakerService;
use App\Services\RetryService;
use App\Services\AnalyticsService;
use App\Services\ContentSchedulingService;
use App\Domains\AI\Services\FunctionCallingService;
use App\Domains\ADStool\Services\ExternalApi\FacebookAdsService;
use App\Domains\ADStool\Services\ExternalApi\GoogleAdsService;
use App\Domains\ADStool\Services\ExternalApi\InstagramAdsService;
use App\Domains\Aura\Services\WhatsAppTemplateService;
use App\Domains\Aura\Services\WhatsAppInteractiveService;
use App\Domains\SocialBuffer\Services\ExternalApi\TwitterService;

/**
 * 🚀 Test External Integrations Command
 * 
 * Comando para testar todas as integrações externas implementadas
 */
class TestExternalIntegrations extends Command
{
    protected $signature = 'integrations:test 
                            {--platform= : Test specific platform (facebook, google, twitter, etc.)}
                            {--service= : Test specific service (rate-limiter, circuit-breaker, etc.)}
                            {--verbose : Show detailed output}';

    protected $description = 'Test all external integrations and services';

    public function handle()
    {
        $this->info('🚀 Testing External Integrations...');
        $this->newLine();

        $platform = $this->option('platform');
        $service = $this->option('service');
        $verbose = $this->option('verbose');

        if ($service) {
            $this->testSpecificService($service, $verbose);
        } elseif ($platform) {
            $this->testSpecificPlatform($platform, $verbose);
        } else {
            $this->testAllIntegrations($verbose);
        }

        $this->newLine();
        $this->info('✅ Integration tests completed!');
    }

    private function testAllIntegrations(bool $verbose): void
    {
        $this->info('Testing Core Services...');
        $this->testCoreServices($verbose);

        $this->newLine();
        $this->info('Testing ADStool Services...');
        $this->testADStoolServices($verbose);

        $this->newLine();
        $this->info('Testing Aura Services...');
        $this->testAuraServices($verbose);

        $this->newLine();
        $this->info('Testing SocialBuffer Services...');
        $this->testSocialBufferServices($verbose);

        $this->newLine();
        $this->info('Testing AI Services...');
        $this->testAIServices($verbose);

        $this->newLine();
        $this->info('Testing Analytics & Scheduling...');
        $this->testAnalyticsAndScheduling($verbose);
    }

    private function testCoreServices(bool $verbose): void
    {
        $services = [
            'Rate Limiter' => RateLimiterService::class,
            'Circuit Breaker' => CircuitBreakerService::class,
            'Retry Service' => RetryService::class,
        ];

        foreach ($services as $name => $class) {
            $this->testService($name, $class, $verbose);
        }
    }

    private function testADStoolServices(bool $verbose): void
    {
        $services = [
            'Facebook Ads' => FacebookAdsService::class,
            'Google Ads' => GoogleAdsService::class,
            'Instagram Ads' => InstagramAdsService::class,
        ];

        foreach ($services as $name => $class) {
            $this->testService($name, $class, $verbose);
        }
    }

    private function testAuraServices(bool $verbose): void
    {
        $services = [
            'WhatsApp Templates' => WhatsAppTemplateService::class,
            'WhatsApp Interactive' => WhatsAppInteractiveService::class,
        ];

        foreach ($services as $name => $class) {
            $this->testService($name, $class, $verbose);
        }
    }

    private function testSocialBufferServices(bool $verbose): void
    {
        $services = [
            'Twitter' => TwitterService::class,
        ];

        foreach ($services as $name => $class) {
            $this->testService($name, $class, $verbose);
        }
    }

    private function testAIServices(bool $verbose): void
    {
        $services = [
            'Function Calling' => FunctionCallingService::class,
        ];

        foreach ($services as $name => $class) {
            $this->testService($name, $class, $verbose);
        }
    }

    private function testAnalyticsAndScheduling(bool $verbose): void
    {
        $services = [
            'Analytics' => AnalyticsService::class,
            'Content Scheduling' => ContentSchedulingService::class,
        ];

        foreach ($services as $name => $class) {
            $this->testService($name, $class, $verbose);
        }
    }

    private function testService(string $name, string $class, bool $verbose): void
    {
        try {
            $service = app($class);
            
            if ($verbose) {
                $this->line("  Testing {$name}...");
            }

            // Teste básico de instanciação
            $this->assertTrue($service instanceof $class, "{$name} should be instance of {$class}");

            // Testes específicos por serviço
            $this->runServiceSpecificTests($name, $service, $verbose);

            $this->info("  ✅ {$name} - OK");
        } catch (\Exception $e) {
            $this->error("  ❌ {$name} - FAILED: " . $e->getMessage());
            if ($verbose) {
                $this->line("    Stack trace: " . $e->getTraceAsString());
            }
        }
    }

    private function runServiceSpecificTests(string $name, $service, bool $verbose): void
    {
        switch ($name) {
            case 'Rate Limiter':
                $this->testRateLimiter($service, $verbose);
                break;
            case 'Circuit Breaker':
                $this->testCircuitBreaker($service, $verbose);
                break;
            case 'Retry Service':
                $this->testRetryService($service, $verbose);
                break;
            case 'Function Calling':
                $this->testFunctionCalling($service, $verbose);
                break;
            case 'Analytics':
                $this->testAnalytics($service, $verbose);
                break;
            case 'Content Scheduling':
                $this->testContentScheduling($service, $verbose);
                break;
            default:
                // Teste básico para serviços de API
                if (method_exists($service, 'canConnect')) {
                    $this->assertTrue(is_bool($service->canConnect()), "{$name} canConnect should return boolean");
                }
                break;
        }
    }

    private function testRateLimiter(RateLimiterService $service, bool $verbose): void
    {
        $this->assertTrue($service->canMakeCall('test', 'test'), 'Rate limiter should allow calls initially');
        $this->assertIsArray($service->getUsageStats('test', 'test'), 'Usage stats should return array');
        $this->assertIsArray($service->getAllLimits(), 'All limits should return array');
    }

    private function testCircuitBreaker(CircuitBreakerService $service, bool $verbose): void
    {
        $this->assertTrue($service->canMakeCall('test', 'test'), 'Circuit breaker should allow calls initially');
        $this->assertIsArray($service->getCircuitStats('test', 'test'), 'Circuit stats should return array');
        $this->assertIsArray($service->getAllCircuitStates(), 'All circuit states should return array');
    }

    private function testRetryService(RetryService $service, bool $verbose): void
    {
        $this->assertIsArray($service->getAllRetryConfigs(), 'All retry configs should return array');
        
        // Teste de retry com função que sempre falha
        $this->expectException(\Exception::class);
        $service->executeWithRetry(function() {
            throw new \Exception('Test exception');
        }, 'test', 'test_operation');
    }

    private function testFunctionCalling(FunctionCallingService $service, bool $verbose): void
    {
        $this->assertIsArray($service->getAvailableFunctions(), 'Available functions should return array');
        $this->assertIsArray($service->getFunctionStats(), 'Function stats should return array');
        
        // Teste de execução de função
        $result = $service->executeFunction('get_system_info', ['info_type' => 'status']);
        $this->assertIsArray($result, 'Function execution should return array');
        $this->assertTrue($result['success'], 'Function execution should be successful');
    }

    private function testAnalytics(AnalyticsService $service, bool $verbose): void
    {
        // Teste de coleta de métricas simuladas
        $metrics = $service->collectMetrics('facebook', 'test_account');
        $this->assertIsArray($metrics, 'Metrics should return array');
        
        // Teste de métricas agregadas
        $aggregated = $service->getAggregatedMetrics(['facebook' => 'test_account']);
        $this->assertIsArray($aggregated, 'Aggregated metrics should return array');
        $this->assertArrayHasKey('total_impressions', $aggregated, 'Aggregated metrics should have total_impressions');
    }

    private function testContentScheduling(ContentSchedulingService $service, bool $verbose): void
    {
        // Teste de sugestão de horários
        $suggestions = $service->suggestOptimalTimes('facebook');
        $this->assertIsArray($suggestions, 'Optimal times suggestions should return array');
        
        // Teste de estatísticas
        $stats = $service->getSchedulingStats();
        $this->assertIsArray($stats, 'Scheduling stats should return array');
        $this->assertArrayHasKey('total_scheduled', $stats, 'Stats should have total_scheduled');
    }

    private function testSpecificPlatform(string $platform, bool $verbose): void
    {
        $this->info("Testing {$platform} platform...");
        
        $platformServices = [
            'facebook' => [
                'Facebook Ads' => FacebookAdsService::class,
            ],
            'google' => [
                'Google Ads' => GoogleAdsService::class,
            ],
            'instagram' => [
                'Instagram Ads' => InstagramAdsService::class,
            ],
            'twitter' => [
                'Twitter' => TwitterService::class,
            ],
            'whatsapp' => [
                'WhatsApp Templates' => WhatsAppTemplateService::class,
                'WhatsApp Interactive' => WhatsAppInteractiveService::class,
            ],
        ];

        if (!isset($platformServices[$platform])) {
            $this->error("Platform {$platform} not found!");
            return;
        }

        foreach ($platformServices[$platform] as $name => $class) {
            $this->testService($name, $class, $verbose);
        }
    }

    private function testSpecificService(string $service, bool $verbose): void
    {
        $serviceMap = [
            'rate-limiter' => RateLimiterService::class,
            'circuit-breaker' => CircuitBreakerService::class,
            'retry' => RetryService::class,
            'analytics' => AnalyticsService::class,
            'scheduling' => ContentSchedulingService::class,
            'function-calling' => FunctionCallingService::class,
        ];

        if (!isset($serviceMap[$service])) {
            $this->error("Service {$service} not found!");
            return;
        }

        $this->testService(ucfirst(str_replace('-', ' ', $service)), $serviceMap[$service], $verbose);
    }

    private function assertTrue(bool $condition, string $message): void
    {
        if (!$condition) {
            throw new \Exception($message);
        }
    }

    private function assertIsArray($value, string $message): void
    {
        if (!is_array($value)) {
            throw new \Exception($message);
        }
    }

    private function assertArrayHasKey(string $key, array $array, string $message): void
    {
        if (!array_key_exists($key, $array)) {
            throw new \Exception($message);
        }
    }

    private function expectException(string $exceptionClass): void
    {
        // Esta é uma implementação simplificada para o teste
        // Em um ambiente real, você usaria PHPUnit ou similar
    }
}