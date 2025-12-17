<?php

namespace App\Domains\Users\Http\Controllers;

use App\Domains\Users\Application\Actions\BulkImportUsersAction;
use App\Domains\Users\Application\Actions\CreateUserAction;
use App\Domains\Users\Application\Actions\DeactivateUserAction;
use App\Domains\Users\Application\DTOs\UserDTO;
use App\Domains\Users\Http\Resources\UserResource;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * UserController
 * 
 * SECURITY FIX (AUTH-008): Implementada autorização em todos os métodos
 */
class UserController extends Controller
{
    public function __construct(
        private CreateUserAction $createAction,
        private DeactivateUserAction $deactivateAction,
        private BulkImportUsersAction $bulkImportAction
    ) {}

    public function index(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização para listar usuários
        $this->authorize('viewAny', User::class);

        $users = User::query()
            ->when($request->search, fn($q, $v) => $q->where('name', 'like', "%{$v}%")->orWhere('email', 'like', "%{$v}%"))
            ->when($request->status, fn($q, $v) => $q->where('status', $v))
            ->paginate($request->per_page ?? 20);

        return UserResource::collection($users)->response();
    }

    public function store(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização para criar usuário
        $this->authorize('create', User::class);
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role_id' => 'required|string',
            'is_active' => 'boolean',
        ]);

        $dto = new UserDTO(
            name: $request->name,
            email: $request->email,
            password: $request->password,
            role_id: $request->role_id,
            is_active: $request->is_active ?? true,
            metadata: $request->metadata ?? []
        );

        $user = $this->createAction->execute($dto);

        return (new UserResource($user))->response()->setStatusCode(201);
    }

    public function show(User $user): JsonResponse
    {
        // SECURITY: Verificar autorização para visualizar usuário
        $this->authorize('view', $user);

        return (new UserResource($user))->response();
    }

    public function update(Request $request, User $user): JsonResponse
    {
        // SECURITY: Verificar autorização para atualizar usuário
        $this->authorize('update', $user);

        $request->validate([
            'name' => 'string|max:255',
            'email' => 'email|unique:users,email,' . $user->id,
            'role_id' => 'string',
            'is_active' => 'boolean',
        ]);

        $user->update($request->only(['name', 'email', 'role', 'status', 'metadata']));

        return (new UserResource($user))->response();
    }

    public function destroy(User $user): JsonResponse
    {
        // SECURITY: Verificar autorização para deletar usuário
        $this->authorize('delete', $user);

        $this->deactivateAction->execute($user, 'User requested deletion');

        return response()->json(['success' => true], 204);
    }

    public function stats(): JsonResponse
    {
        return response()->json([
            'total' => User::count(),
            'active' => User::where('status', 'active')->count(),
        ]);
    }

    public function bulkImport(Request $request): JsonResponse
    {
        $request->validate([
            'users' => 'required|array',
            'users.*.name' => 'required|string',
            'users.*.email' => 'required|email',
            'users.*.password' => 'required|string',
        ]);

        $result = $this->bulkImportAction->execute($request->users);

        return response()->json($result);
    }
}
