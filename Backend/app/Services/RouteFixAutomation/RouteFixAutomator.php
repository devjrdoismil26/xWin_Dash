<?php

namespace App\Services\RouteFixAutomation;

use App\Services\RouteFixAutomation\Fixers\ServiceProviderFixer;
use App\Services\RouteFixAutomation\Fixers\RepositoryInterfaceFixer;
use App\Services\RouteFixAutomation\Fixers\ConfigurationProblemFixer;
use App\Services\RouteFixAutomation\Fixers\MissingServiceFixer;
use App\Services\RouteFixAutomation\Testing\ControllerTester;
use App\Services\RouteFixAutomation\Models\FixResult;
use App\Services\RouteFixAutomation\Models\ProgressReport;
use App\Services\RouteFixAutomation\Logging\ProgressTracker;
use Illuminate\Support\Facades\Log;

class RouteFixAutomator
{
    protected ServiceProviderFixer $serviceProviderFixer;
    protected RepositoryInterfaceFixer $repositoryInterfaceFixer;
    protected ConfigurationProblemFixer $configurationProblemFixer;
    protected MissingServiceFixer $missingServiceFixer;
    protected ControllerTester $controllerTester;
    protected ProgressTracker $progressTracker;

    public function __construct(
        ServiceProviderFixer $serviceProviderFixer,
        RepositoryInterfaceFixer $repositoryInterfaceFixer,
        ConfigurationProblemFixer $configurationProblemFixer,
        MissingServiceFixer $missingServiceFixer,
        ControllerTester $controllerTester,
        ProgressTracker $progressTracker
    ) {
        $this->serviceProviderFixer = $serviceProviderFixer;
        $this->repositoryInterfaceFixer = $repositoryInterfaceFixer;
        $this->configurationProblemFixer = $configurationProblemFixer;
        $this->missingServiceFixer = $missingServiceFixer;
        $this->controllerTester = $controllerTester;
        $this->progressTracker = $progressTracker;
    }

    public function executeFullPipeline(bool $verbose = false, bool $dryRun = false): FixResult
    {
        $startTime = microtime(true);
        $this->progressTracker->logPipelineStart();

        $totalFixed = 0;
        $totalErrors = 0;
        $fixedItems = [];
        $errors = [];

        try {
            // Baseline inicial
            $initialTest = $this->controllerTester->testAllControllers();
            $this->progressTracker->logBaseline($initialTest);

            // Fase 1: Service Providers (CRÍTICA)
            $this->progressTracker->logStepStart('service-providers');
            $result1 = $this->serviceProviderFixer->executeAll($verbose, $dryRun);
            $this->progressTracker->logStepComplete('service-providers', $result1);
            
            $totalFixed += $result1->totalFixed;
            $totalErrors += $result1->totalErrors;
            $fixedItems = array_merge($fixedItems, $result1->fixedItems);
            $errors = array_merge($errors, $result1->errors);

            // Teste intermediário
            $test1 = $this->controllerTester->testAllControllers();
            $this->progressTracker->logIntermediateTest('after-providers', $test1);

            // Fase 2: Repository Interfaces (ALTA)
            $this->progressTracker->logStepStart('repository-interfaces');
            $result2 = $this->repositoryInterfaceFixer->executeAll($verbose, $dryRun);
            $this->progressTracker->logStepComplete('repository-interfaces', $result2);
            
            $totalFixed += $result2->totalFixed;
            $totalErrors += $result2->totalErrors;
            $fixedItems = array_merge($fixedItems, $result2->fixedItems);
            $errors = array_merge($errors, $result2->errors);

            // Teste intermediário
            $test2 = $this->controllerTester->testAllControllers();
            $this->progressTracker->logIntermediateTest('after-interfaces', $test2);

            // Fase 3: Configuration Problems (MÉDIA)
            $this->progressTracker->logStepStart('configuration-problems');
            $result3 = $this->configurationProblemFixer->executeAll($verbose, $dryRun);
            $this->progressTracker->logStepComplete('configuration-problems', $result3);
            
            $totalFixed += $result3->totalFixed;
            $totalErrors += $result3->totalErrors;
            $fixedItems = array_merge($fixedItems, $result3->fixedItems);
            $errors = array_merge($errors, $result3->errors);

            // Teste intermediário
            $test3 = $this->controllerTester->testAllControllers();
            $this->progressTracker->logIntermediateTest('after-config', $test3);

            // Fase 4: Missing Services (BAIXA)
            $this->progressTracker->logStepStart('missing-services');
            $result4 = $this->missingServiceFixer->executeAll($verbose, $dryRun);
            $this->progressTracker->logStepComplete('missing-services', $result4);
            
            $totalFixed += $result4->totalFixed;
            $totalErrors += $result4->totalErrors;
            $fixedItems = array_merge($fixedItems, $result4->fixedItems);
            $errors = array_merge($errors, $result4->errors);

            // Teste final
            $finalTest = $this->controllerTester->testAllControllers();
            $this->progressTracker->logFinalTest($finalTest);

            $executionTime = round(microtime(true) - $startTime, 2);

            $result = new FixResult(
                success: $totalErrors === 0,
                totalFixed: $totalFixed,
                totalErrors: $totalErrors,
                fixedItems: $fixedItems,
                errors: $errors,
                executionTime: $executionTime,
                finalTest: $finalTest
            );

            $this->progressTracker->logPipelineComplete($result);

            return $result;

        } catch (\Exception $e) {
            $this->progressTracker->logPipelineError($e);
            throw $e;
        }
    }

    public function executeStep(string $step, bool $verbose = false, bool $dryRun = false): FixResult
    {
        $startTime = microtime(true);
        
        $result = match($step) {
            'providers' => $this->serviceProviderFixer->executeAll($verbose, $dryRun),
            'interfaces' => $this->repositoryInterfaceFixer->executeAll($verbose, $dryRun),
            'config' => $this->configurationProblemFixer->executeAll($verbose, $dryRun),
            'services' => $this->missingServiceFixer->executeAll($verbose, $dryRun),
            default => throw new \InvalidArgumentException("Step '{$step}' não reconhecido")
        };

        $result->executionTime = round(microtime(true) - $startTime, 2);
        
        return $result;
    }

    public function generateProgressReport(): ProgressReport
    {
        $testResult = $this->controllerTester->testAllControllers();
        
        return new ProgressReport(
            functionalControllers: $testResult->functionalControllers,
            totalControllers: $testResult->totalControllers,
            successPercentage: $testResult->successPercentage,
            remainingIssues: $testResult->remainingIssues,
            fixHistory: $this->progressTracker->getFixHistory()
        );
    }
}