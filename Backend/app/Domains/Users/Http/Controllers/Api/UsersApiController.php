<?php

namespace App\Domains\Users\Http\Controllers\Api;

use App\Domains\Users\Http\Requests\DeleteUserRequest;
use App\Domains\Users\Http\Requests\StoreUserRequest;
use App\Domains\Users\Http\Requests\UpdateUserRequest;
use App\Domains\Users\Http\Resources\UserResource;
use App\Domains\Users\Services\UserService;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

/**
 * Controller completo para API de usuários
 * Integrado com o frontend React/TypeScript
 */
class UsersApiController extends Controller
{
    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Listar usuários com filtros e paginação
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = User::query();

            // Filtros
            if ($request->has('search')) {
                $search = $request->input('search');
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            if ($request->has('status')) {
                $query->where('status', $request->input('status'));
            }

            if ($request->has('role')) {
                $query->where('role', $request->input('role'));
            }

            if ($request->has('date_from')) {
                $query->whereDate('created_at', '>=', $request->input('date_from'));
            }

            if ($request->has('date_to')) {
                $query->whereDate('created_at', '<=', $request->input('date_to'));
            }

            // Ordenação
            $sortBy = $request->input('sort_by', 'created_at');
            $sortOrder = $request->input('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Paginação
            $perPage = $request->input('per_page', 15);
            $users = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => [
                    'users' => UserResource::collection($users->items()),
                    'pagination' => [
                        'current_page' => $users->currentPage(),
                        'per_page' => $users->perPage(),
                        'total' => $users->total(),
                        'last_page' => $users->lastPage(),
                        'from' => $users->firstItem(),
                        'to' => $users->lastItem(),
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao listar usuários: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Erro interno do servidor'
            ], 500);
        }
    }

    /**
     * Criar novo usuário
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'nullable|string|in:admin,manager,member,guest',
            'status' => 'nullable|string|in:active,inactive,suspended,pending',
            'phone' => 'nullable|string|max:20',
            'timezone' => 'nullable|string|max:50',
            'language' => 'nullable|string|max:10',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => 'Dados inválidos',
                'validation_errors' => $validator->errors()
            ], 422);
        }

        try {
            $userData = $request->only([
                'name', 'email', 'password', 'role', 'status', 
                'phone', 'timezone', 'language'
            ]);

            $userData['password'] = Hash::make($userData['password']);
            $userData['role'] = $userData['role'] ?? 'member';
            $userData['status'] = $userData['status'] ?? 'active';
            $userData['email_verified_at'] = null;

            $user = User::create($userData);

            Log::info("Usuário criado: {$user->email} (ID: {$user->id})");

            return response()->json([
                'success' => true,
                'message' => 'Usuário criado com sucesso',
                'data' => new UserResource($user)
            ], 201);
        } catch (\Exception $e) {
            Log::error('Erro ao criar usuário: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Erro ao criar usuário'
            ], 500);
        }
    }

    /**
     * Exibir usuário específico
     */
    public function show(User $user): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'data' => new UserResource($user)
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao exibir usuário: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Erro ao carregar usuário'
            ], 500);
        }
    }

    /**
     * Atualizar usuário
     */
    public function update(Request $request, User $user): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:8',
            'role' => 'sometimes|string|in:admin,manager,member,guest',
            'status' => 'sometimes|string|in:active,inactive,suspended,pending',
            'phone' => 'sometimes|nullable|string|max:20',
            'timezone' => 'sometimes|nullable|string|max:50',
            'language' => 'sometimes|nullable|string|max:10',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => 'Dados inválidos',
                'validation_errors' => $validator->errors()
            ], 422);
        }

        try {
            $updateData = $request->only([
                'name', 'email', 'role', 'status', 
                'phone', 'timezone', 'language'
            ]);

            if ($request->has('password')) {
                $updateData['password'] = Hash::make($request->password);
            }

            $user->update($updateData);

            Log::info("Usuário atualizado: {$user->email} (ID: {$user->id})");

            return response()->json([
                'success' => true,
                'message' => 'Usuário atualizado com sucesso',
                'data' => new UserResource($user)
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao atualizar usuário: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Erro ao atualizar usuário'
            ], 500);
        }
    }

    /**
     * Excluir usuário
     */
    public function destroy(User $user): JsonResponse
    {
        try {
            $userEmail = $user->email;
            $userId = $user->id;
            
            $user->delete();

            Log::info("Usuário excluído: {$userEmail} (ID: {$userId})");

            return response()->json([
                'success' => true,
                'message' => 'Usuário excluído com sucesso'
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao excluir usuário: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Erro ao excluir usuário'
            ], 500);
        }
    }

    /**
     * Buscar usuários
     */
    public function search(Request $request): JsonResponse
    {
        try {
            $query = $request->input('query');
            $filters = $request->only(['status', 'role', 'date_from', 'date_to']);

            $users = User::query();

            if ($query) {
                $users->where(function ($q) use ($query) {
                    $q->where('name', 'like', "%{$query}%")
                      ->orWhere('email', 'like', "%{$query}%");
                });
            }

            foreach ($filters as $key => $value) {
                if ($value) {
                    if (in_array($key, ['date_from', 'date_to'])) {
                        $users->whereDate('created_at', $key === 'date_from' ? '>=' : '<=', $value);
                    } else {
                        $users->where($key, $value);
                    }
                }
            }

            $results = $users->limit(50)->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'results' => UserResource::collection($results),
                    'total' => $results->count(),
                    'query' => $query,
                    'filters' => $filters
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao buscar usuários: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Erro ao buscar usuários'
            ], 500);
        }
    }

    /**
     * Obter usuários por role
     */
    public function getByRole(Request $request, string $role): JsonResponse
    {
        try {
            $filters = $request->only(['status', 'date_from', 'date_to', 'per_page']);
            
            $users = User::where('role', $role);

            foreach ($filters as $key => $value) {
                if ($value) {
                    if (in_array($key, ['date_from', 'date_to'])) {
                        $users->whereDate('created_at', $key === 'date_from' ? '>=' : '<=', $value);
                    } else {
                        $users->where($key, $value);
                    }
                }
            }

            $perPage = $filters['per_page'] ?? 15;
            $users = $users->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => [
                    'users' => UserResource::collection($users->items()),
                    'pagination' => [
                        'current_page' => $users->currentPage(),
                        'per_page' => $users->perPage(),
                        'total' => $users->total(),
                        'last_page' => $users->lastPage(),
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao obter usuários por role: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Erro ao carregar usuários'
            ], 500);
        }
    }

    /**
     * Obter usuários por status
     */
    public function getByStatus(Request $request, string $status): JsonResponse
    {
        try {
            $filters = $request->only(['role', 'date_from', 'date_to', 'per_page']);
            
            $users = User::where('status', $status);

            foreach ($filters as $key => $value) {
                if ($value) {
                    if (in_array($key, ['date_from', 'date_to'])) {
                        $users->whereDate('created_at', $key === 'date_from' ? '>=' : '<=', $value);
                    } else {
                        $users->where($key, $value);
                    }
                }
            }

            $perPage = $filters['per_page'] ?? 15;
            $users = $users->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => [
                    'users' => UserResource::collection($users->items()),
                    'pagination' => [
                        'current_page' => $users->currentPage(),
                        'per_page' => $users->perPage(),
                        'total' => $users->total(),
                        'last_page' => $users->lastPage(),
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao obter usuários por status: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Erro ao carregar usuários'
            ], 500);
        }
    }

    /**
     * Atualizar status do usuário
     */
    public function updateStatus(Request $request, User $user): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|string|in:active,inactive,suspended,pending'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => 'Status inválido',
                'validation_errors' => $validator->errors()
            ], 422);
        }

        try {
            $user->update(['status' => $request->status]);

            Log::info("Status do usuário atualizado: {$user->email} -> {$request->status}");

            return response()->json([
                'success' => true,
                'message' => 'Status atualizado com sucesso',
                'data' => new UserResource($user)
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao atualizar status: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Erro ao atualizar status'
            ], 500);
        }
    }

    /**
     * Atualizar role do usuário
     */
    public function updateRole(Request $request, User $user): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'role' => 'required|string|in:admin,manager,member,guest'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => 'Role inválido',
                'validation_errors' => $validator->errors()
            ], 422);
        }

        try {
            $user->update(['role' => $request->role]);

            Log::info("Role do usuário atualizado: {$user->email} -> {$request->role}");

            return response()->json([
                'success' => true,
                'message' => 'Role atualizado com sucesso',
                'data' => new UserResource($user)
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao atualizar role: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Erro ao atualizar role'
            ], 500);
        }
    }

    /**
     * Resetar senha do usuário
     */
    public function resetPassword(Request $request, User $user): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'password' => 'required|string|min:8|confirmed'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => 'Senha inválida',
                'validation_errors' => $validator->errors()
            ], 422);
        }

        try {
            $user->update([
                'password' => Hash::make($request->password)
            ]);

            Log::info("Senha do usuário resetada: {$user->email}");

            return response()->json([
                'success' => true,
                'message' => 'Senha resetada com sucesso'
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao resetar senha: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Erro ao resetar senha'
            ], 500);
        }
    }

    /**
     * Enviar email de verificação
     */
    public function sendVerificationEmail(User $user): JsonResponse
    {
        try {
            if ($user->hasVerifiedEmail()) {
                return response()->json([
                    'success' => false,
                    'error' => 'Email já verificado'
                ], 400);
            }

            $user->sendEmailVerificationNotification();

            Log::info("Email de verificação enviado: {$user->email}");

            return response()->json([
                'success' => true,
                'message' => 'Email de verificação enviado com sucesso'
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao enviar email de verificação: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Erro ao enviar email de verificação'
            ], 500);
        }
    }

    /**
     * Obter estatísticas de usuários
     */
    public function getStatistics(): JsonResponse
    {
        try {
            $stats = [
                'total_users' => User::count(),
                'active_users' => User::where('status', 'active')->count(),
                'inactive_users' => User::where('status', 'inactive')->count(),
                'suspended_users' => User::where('status', 'suspended')->count(),
                'pending_users' => User::where('status', 'pending')->count(),
                'new_users_today' => User::whereDate('created_at', today())->count(),
                'users_growth_rate' => $this->calculateGrowthRate(),
                'average_session_duration' => 0, // Implementar se necessário
                'users_by_role' => User::selectRaw('role, COUNT(*) as count')
                    ->groupBy('role')
                    ->pluck('count', 'role')
                    ->toArray(),
                'users_by_status' => User::selectRaw('status, COUNT(*) as count')
                    ->groupBy('status')
                    ->pluck('count', 'status')
                    ->toArray(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao obter estatísticas: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Erro ao carregar estatísticas'
            ], 500);
        }
    }

    /**
     * Operações em lote
     */
    public function bulkUpdate(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'user_ids' => 'required|array',
            'user_ids.*' => 'integer|exists:users,id',
            'updates' => 'required|array',
            'updates.status' => 'sometimes|string|in:active,inactive,suspended,pending',
            'updates.role' => 'sometimes|string|in:admin,manager,member,guest',
            'reason' => 'nullable|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => 'Dados inválidos',
                'validation_errors' => $validator->errors()
            ], 422);
        }

        try {
            $userIds = $request->input('user_ids');
            $updates = $request->input('updates');
            $reason = $request->input('reason');

            $updated = User::whereIn('id', $userIds)->update($updates);

            Log::info("Bulk update realizado: {$updated} usuários atualizados. Motivo: {$reason}");

            return response()->json([
                'success' => true,
                'message' => "{$updated} usuários atualizados com sucesso",
                'data' => [
                    'processed' => count($userIds),
                    'successful' => $updated,
                    'failed' => count($userIds) - $updated,
                    'errors' => []
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Erro no bulk update: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Erro ao atualizar usuários'
            ], 500);
        }
    }

    /**
     * Exclusão em lote
     */
    public function bulkDelete(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'user_ids' => 'required|array',
            'user_ids.*' => 'integer|exists:users,id',
            'reason' => 'required|string|max:255',
            'transfer_data_to' => 'nullable|integer|exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => 'Dados inválidos',
                'validation_errors' => $validator->errors()
            ], 422);
        }

        try {
            $userIds = $request->input('user_ids');
            $reason = $request->input('reason');
            $transferTo = $request->input('transfer_data_to');

            $deleted = User::whereIn('id', $userIds)->delete();

            Log::info("Bulk delete realizado: {$deleted} usuários excluídos. Motivo: {$reason}");

            return response()->json([
                'success' => true,
                'message' => "{$deleted} usuários excluídos com sucesso",
                'data' => [
                    'processed' => count($userIds),
                    'successful' => $deleted,
                    'failed' => count($userIds) - $deleted,
                    'errors' => []
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Erro no bulk delete: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Erro ao excluir usuários'
            ], 500);
        }
    }

    /**
     * Exportar usuários
     */
    public function export(Request $request): JsonResponse
    {
        try {
            $filters = $request->only(['status', 'role', 'date_from', 'date_to']);
            
            $users = User::query();

            foreach ($filters as $key => $value) {
                if ($value) {
                    if (in_array($key, ['date_from', 'date_to'])) {
                        $users->whereDate('created_at', $key === 'date_from' ? '>=' : '<=', $value);
                    } else {
                        $users->where($key, $value);
                    }
                }
            }

            $users = $users->get();

            // Aqui você pode implementar a exportação para CSV, Excel, etc.
            // Por enquanto, retornamos os dados em JSON
            return response()->json([
                'success' => true,
                'data' => [
                    'file_url' => null, // Implementar geração de arquivo
                    'file_name' => 'users-export-' . now()->format('Y-m-d-H-i-s') . '.json',
                    'file_size' => strlen(json_encode($users)),
                    'export_date' => now()->toISOString(),
                    'total_records' => $users->count(),
                    'users' => UserResource::collection($users)
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao exportar usuários: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Erro ao exportar usuários'
            ], 500);
        }
    }

    /**
     * Importar usuários
     */
    public function import(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:csv,xlsx,xls|max:10240', // 10MB max
            'mapping' => 'required|array',
            'mapping.name' => 'required|string',
            'mapping.email' => 'required|string',
            'mapping.role' => 'required|string',
            'mapping.status' => 'required|string',
            'options' => 'required|array',
            'options.skip_duplicates' => 'boolean',
            'options.send_welcome_email' => 'boolean',
            'options.assign_default_role' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => 'Arquivo inválido',
                'validation_errors' => $validator->errors()
            ], 422);
        }

        try {
            $file = $request->file('file');
            $mapping = $request->input('mapping');
            $options = $request->input('options');
            
            $imported = 0;
            $skipped = 0;
            $errors = [];
            $totalRecords = 0;
            
            // Processar arquivo CSV/Excel
            $data = [];
            if ($file->getClientOriginalExtension() === 'csv') {
                $handle = fopen($file->getRealPath(), 'r');
                $header = fgetcsv($handle);
                while (($row = fgetcsv($handle)) !== false) {
                    $data[] = array_combine($header, $row);
                }
                fclose($handle);
            }
            
            $totalRecords = count($data);
            
            foreach ($data as $index => $row) {
                try {
                    $email = $row[$mapping['email']] ?? null;
                    
                    if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                        $errors[] = "Linha " . ($index + 2) . ": Email inválido";
                        $skipped++;
                        continue;
                    }
                    
                    // Verificar duplicatas
                    if ($options['skip_duplicates'] && User::where('email', $email)->exists()) {
                        $skipped++;
                        continue;
                    }
                    
                    // Criar usuário
                    $user = User::create([
                        'name' => $row[$mapping['name']] ?? 'Usuário Importado',
                        'email' => $email,
                        'password' => Hash::make(Str::random(16)),
                        'status' => $row[$mapping['status']] ?? 'active'
                    ]);
                    
                    if ($options['assign_default_role']) {
                        $user->assignRole($row[$mapping['role']] ?? 'user');
                    }
                    
                    if ($options['send_welcome_email']) {
                        // Enviar email de boas-vindas (implementar conforme necessário)
                    }
                    
                    $imported++;
                } catch (\Exception $e) {
                    $errors[] = "Linha " . ($index + 2) . ": " . $e->getMessage();
                    $skipped++;
                }
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Importação concluída',
                'data' => [
                    'total_records' => $totalRecords,
                    'imported' => $imported,
                    'skipped' => $skipped,
                    'errors' => $errors,
                    'import_id' => uniqid()
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao importar usuários: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Erro ao importar usuários'
            ], 500);
        }
    }

    /**
     * Calcular taxa de crescimento
     */
    private function calculateGrowthRate(): float
    {
        $thisMonth = User::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
        
        $lastMonth = User::whereMonth('created_at', now()->subMonth()->month)
            ->whereYear('created_at', now()->subMonth()->year)
            ->count();

        if ($lastMonth == 0) {
            return $thisMonth > 0 ? 100 : 0;
        }

        return (($thisMonth - $lastMonth) / $lastMonth) * 100;
    }
}