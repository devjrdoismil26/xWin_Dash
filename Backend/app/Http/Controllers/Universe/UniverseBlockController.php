<?php

namespace App\Http\Controllers\Universe;

use App\Http\Controllers\Controller;
use App\Domains\Universe\Services\BlockInstallationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UniverseBlockController extends Controller
{
    public function __construct(
        private BlockInstallationService $service
    ) {}

    public function add(Request $request, string $instanceId): JsonResponse
    {
        $validated = $request->validate([
            'block_type' => 'required|string',
            'config' => 'required|array',
            'position' => 'required|array',
        ]);

        $block = $this->service->addBlockToInstance(
            $instanceId,
            $validated['block_type'],
            array_merge($validated['config'], ['position' => $validated['position']])
        );

        return response()->json($block, 201);
    }

    public function remove(string $instanceId, string $blockId): JsonResponse
    {
        $this->service->removeBlockFromInstance($instanceId, $blockId);

        return response()->json(['message' => 'Block removed successfully']);
    }

    public function update(Request $request, string $blockId): JsonResponse
    {
        $validated = $request->validate([
            'config' => 'required|array',
        ]);

        $block = $this->service->updateBlockConfig($blockId, $validated['config']);

        return response()->json($block);
    }

    public function connect(Request $request, string $sourceId, string $targetId): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'nullable|string',
            'config' => 'nullable|array',
        ]);

        $connection = $this->service->connectBlocks($sourceId, $targetId, $validated);

        return response()->json($connection, 201);
    }
}
