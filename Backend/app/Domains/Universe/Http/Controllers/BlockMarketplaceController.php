<?php

namespace App\Domains\Universe\Http\Controllers;

use App\Domains\Universe\Services\BlockMarketplaceService;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class BlockMarketplaceController extends Controller
{
    protected BlockMarketplaceService $blockMarketplaceService;

    public function __construct(BlockMarketplaceService $blockMarketplaceService)
    {
        $this->blockMarketplaceService = $blockMarketplaceService;
    }

    /**
     * Get all blocks with filters and pagination
     */
    public function apiIndex(Request $request): JsonResponse
    {
        try {
            $filters = $request->only([
                'search', 'category', 'author_id', 'is_premium',
                'is_featured', 'is_new', 'sort_by', 'per_page'
            ]);

            $blocks = $this->blockMarketplaceService->getBlocks($filters);

            return response()->json([
                'success' => true,
                'data' => $blocks,
                'message' => 'Blocks retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve blocks',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific block with details
     */
    public function apiShow(int $id): JsonResponse
    {
        try {
            $block = $this->blockMarketplaceService->getBlockWithDetails($id);

            if (!$block) {
                return response()->json([
                    'success' => false,
                    'message' => 'Block not found'
                ], 404);
            }

            // Add user-specific data
            $userId = (string) Auth::id();
            $block->is_installed = $this->blockMarketplaceService->isBlockInstalled($userId, $id);
            $block->user_rating = $this->blockMarketplaceService->getUserRating($userId, $id);
            $block->stats = $this->blockMarketplaceService->getBlockStats($id);

            return response()->json([
                'success' => true,
                'data' => $block,
                'message' => 'Block retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve block',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Install a block
     */
    public function apiInstall(Request $request, int $id): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'instance_id' => 'nullable|integer|exists:universe_instances,id'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $userId = (string) Auth::id();
            $instanceId = $request->input('instance_id');

            $result = $this->blockMarketplaceService->installBlock($userId, $id, $instanceId);

            if ($result['success']) {
                return response()->json([
                    'success' => true,
                    'data' => $result['installation'],
                    'message' => $result['message']
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => $result['message']
                ], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to install block',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Uninstall a block
     */
    public function apiUninstall(int $id): JsonResponse
    {
        try {
            $userId = (string) Auth::id();
            $result = $this->blockMarketplaceService->uninstallBlock($userId, $id);

            if ($result['success']) {
                return response()->json([
                    'success' => true,
                    'message' => $result['message']
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => $result['message']
                ], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to uninstall block',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Rate a block
     */
    public function apiRate(Request $request, int $id): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'rating' => 'required|integer|min:1|max:5',
                'review' => 'nullable|string|max:1000'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $userId = (string) Auth::id();
            $rating = $request->input('rating');
            $review = $request->input('review');

            $result = $this->blockMarketplaceService->rateBlock($userId, $id, $rating, $review);

            if ($result['success']) {
                return response()->json([
                    'success' => true,
                    'data' => $result['rating'],
                    'message' => $result['message']
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => $result['message']
                ], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to rate block',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Search blocks
     */
    public function apiSearch(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'query' => 'required|string|min:2|max:100'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $query = $request->input('query');
            $filters = $request->only(['category', 'is_premium', 'per_page']);

            $blocks = $this->blockMarketplaceService->searchBlocks($query, $filters);

            return response()->json([
                'success' => true,
                'data' => $blocks,
                'message' => 'Search completed successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Search failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get categories
     */
    public function apiCategories(): JsonResponse
    {
        try {
            $categories = $this->blockMarketplaceService->getCategories();

            return response()->json([
                'success' => true,
                'data' => $categories,
                'message' => 'Categories retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve categories',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get popular blocks
     */
    public function apiPopular(Request $request): JsonResponse
    {
        try {
            $limit = $request->input('limit', 10);
            $blocks = $this->blockMarketplaceService->getPopularBlocks($limit);

            return response()->json([
                'success' => true,
                'data' => $blocks,
                'message' => 'Popular blocks retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve popular blocks',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get recommended blocks for user
     */
    public function apiRecommended(Request $request): JsonResponse
    {
        try {
            $userId = (string) Auth::id();
            $limit = $request->input('limit', 10);
            $blocks = $this->blockMarketplaceService->getRecommendedBlocks($userId, $limit);

            return response()->json([
                'success' => true,
                'data' => $blocks,
                'message' => 'Recommended blocks retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve recommended blocks',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get featured blocks
     */
    public function apiFeatured(Request $request): JsonResponse
    {
        try {
            $limit = $request->input('limit', 6);
            $blocks = $this->blockMarketplaceService->getFeaturedBlocks($limit);

            return response()->json([
                'success' => true,
                'data' => $blocks,
                'message' => 'Featured blocks retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve featured blocks',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get new blocks
     */
    public function apiNew(Request $request): JsonResponse
    {
        try {
            $limit = $request->input('limit', 6);
            $blocks = $this->blockMarketplaceService->getNewBlocks($limit);

            return response()->json([
                'success' => true,
                'data' => $blocks,
                'message' => 'New blocks retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve new blocks',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user's installed blocks
     */
    public function apiUserInstallations(): JsonResponse
    {
        try {
            $userId = (string) Auth::id();
            $installations = $this->blockMarketplaceService->getUserInstallations($userId);

            return response()->json([
                'success' => true,
                'data' => $installations,
                'message' => 'User installations retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve user installations',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get block preview
     */
    public function apiPreview(int $id): JsonResponse
    {
        try {
            $preview = $this->blockMarketplaceService->getBlockPreview($id);

            if (!$preview) {
                return response()->json([
                    'success' => false,
                    'message' => 'Block not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => ['preview_url' => $preview],
                'message' => 'Block preview retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve block preview',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get installation instructions
     */
    public function apiInstallationInstructions(int $id): JsonResponse
    {
        try {
            $instructions = $this->blockMarketplaceService->getInstallationInstructions($id);

            if (!$instructions) {
                return response()->json([
                    'success' => false,
                    'message' => 'Block not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $instructions,
                'message' => 'Installation instructions retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve installation instructions',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
