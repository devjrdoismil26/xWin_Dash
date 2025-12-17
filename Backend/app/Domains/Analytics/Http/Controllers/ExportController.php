<?php

namespace App\Domains\Analytics\Http\Controllers;

use App\Domains\Analytics\Application\Actions\ExportDataAction;
use App\Domains\Analytics\Application\DTOs\ExportConfigDTO;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExportController extends Controller
{
    public function __construct(
        private readonly ExportDataAction $exportDataAction
    ) {
    }

    public function csv(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'data' => 'required|array',
            'filename' => 'nullable|string',
            'options' => 'nullable|array',
        ]);

        $dto = ExportConfigDTO::fromArray(array_merge($validated, ['format' => 'csv']));
        $url = $this->exportDataAction->execute($dto);

        return response()->json(['url' => $url]);
    }

    public function pdf(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'data' => 'required|array',
            'filename' => 'nullable|string',
            'options' => 'nullable|array',
        ]);

        $dto = ExportConfigDTO::fromArray(array_merge($validated, ['format' => 'pdf']));
        $url = $this->exportDataAction->execute($dto);

        return response()->json(['url' => $url]);
    }

    public function excel(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'data' => 'required|array',
            'filename' => 'nullable|string',
            'options' => 'nullable|array',
        ]);

        $dto = ExportConfigDTO::fromArray(array_merge($validated, ['format' => 'excel']));
        $url = $this->exportDataAction->execute($dto);

        return response()->json(['url' => $url]);
    }
}
