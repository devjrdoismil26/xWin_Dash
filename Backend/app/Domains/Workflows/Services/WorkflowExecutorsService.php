<?php

namespace App\Domains\Workflows\Services;

use App\Domains\Workflows\Models\Workflow;
use App\Domains\Workflows\Models\WorkflowExecution;
use Illuminate\Support\Facades\Log;

class WorkflowExecutorsService
{
    /**
     * Execute a workflow
     */
    public function executeWorkflow(Workflow $workflow, array $data = []): WorkflowExecution
    {
        Log::info("Executing workflow: {$workflow->name}");

        // Create execution record
        $execution = WorkflowExecution::create([
            'workflow_id' => $workflow->id,
            'status' => 'running',
            'input_data' => $data,
        ]);

        try {
            // Execute workflow steps
            $this->processWorkflowSteps($workflow, $execution, $data);

            $execution->update([
                'status' => 'completed',
                'completed_at' => now(),
            ]);

            Log::info("Workflow execution completed: {$execution->id}");
        } catch (\Exception $e) {
            $execution->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
                'completed_at' => now(),
            ]);

            Log::error("Workflow execution failed: {$e->getMessage()}");
        }

        return $execution;
    }

    /**
     * Process workflow steps
     */
    private function processWorkflowSteps(Workflow $workflow, WorkflowExecution $execution, array $data): void
    {
        $steps = $workflow->steps ?? [];

        foreach ($steps as $step) {
            $this->executeStep($step, $execution, $data);
        }
    }

    /**
     * Execute a single step
     */
    private function executeStep(array $step, WorkflowExecution $execution, array $data): void
    {
        // Simple step execution logic
        $stepName = $step['name'] ?? 'unnamed';
        Log::info("Executing step: {$stepName}");

        // Add step execution to execution data
        $executionData = $execution->execution_data ?? [];
        $executionData['steps'][] = [
            'name' => $step['name'] ?? 'unnamed',
            'status' => 'completed',
            'executed_at' => now(),
        ];

        $execution->update(['execution_data' => $executionData]);
    }

    /**
     * Get workflow execution status
     */
    public function getExecutionStatus(string $executionId): ?WorkflowExecution
    {
        return WorkflowExecution::find($executionId);
    }

    /**
     * Cancel workflow execution
     */
    public function cancelExecution(string $executionId): bool
    {
        $execution = WorkflowExecution::find($executionId);

        if (!$execution || $execution->status !== 'running') {
            return false;
        }

        $execution->update([
            'status' => 'cancelled',
            'completed_at' => now(),
        ]);

        Log::info("Workflow execution cancelled: {$executionId}");

        return true;
    }
}
