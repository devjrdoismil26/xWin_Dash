<?php

namespace App\Http\Controllers\Universe;

use App\Http\Controllers\Controller;
use App\Domains\Universe\Models\UniverseInstance;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UniverseCanvasController extends Controller
{
    public function save(Request $request, string $instanceId): JsonResponse
    {
        $validated = $request->validate([
            'canvas_state' => 'required|array',
        ]);

        $instance = UniverseInstance::findOrFail($instanceId);
        $instance->saveCanvasState($validated['canvas_state']);

        return response()->json(['message' => 'Canvas saved successfully']);
    }

    public function load(string $instanceId): JsonResponse
    {
        $instance = UniverseInstance::with(['blocks.connections'])->findOrFail($instanceId);

        return response()->json([
            'canvas_state' => $instance->canvas_state ?? [],
            'blocks' => $instance->blocks,
        ]);
    }
}
