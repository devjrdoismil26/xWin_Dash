<?php

namespace App\Domains\Analytics\Http\Controllers;

use App\Domains\Analytics\Application\Actions\CalculateMetricsAction;
use App\Domains\Analytics\Application\DTOs\MetricDTO;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MetricsController extends Controller
{
    public function __construct(
        private readonly CalculateMetricsAction $calculateMetricsAction
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $period = $request->query('period', 'month');
        $userId = $request->user()->id;
        
        $metrics = $this->calculateMetricsAction->executeForPeriod($period, $userId);
        
        return response()->json($metrics);
    }

    public function calculate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'type' => 'required|string',
            'value' => 'required',
            'period' => 'nullable|string',
            'metadata' => 'nullable|array',
        ]);

        $dto = MetricDTO::fromArray($validated);
        $result = $this->calculateMetricsAction->execute($dto);

        return response()->json($result);
    }

    public function show(string $id): JsonResponse
    {
        // Implementar busca de métrica específica
        return response()->json(['id' => $id]);
    }
}
