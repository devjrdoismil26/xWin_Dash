<?php

namespace App\Domains\Products\Http\Controllers;

use App\Domains\Products\Application\Actions\PublishLandingPageAction;
use App\Domains\Products\Application\DTOs\LandingPageDTO;
use App\Domains\Products\Application\Services\LandingPageBuilderService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LandingPageController extends Controller
{
    public function __construct(
        private LandingPageBuilderService $builderService,
        private PublishLandingPageAction $publishAction
    ) {}

    public function index(): JsonResponse
    {
        $pages = DB::table('landing_pages')->get();

        return response()->json([
            'success' => true,
            'data' => $pages,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => 'required|string',
            'title' => 'required|string',
            'slug' => 'required|string|unique:landing_pages,slug',
            'content' => 'required|array',
        ]);

        $dto = new LandingPageDTO(
            product_id: $request->product_id,
            title: $request->title,
            slug: $request->slug,
            content: $request->content,
            seo: $request->seo ?? [],
            settings: $request->settings ?? []
        );

        $page = $this->builderService->build($dto);

        return response()->json([
            'success' => true,
            'data' => $page,
        ], 201);
    }

    public function publish(string $id): JsonResponse
    {
        $this->publishAction->execute($id);

        return response()->json([
            'success' => true,
            'message' => 'Landing page published successfully',
        ]);
    }

    public function metrics(string $id): JsonResponse
    {
        $page = DB::table('landing_pages')->find($id);

        if (!$page) {
            return response()->json([
                'success' => false,
                'message' => 'Landing page not found',
            ], 404);
        }

        $metrics = $this->builderService->getPerformanceMetrics($page);

        return response()->json([
            'success' => true,
            'data' => $metrics,
        ]);
    }
}
