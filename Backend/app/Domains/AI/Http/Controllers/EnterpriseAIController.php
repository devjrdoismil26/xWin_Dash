<?php

namespace App\Domains\AI\Http\Controllers;

use App\Domains\AI\Services\EnterpriseAIOrchestrator;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class EnterpriseAIController extends Controller
{
    protected EnterpriseAIOrchestrator $orchestrator;

    public function __construct(EnterpriseAIOrchestrator $orchestrator)
    {
        $this->orchestrator = $orchestrator;
        // Middleware para verificar se o usuário tem acesso ao plano Enterprise
        // $this->middleware('plan:enterprise');
    }

    /**
     * Exemplo de um endpoint que dispara um workflow complexo.
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function generateFullReport(Request $request)
    {
        try {
            $jobId = $this->orchestrator->startFullReportGenerationJob(
                $request->user(),
                $request->input('dataset_id'),
            );

            return response()->json(['message' => 'Full report generation started.', 'job_id' => $jobId], 202);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
