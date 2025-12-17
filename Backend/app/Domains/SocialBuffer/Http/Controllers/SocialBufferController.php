<?php

namespace App\Domains\SocialBuffer\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Domains\SocialBuffer\Application\Services\SocialBufferApplicationService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SocialBufferController extends Controller
{
    protected SocialBufferApplicationService $socialBufferApplicationService;

    public function __construct(SocialBufferApplicationService $socialBufferApplicationService)
    {
        $this->socialBufferApplicationService = $socialBufferApplicationService;
    }
    /**
     * Display a listing of the resource.
     * SECURITY FIX (AUTH-004): Adicionada autorização
     */
    public function index(): Response
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', \App\Domains\SocialBuffer\Models\SocialPost::class);
        
        return Inertia::render('SocialBuffer/Index', [
            'posts' => [],
            'accounts' => [],
            'stats' => [
                'totalPosts' => 0,
                'scheduledPosts' => 0,
                'publishedPosts' => 0,
                'connectedAccounts' => 0,
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     * SECURITY FIX (AUTH-004): Adicionada autorização
     */
    public function create(): Response
    {
        // SECURITY: Verificar autorização
        $this->authorize('create', \App\Domains\SocialBuffer\Models\SocialPost::class);
        
        return Inertia::render('SocialBuffer/Create', [
            'accounts' => []
        ]);
    }

    /**
     * Store a newly created resource in storage.
     * SECURITY FIX (AUTH-004): Adicionada autorização
     */
    public function store(Request $request)
    {
        // SECURITY: Verificar autorização
        $this->authorize('create', \App\Domains\SocialBuffer\Models\SocialPost::class);
        
        $validated = $request->validate([
            'content' => 'required|string|max:280',
            'social_account_ids' => 'required|array|min:1',
            'social_account_ids.*' => 'integer|exists:social_accounts,id',
            'scheduled_at' => 'nullable|date|after:now',
            'media_ids' => 'nullable|array',
            'media_ids.*' => 'integer|exists:media,id',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50'
        ]);

        $data = array_merge($validated, ['user_id' => auth()->id()]);
        $result = $this->socialBufferApplicationService->createPost($data);

        if (!$result['success']) {
            return redirect()->back()
                ->withErrors($result['errors'])
                ->withInput();
        }

        return redirect()->route('social-buffer.index')
            ->with('success', 'Post agendado com sucesso!');
    }

    /**
     * Display the specified resource.
     * SECURITY FIX (AUTH-004): Adicionada autorização
     */
    public function show(string $id): Response
    {
        // SECURITY: Verificar autorização
        $post = \App\Domains\SocialBuffer\Models\SocialPost::find($id);
        if ($post) {
            $this->authorize('view', $post);
        }
        
        return Inertia::render('SocialBuffer/Show', [
            'post' => [],
            'analytics' => []
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     * SECURITY FIX (AUTH-004): Adicionada autorização
     */
    public function edit(string $id): Response
    {
        // SECURITY: Verificar autorização
        $post = \App\Domains\SocialBuffer\Models\SocialPost::find($id);
        if ($post) {
            $this->authorize('update', $post);
        }
        
        return Inertia::render('SocialBuffer/Edit', [
            'post' => [],
            'accounts' => []
        ]);
    }

    /**
     * Update the specified resource in storage.
     * SECURITY FIX (AUTH-004): Adicionada autorização
     */
    public function update(Request $request, string $id)
    {
        // SECURITY: Verificar autorização
        $post = \App\Domains\SocialBuffer\Models\SocialPost::find($id);
        if ($post) {
            $this->authorize('update', $post);
        }
        
        $validated = $request->validate([
            'content' => 'required|string|max:280',
            'social_account_ids' => 'required|array|min:1',
            'social_account_ids.*' => 'integer|exists:social_accounts,id',
            'scheduled_at' => 'nullable|date|after:now',
            'media_ids' => 'nullable|array',
            'media_ids.*' => 'integer|exists:media,id',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50'
        ]);

        $data = array_merge($validated, [
            'post_id' => $id,
            'user_id' => auth()->id()
        ]);

        $result = $this->socialBufferApplicationService->updatePost($id, $data);

        if (!$result['success']) {
            return redirect()->back()
                ->withErrors($result['errors'])
                ->withInput();
        }

        return redirect()->route('social-buffer.index')
            ->with('success', 'Post atualizado com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     * SECURITY FIX (AUTH-004): Adicionada autorização
     */
    public function destroy(string $id)
    {
        // SECURITY: Verificar autorização
        $post = \App\Domains\SocialBuffer\Models\SocialPost::find($id);
        if ($post) {
            $this->authorize('delete', $post);
        }
        
        $result = $this->socialBufferApplicationService->deletePost($id, auth()->id());

        if (!$result['success']) {
            return redirect()->back()
                ->withErrors($result['errors']);
        }

        return redirect()->route('social-buffer.index')
            ->with('success', 'Post excluído com sucesso!');
    }
}
