<?php

namespace App\Domains\Core\Http\Controllers;

use App\Domains\Core\Application\Actions\ManageCacheAction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CacheController extends Controller
{
    public function __construct(
        private ManageCacheAction $cacheAction
    ) {}

    public function stats(): JsonResponse
    {
        $stats = $this->cacheAction->execute('stats');

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    public function clear(Request $request): JsonResponse
    {
        $pattern = $request->pattern ?? '*';
        $count = $this->cacheAction->execute('clear', ['pattern' => $pattern]);

        return response()->json([
            'success' => true,
            'message' => "Cleared {$count} cache entries",
        ]);
    }

    public function warmup(Request $request): JsonResponse
    {
        $request->validate([
            'keys' => 'required|array',
        ]);

        $this->cacheAction->execute('warmup', ['keys' => $request->keys]);

        return response()->json([
            'success' => true,
            'message' => 'Cache warmed up successfully',
        ]);
    }
}
