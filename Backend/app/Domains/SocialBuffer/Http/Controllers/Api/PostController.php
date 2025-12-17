<?php

namespace App\Domains\SocialBuffer\Http\Controllers\Api;

use App\Domains\SocialBuffer\Contracts\PostServiceInterface;
use App\Domains\SocialBuffer\Http\Requests\ListPostsRequest;
use App\Domains\SocialBuffer\Http\Requests\StorePostRequest;
use App\Domains\SocialBuffer\Http\Requests\UpdatePostRequest;
use App\Domains\SocialBuffer\Http\Requests\UpdatePostStatusRequest;
use App\Domains\SocialBuffer\Models\SocialPost;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

/**
 * PostController
 * 
 * SECURITY FIX (AUTH-007): Implementada autorização e multi-tenancy
 */
class PostController extends Controller
{
    protected PostServiceInterface $postService;

    public function __construct(PostServiceInterface $postService)
    {
        $this->postService = $postService;
    }

    /**
     * Get current project ID for multi-tenancy
     */
    protected function getProjectId(): ?string
    {
        return session('selected_project_id');
    }

    /**
     * Display a listing of the posts.
     *
     * @param ListPostsRequest $request
     *
     * @return JsonResponse
     */
    public function index(ListPostsRequest $request): JsonResponse
    {
        // SECURITY: Filtrar por projeto
        $filters = array_merge($request->validated(), [
            'project_id' => $this->getProjectId()
        ]);
        
        $posts = $this->postService->getAllPosts(auth()->id(), $filters);
        return response()->json($posts);
    }

    /**
     * Store a newly created post in storage.
     *
     * @param StorePostRequest $request
     *
     * @return JsonResponse
     */
    public function store(StorePostRequest $request): JsonResponse
    {
        // SECURITY: Autorização e project_id
        $this->authorize('create', SocialPost::class);
        
        $data = array_merge($request->validated(), [
            'project_id' => $this->getProjectId()
        ]);
        
        $post = $this->postService->createPost(auth()->id(), $data);
        return response()->json($post, 201);
    }

    /**
     * Display the specified post.
     *
     * @param int $id
     *
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $post = $this->postService->getPostById($id);
        if (!$post) {
            return response()->json(['message' => 'Post not found.'], 404);
        }
        
        // SECURITY: Verificar autorização
        $postModel = SocialPost::find($id);
        if ($postModel) {
            $this->authorize('view', $postModel);
        }
        
        return response()->json($post);
    }

    /**
     * Update the specified post in storage.
     *
     * @param UpdatePostRequest $request
     * @param int               $id
     *
     * @return JsonResponse
     */
    public function update(UpdatePostRequest $request, int $id): JsonResponse
    {
        // SECURITY: Verificar autorização
        $postModel = SocialPost::find($id);
        if ($postModel) {
            $this->authorize('update', $postModel);
        }
        
        $post = $this->postService->updatePost($id, $request->validated());
        if (!$post) {
            return response()->json(['message' => 'Post not found.'], 404);
        }
        return response()->json($post);
    }

    /**
     * Update the status of the specified post.
     *
     * @param UpdatePostStatusRequest $request
     * @param int                     $id
     *
     * @return JsonResponse
     */
    public function updateStatus(UpdatePostStatusRequest $request, int $id): JsonResponse
    {
        try {
            $post = $this->postService->updatePostStatus($id, $request->status);
            return response()->json($post);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * Remove the specified post from storage.
     *
     * @param int $id
     *
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        // SECURITY: Verificar autorização
        $postModel = SocialPost::find($id);
        if ($postModel) {
            $this->authorize('delete', $postModel);
        }
        
        $success = $this->postService->deletePost($id);
        if (!$success) {
            return response()->json(['message' => 'Post not found.'], 404);
        }
        return response()->json(['message' => 'Post deleted successfully.']);
    }
}
