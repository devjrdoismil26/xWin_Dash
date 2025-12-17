<?php

namespace App\Domains\Analytics\Http\Controllers;

use App\Domains\Analytics\Application\Actions\GenerateReportAction;
use App\Domains\Analytics\Application\DTOs\ReportDTO;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportsController extends Controller
{
    public function __construct(
        private readonly GenerateReportAction $generateReportAction
    ) {
    }

    public function index(): JsonResponse
    {
        // Listar relatórios salvos
        return response()->json([]);
    }

    public function generate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'type' => 'required|string',
            'config' => 'required|array',
            'filters' => 'nullable|array',
        ]);

        $dto = ReportDTO::fromArray(array_merge($validated, [
            'user_id' => $request->user()->id,
        ]));

        $report = $this->generateReportAction->execute($dto);

        return response()->json($report);
    }

    public function show(string $id): JsonResponse
    {
        // Buscar relatório específico
        return response()->json(['id' => $id]);
    }

    public function destroy(string $id): JsonResponse
    {
        // Deletar relatório
        return response()->json(['message' => 'Report deleted successfully']);
    }
}
