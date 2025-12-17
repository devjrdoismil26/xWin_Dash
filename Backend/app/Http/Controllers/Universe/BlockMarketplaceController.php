<?php

namespace App\Http\Controllers\Universe;

use App\Http\Controllers\Controller;
use App\Domains\Universe\Services\BlockMarketplaceService;
use App\Domains\Universe\Repositories\BlockMarketplaceRepository;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BlockMarketplaceController extends Controller
{
    public function __construct(
        private BlockMarketplaceService $service,
        private BlockMarketplaceRepository $repository
    ) {}

    public function index(Request $request): JsonResponse
    {
        $category = $request->input('category');
        $search = $request->input('search');

        if ($search) {
            $blocks = $this->repository->search($search);
        } elseif ($category) {
            $blocks = $this->repository->findByCategory($category, [
                'verified' => $request->boolean('verified'),
                'per_page' => $request->input('per_page', 15),
            ]);
        } else {
            $blocks = \App\Domains\Universe\Models\BlockMarketplace::active()
                ->paginate($request->input('per_page', 15));
        }

        return response()->json($blocks);
    }

    public function featured(): JsonResponse
    {
        $blocks = $this->repository->findFeatured(10);

        return response()->json($blocks);
    }

    public function show(string $id): JsonResponse
    {
        $block = \App\Domains\Universe\Models\BlockMarketplace::with(['ratings', 'installations'])
            ->findOrFail($id);

        return response()->json($block);
    }

    public function install(Request $request, string $id): JsonResponse
    {
        $installation = $this->service->installBlock($id, $request->user()->id);

        return response()->json($installation, 201);
    }

    public function rate(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'nullable|string|max:1000',
        ]);

        $this->service->rateBlock(
            $id,
            $request->user()->id,
            $validated['rating'],
            $validated['review'] ?? null
        );

        return response()->json(['message' => 'Rating submitted successfully']);
    }

    public function search(Request $request): JsonResponse
    {
        $term = $request->input('q', '');
        $blocks = $this->repository->search($term);

        return response()->json($blocks);
    }
}
