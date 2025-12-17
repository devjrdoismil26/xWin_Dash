<?php

namespace App\Domains\Analytics\Http\Controllers;

use App\Domains\Analytics\Application\Actions\CalculateKPIsAction;
use App\Domains\Analytics\Application\DTOs\KPIConfigDTO;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class KPIsController extends Controller
{
    public function __construct(
        private readonly CalculateKPIsAction $calculateKPIsAction
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $kpis = $this->calculateKPIsAction->executeAll($userId);
        
        return response()->json($kpis);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'metric' => 'required|string',
            'target' => 'nullable|numeric',
            'unit' => 'nullable|string',
            'thresholds' => 'nullable|array',
        ]);

        $dto = KPIConfigDTO::fromArray($validated);
        $result = $this->calculateKPIsAction->execute($dto);

        return response()->json($result, 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        // Atualizar KPI
        return response()->json(['message' => 'KPI updated successfully']);
    }

    public function destroy(string $id): JsonResponse
    {
        // Deletar KPI
        return response()->json(['message' => 'KPI deleted successfully']);
    }
}
