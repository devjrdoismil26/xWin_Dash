<?php

namespace App\Domains\SocialBuffer\Http\Controllers;

use App\Domains\Core\Http\Controllers\Controller;
use App\Domains\SocialBuffer\Http\Requests\ListSocialAccountsRequest;
use App\Domains\SocialBuffer\Http\Requests\StoreSocialAccountRequest;
use App\Domains\SocialBuffer\Http\Requests\UpdateSocialAccountRequest;
use App\Domains\SocialBuffer\Http\Resources\SocialAccountResource;
use App\Domains\SocialBuffer\Infrastructure\Persistence\Eloquent\SocialAccountModel as SocialAccount;
use App\Domains\SocialBuffer\Application\Services\SocialBufferApplicationService;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;

/**
 * SocialAccountController
 * 
 * SECURITY FIX (AUTH-004): Implementada autorização em todos os métodos
 */
class SocialAccountController extends Controller
{
    public function __construct(
        private SocialBufferApplicationService $socialBufferApplicationService,
    ) {
    }

    public function index(ListSocialAccountsRequest $request): JsonResponse
    {
        // SECURITY: Verificar autorização para listar contas sociais
        $this->authorize('viewAny', SocialAccount::class);

        $validated = $request->validated();

        $filters = [
            'platform' => $validated['platform'] ?? null,
            'is_active' => $validated['is_active'] ?? null,
            'per_page' => $validated['per_page'] ?? 15,
            'page' => $validated['page'] ?? 1,
            'search' => $validated['search'] ?? null,
            'sort_by' => $validated['sort_by'] ?? 'created_at',
            'sort_direction' => $validated['sort_direction'] ?? 'desc'
        ];

        $result = $this->socialBufferApplicationService->listSocialAccounts(auth()->id(), $filters);

        if (!$result['success']) {
            return response()->json($result, 400);
        }

        return SocialAccountResource::collection($result['data']['accounts'])->additional([
            'message' => 'Contas sociais listadas com sucesso.',
            'pagination' => $result['data']['pagination']
        ])->response();
    }

    public function store(StoreSocialAccountRequest $request): JsonResponse
    {
        // SECURITY: Verificar autorização para criar conta social
        $this->authorize('create', SocialAccount::class);

        $validated = $request->validated();
        $validated['user_id'] = auth()->id();
        $validated['project_id'] = session('selected_project_id'); // Multi-tenancy

        $result = $this->socialBufferApplicationService->createSocialAccount($validated);

        if (!$result['success']) {
            return response()->json($result, 400);
        }

        return (new SocialAccountResource($result['data']))->additional([
            'message' => 'Conta social conectada com sucesso.',
        ])->response()->setStatusCode(201);
    }

    public function show(SocialAccount $account): JsonResponse
    {
        $this->authorize('view', $account);
        return (new SocialAccountResource($account))->additional([
            'message' => 'Conta social detalhada com sucesso.',
        ])->response();
    }

    public function update(UpdateSocialAccountRequest $request, SocialAccount $account): JsonResponse
    {
        $this->authorize('update', $account);
        $validated = $request->validated();
        $validated['account_id'] = $account->id;
        $validated['user_id'] = auth()->id();

        $result = $this->socialBufferApplicationService->updateSocialAccount($account->id, $validated);

        if (!$result['success']) {
            return response()->json($result, 400);
        }

        return (new SocialAccountResource($result['data']))->additional([
            'message' => 'Conta social atualizada com sucesso.',
        ])->response();
    }

    public function destroy(SocialAccount $account): JsonResponse
    {
        $this->authorize('delete', $account);

        $result = $this->socialBufferApplicationService->deleteSocialAccount($account->id, auth()->id());

        if (!$result['success']) {
            return response()->json($result, 400);
        }

        return response()->json($result);
    }

    public function refreshToken(SocialAccount $account): JsonResponse
    {
        $this->authorize('update', $account);
        $this->accountService->refreshAccessToken($account->id);
        return response()->json([
            'message' => 'Token atualizado com sucesso.',
        ]);
    }

    public function renderSocialAccountsPage(): \Inertia\Response
    {
        return Inertia::render('SocialBuffer/Accounts/Index');
    }
}
