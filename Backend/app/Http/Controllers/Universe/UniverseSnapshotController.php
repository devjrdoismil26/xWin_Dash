<?php

namespace App\Http\Controllers\Universe;

use App\Http\Controllers\Controller;
use App\Domains\Universe\Services\UniverseManagementService;
use App\Domains\Universe\Models\UniverseSnapshot;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UniverseSnapshotController extends Controller
{
    public function __construct(
        private UniverseManagementService $service
    ) {}

    public function create(Request $request, string $instanceId): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $snapshot = $this->service->createSnapshot($instanceId, $validated['name']);

        return response()->json($snapshot, 201);
    }

    public function restore(string $snapshotId): JsonResponse
    {
        $this->service->restoreSnapshot($snapshotId);

        return response()->json(['message' => 'Snapshot restored successfully']);
    }

    public function list(string $instanceId): JsonResponse
    {
        $snapshots = UniverseSnapshot::where('instance_id', $instanceId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($snapshots);
    }
}
